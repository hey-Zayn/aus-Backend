/**
 * VEVO Test Data Seeder
 * Run: node seed_test_data.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Visa = require('./Models/Visa.Model');
const User = require('./Models/User.Model');

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find or create test user
        let testUser = await User.findOne({ email: 'seed_test@aus.com' });
        if (!testUser) {
            testUser = await User.create({
                name: 'Seed Tester',
                email: 'seed_test@aus.com',
                password: 'password123'
            });
            console.log('✅ Test user created:', testUser._id);
        } else {
            console.log('✅ Using existing test user:', testUser._id);
        }

        // Remove old seeded visas for this user cleanly
        const deleted = await Visa.deleteMany({ user: testUser._id });
        console.log(`🗑️  Cleared ${deleted.deletedCount} old test visa(s)`);

        // --- Test Visa 1: Visitor (Passport) ---
        const visa1 = await Visa.create({
            fullName: 'ZAYN MALIK',
            dateOfBirth: new Date('1993-01-12T00:00:00.000Z'),
            gender: 'Male',
            nationality: 'British',
            visaHolderImage: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            imagePublicId: 'aus_visas/seed_sample_1',
            passportDetails: {
                passportNumber: 'L87654321',
                countryOfIssuance: 'United Kingdom',
                expiryDate: new Date('2030-01-01')
            },
            visaDetails: {
                visaClass: 'Visitor',
                visaSubclass: '600',
                visaStream: 'Tourist',
                visaGrantNumber: '1234567890123',
                visaGrantDate: new Date('2024-01-01'),
                visaExpiryDate: new Date('2025-12-31'),
                visaStatus: 'In effect',
                entriesAllowed: 'Multiple',
                periodOfStay: '3 months from date of arrival'
            },
            conditions: [
                { code: '8101', description: 'No work' },
                { code: '8201', description: 'Maximum 3 months study' }
            ],
            applicationId: 'APP-SEED-001',
            referenceType: 'Visa Grant Number',
            referenceNumber: '1234567890123',
            user: testUser._id
        });
        console.log('✅ Visa 1 seeded (ZAYN MALIK):', visa1._id);

        // --- Test Visa 2: Student ---
        const visa2 = await Visa.create({
            fullName: 'SARAH CONNOR',
            dateOfBirth: new Date('1985-05-22T00:00:00.000Z'),
            gender: 'Female',
            nationality: 'American',
            visaHolderImage: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            imagePublicId: 'aus_visas/seed_sample_2',
            passportDetails: {
                passportNumber: 'A12345678',
                countryOfIssuance: 'United States',
                expiryDate: new Date('2028-05-22')
            },
            visaDetails: {
                visaClass: 'Student',
                visaSubclass: '500',
                visaGrantNumber: '9876543210987',
                visaGrantDate: new Date('2023-08-01'),
                visaExpiryDate: new Date('2027-12-31'),
                visaStatus: 'In effect',
                entriesAllowed: 'Multiple',
                periodOfStay: 'Length of course plus 2 months'
            },
            conditions: [
                { code: '8104', description: 'Work limitation (max 48 hours per fortnight during course)' },
                { code: '8202', description: 'Must maintain satisfactory course attendance and progress' },
                { code: '8501', description: 'Must maintain adequate health insurance (OSHC)' }
            ],
            applicationId: 'APP-SEED-002',
            referenceType: 'Visa Grant Number',
            referenceNumber: '9876543210987',
            user: testUser._id
        });
        console.log('✅ Visa 2 seeded (SARAH CONNOR):', visa2._id);

        console.log('\n🎉 Seeding complete! Use these details to test the VEVO form:');
        console.log('─────────────────────────────────────────────────────────');
        console.log('TEST 1 (Visitor Visa / Passport):');
        console.log('  Reference Number : 1234567890123');
        console.log('  Date of Birth    : 1993-01-12');
        console.log('  Passport Number  : L87654321');
        console.log('  Country          : United Kingdom');
        console.log('');
        console.log('TEST 2 (Student Visa / Passport):');
        console.log('  Reference Number : 9876543210987');
        console.log('  Date of Birth    : 1985-05-22');
        console.log('  Passport Number  : A12345678');
        console.log('  Country          : United States');
        console.log('─────────────────────────────────────────────────────────');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`  Field "${key}":`, error.errors[key].message);
            });
        }
        process.exit(1);
    }
}

seedData();
