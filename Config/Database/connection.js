const mongoose = require('mongoose')
const logger = require('../../lib/logger')
const colors = require('colors')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        logger.info(`MongoDB Connected: ${mongoose.connection.host}`.green.bold)
    } catch (error) {
        logger.error(`Error: ${error.message}`.red.bold)
        process.exit(1)
    }
}

module.exports = connectDB
