const bcrypt = require("bcryptjs");
const { generateToken } = require("../lib/genrateJWT");
const User = require("../Models/User.Model");
const { sendVerificationEmail, sendLoginVerificationEmail } = require("../lib/email");

// Helper to generate 6-digit code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = generateVerificationCode();

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
        });

        await newUser.save();

        await sendVerificationEmail(newUser.email, verificationToken);

        res.status(201).json({
            message: "User created. Please check your email for the verification code.",
            email: newUser.email,
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const verifyEmail = async (req, res) => {
    const { email, code } = req.body;
    try {
        const user = await User.findOne({
            email,
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
        });
    } catch (error) {
        console.log("Error in verifyEmail controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate a new verification token for login
        const verificationToken = generateVerificationCode();
        user.verificationToken = verificationToken;
        user.verificationTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 mins
        await user.save();

        await sendLoginVerificationEmail(user.email, verificationToken);

        res.status(200).json({
            message: "Verification code sent to your email",
            email: user.email,
            requiresVerification: true
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const verifyLogin = async (req, res) => {
    const { email, code } = req.body;
    try {
        const user = await User.findOne({
            email,
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification code" });
        }

        // Clear the token after use
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        // If not verified yet (e.g. login attempt after signup but before verification), mark as verified
        if (!user.isVerified) user.isVerified = true;
        await user.save();

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
        });
    } catch (error) {
        console.log("Error in verifyLogin controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password").sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.log("Error in getUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Prevent self-deletion
        if (id === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot delete yourself" });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log("Error in deleteUser controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    signup,
    verifyEmail,
    login,
    verifyLogin,
    getUsers,
    deleteUser,
    logout
}