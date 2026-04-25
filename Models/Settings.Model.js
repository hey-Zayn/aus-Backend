const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    sponsorName: { type: String, default: 'Green World Co Pty Ltd' },
    sponsorABN: { type: String, default: '12 345 678 901' },
    sponsorAddress: { type: String, default: '35 McArthurs Rd, Altona North VIC 3025' },
    hiringCoordinator: { type: String, default: 'Paul Moskowitz' },
    residentHost: { type: String, default: 'Erwin Pouros' },
    hostAddress: { type: String, default: '1–9 Hinkler Drive, Gold Coast City, QLD 4214' },
    hostPhone: { type: String, default: '+61 7 5596 1233' },
    signatureImage: String, // Base64 or URL
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
