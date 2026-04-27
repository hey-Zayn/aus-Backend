const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // MS
        httpOnly: true,
        sameSite: "none", // Required for cross-site cookies
        secure: true,     // Must be true if sameSite is none
    });

    return token;
};

module.exports = {
    generateToken
}