const mongoose = require('mongoose');

const visaSchema = new mongoose.Schema({
    // --- Personal Details ---
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    visaHolderImage: {
        type: String, // URL to image (Cloudinary/S3)
        required: [true, 'Visa holder image is required']
    },
    imagePublicId: {
        type: String,
        required: [true, 'Image Public ID is required']
    },

    // --- Passport Details ---
    passportDetails: {
        passportNumber: {
            type: String,
            required: true,
            uppercase: true
        },
        countryOfIssuance: {
            type: String,
            required: true
        },
        expiryDate: {
            type: Date,
            required: true
        }
    },

    // --- Visa Grant Details ---
    visaDetails: {
        visaClass: {
            type: String,
            required: true, // e.g., "Visitor"
        },
        visaSubclass: {
            type: String,
            required: true, // e.g., "600"
        },
        visaStream: {
            type: String, // e.g., "Tourist stream"
        },
        visaGrantNumber: {
            type: String,
            required: true,
            unique: true
        },
        visaGrantDate: {
            type: Date,
            required: true
        },
        visaExpiryDate: {
            type: Date // Some visas (like PR) don't have a fixed expiry but a "Must not arrive after" date
        },
        visaStatus: {
            type: String,
            enum: ['In effect', 'Expired', 'Pending', 'Cancelled', 'Refused'],
            default: 'In effect'
        },
        entriesAllowed: {
            type: String,
            enum: ['Single', 'Multiple'],
            default: 'Multiple'
        },
        mustNotArriveAfter: {
            type: Date
        },
        periodOfStay: {
            type: String, // e.g., "3 months from date of arrival"
            required: true
        }
    },

    // --- Employment/Sponsorship (for Work Visas) ---
    employmentDetails: {
        occupation: String, // e.g., "Truck Driver"
        sponsorName: String, // e.g., "Green World Co Pty Ltd"
        sponsorAddress: String,
        sponsorABN: String, // e.g., "12 345 678 901"
    },

    // --- Conditions & Permissions ---
    conditions: [{
        code: String, // e.g., "8101"
        description: String // e.g., "No work"
    }],

    // --- Reference & Audit ---
    applicationId: {
        type: String,
        required: true,
        unique: true
    },
    transactionReferenceNumber: String,
    referenceType: {
        type: String,
        enum: ['TRN', 'Visa Grant Number', 'Visa Evidence Number'],
        default: 'Visa Grant Number'
    },
    referenceNumber: {
        type: String,
        required: true
    },

    // Linking to the user who owns this visa record
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true // Automatically manages createdAt and updatedAt
});

// Compound indexes for VEVO verification performance
visaSchema.index({ "visaDetails.visaGrantNumber": 1, "dateOfBirth": 1 });
visaSchema.index({ "passportDetails.passportNumber": 1, "dateOfBirth": 1 });

const Visa = mongoose.model('Visa', visaSchema);

module.exports = Visa;

