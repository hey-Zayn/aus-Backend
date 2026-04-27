const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dropIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const collection = mongoose.connection.collection('visas');
        
        const indexesToDrop = [
            'visaDetails.visaGrantNumber_1',
            'applicationId_1',
            'passportDetails.passportNumber_1'
        ];

        for (const index of indexesToDrop) {
            try {
                console.log(`Attempting to drop index: ${index}`);
                await collection.dropIndex(index);
                console.log(`Successfully dropped index: ${index}`);
            } catch (err) {
                console.log(`Skipping index ${index}: ${err.message}`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error connecting or dropping indexes:', error.message);
        process.exit(1);
    }
};

dropIndexes();
