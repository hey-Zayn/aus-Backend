const Visa = require('../Models/Visa.Model');
const cloudinary = require('../Config/Cloudinary/cloudinary');
const logger = require('../lib/logger');

// @desc    Create a new visa record
// @route   POST /api/v2/visa
// @access  Private
exports.createVisa = async (req, res) => {
    try {
        const { visaHolderImage, ...visaData } = req.body;

        if (!visaHolderImage) {
            return res.status(400).json({ message: "Visa holder image is required" });
        }

        // Upload image to Cloudinary (assuming base64 from frontend)
        const uploadResponse = await cloudinary.uploader.upload(visaHolderImage, {
            folder: 'aus_visas'
        });

        const newVisa = new Visa({
            ...visaData,
            visaHolderImage: uploadResponse.secure_url,
            imagePublicId: uploadResponse.public_id,
            user: req.user._id // From auth middleware
        });

        await newVisa.save();

        logger.info(`Visa created successfully for user: ${req.user._id}`);
        res.status(201).json({
            success: true,
            message: "Visa created successfully",
            data: newVisa
        });

    } catch (error) {
        logger.error(`Error creating visa: ${error.message}`);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// @desc    Get all visas with pagination, search, and filters
// @route   GET /api/v2/visa/all?page=1&limit=10&search=&visaClass=&visaStatus=&nationality=
// @access  Private
exports.getAllVisas = async (req, res) => {
    try {
        const page       = Math.max(1, parseInt(req.query.page)  || 1);
        const limit      = Math.max(1, parseInt(req.query.limit) || 10);
        const skip       = (page - 1) * limit;
        const search     = req.query.search     || '';
        const visaClass  = req.query.visaClass  || '';
        const visaStatus = req.query.visaStatus || '';
        const nationality = req.query.nationality || '';

        // Base filter — always scope to authenticated user
        const filter = { user: req.user._id };

        // Search: fullName OR passportNumber
        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { 'passportDetails.passportNumber': { $regex: search, $options: 'i' } },
                { referenceNumber: { $regex: search, $options: 'i' } }
            ];
        }

        // Category filters
        if (visaClass)   filter['visaDetails.visaClass']  = visaClass;
        if (visaStatus)  filter['visaDetails.visaStatus'] = visaStatus;
        if (nationality) filter.nationality = { $regex: nationality, $options: 'i' };

        const [visas, totalCount] = await Promise.all([
            Visa.find(filter)
                .select('fullName dateOfBirth gender nationality visaHolderImage passportDetails.passportNumber visaDetails.visaClass visaDetails.visaSubclass visaDetails.visaStatus visaDetails.visaGrantNumber visaDetails.visaExpiryDate createdAt')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Visa.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            success: true,
            data: visas,
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        logger.error(`Error fetching visas: ${error.message}`);
        res.status(500).json({ message: "Internal server error" });
    }
};


// @desc    Get single visa details
// @route   GET /api/v2/visa/:id
// @access  Private
exports.getVisaById = async (req, res) => {
    try {
        const visa = await Visa.findOne({ _id: req.params.id, user: req.user._id });

        if (!visa) {
            return res.status(404).json({ message: "Visa not found" });
        }

        res.status(200).json({
            success: true,
            data: visa
        });
    } catch (error) {
        logger.error(`Error fetching visa: ${error.message}`);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Update visa details
// @route   PUT /api/v2/visa/:id
// @access  Private
exports.updateVisa = async (req, res) => {
    try {
        let visa = await Visa.findOne({ _id: req.params.id, user: req.user._id });

        if (!visa) {
            return res.status(404).json({ message: "Visa not found" });
        }

        const { visaHolderImage, ...updateData } = req.body;

        // If a new image is provided, upload it and delete the old one
        if (visaHolderImage && visaHolderImage.startsWith('data:image')) {
            // Delete old image
            await cloudinary.uploader.destroy(visa.imagePublicId);

            // Upload new image
            const uploadResponse = await cloudinary.uploader.upload(visaHolderImage, {
                folder: 'aus_visas'
            });

            updateData.visaHolderImage = uploadResponse.secure_url;
            updateData.imagePublicId = uploadResponse.public_id;
        }

        visa = await Visa.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        logger.info(`Visa updated successfully: ${req.params.id}`);
        res.status(200).json({
            success: true,
            message: "Visa updated successfully",
            data: visa
        });

    } catch (error) {
        logger.error(`Error updating visa: ${error.message}`);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// @desc    Delete visa record
// @route   DELETE /api/v2/visa/:id
// @access  Private
exports.deleteVisa = async (req, res) => {
    try {
        const visa = await Visa.findOne({ _id: req.params.id, user: req.user._id });

        if (!visa) {
            return res.status(404).json({ message: "Visa not found" });
        }

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(visa.imagePublicId);

        // Use findOneAndDelete or deleteOne
        await Visa.findByIdAndDelete(req.params.id);

        logger.info(`Visa deleted successfully: ${req.params.id}`);
        res.status(200).json({
            success: true,
            message: "Visa deleted successfully"
        });

    } catch (error) {
        logger.error(`Error deleting visa: ${error.message}`);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Verify visa status (VEVO Enquiry)
// @route   POST /api/v2/visa/verify
// @access  Public (But requires exact matching)
exports.verifyVisa = async (req, res) => {
    try {
        const { 
            docType, 
            referenceType, 
            referenceNumber, 
            dateOfBirth, 
            documentNumber, 
            countryOfDocument 
        } = req.body;

        logger.info(`VEVO enquiry received for DocType: ${docType}`);

        // Build a date range for DOB to avoid timezone-related exact-match failures
        const dobStart = new Date(dateOfBirth);
        dobStart.setUTCHours(0, 0, 0, 0);
        const dobEnd = new Date(dateOfBirth);
        dobEnd.setUTCHours(23, 59, 59, 999);

        // Construct query based on document type
        let query = {
            dateOfBirth: { $gte: dobStart, $lte: dobEnd }
        };

        if (docType === 'Passport') {
            query['passportDetails.passportNumber'] = documentNumber.toUpperCase();
            query['referenceNumber'] = referenceNumber;
        } else if (docType === 'ImmiCard') {
            query['referenceNumber'] = referenceNumber;
        } else {
            // DFTTA, PLO56, Titre de Voyage — match by reference number only
            query['referenceNumber'] = referenceNumber;
        }

        const visa = await Visa.findOne(query)
            .select('fullName dateOfBirth visaDetails conditions passportDetails visaHolderImage');

        if (!visa) {
            logger.warn(`VEVO enquiry failed: No match found for provided details.`);
            return res.status(404).json({ 
                success: false, 
                message: "No visa record found. Please check your details and try again." 
            });
        }

        logger.info(`VEVO enquiry successful for: ${visa.fullName}`);
        res.status(200).json({
            success: true,
            message: "Visa record found successfully",
            data: visa
        });

    } catch (error) {
        logger.error(`VEVO verification error: ${error.message}`);
        res.status(500).json({ message: "Internal server error during verification" });
    }
};

// @desc    Send generated document via email
// @route   POST /api/v2/visa/:id/send-email
// @access  Private
exports.sendVisaEmail = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, documentType, fileName, pdfBase64 } = req.body;

        if (!email || !pdfBase64) {
            return res.status(400).json({ message: "Email and document content are required" });
        }

        const visa = await Visa.findById(id);
        if (!visa) {
            return res.status(404).json({ message: "Visa record not found" });
        }

        // Convert base64 to Buffer
        const pdfBuffer = Buffer.from(pdfBase64.split(',')[1] || pdfBase64, 'base64');

        const { sendDocumentEmail } = require('../lib/email');
        await sendDocumentEmail(email, visa.fullName, documentType, pdfBuffer, fileName);

        res.status(200).json({ success: true, message: `Document sent to ${email}` });
    } catch (error) {
        logger.error(`Error sending visa email: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};
