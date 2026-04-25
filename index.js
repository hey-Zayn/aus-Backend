const express = require("express");
const dotenv = require('dotenv')
const cors = require('cors');
const cookieParser = require("cookie-parser");
const morgan = require('morgan');
const logger = require("./lib/logger");
const colors = require('colors')

const connectDB = require("./Config/Database/connection");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware — increase limit to 10mb for base64 image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());

// Morgan HTTP request logging (piped through Winston)
app.use(morgan('dev', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

app.use('/api/v2/auth', require('./routes/User.Router'))
app.use('/api/v2/visa', require('./routes/Visa.Router'))
app.use('/api/v2/settings', require('./routes/Settings.Router'))


app.use('/', (req, res) => {
    res.send("hello World!".blue)
})



app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
