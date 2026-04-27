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
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://aus-coral.vercel.app'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        // Normalize origin by removing trailing slash for comparison
        const normalizedOrigin = origin.replace(/\/$/, '');
        if (allowedOrigins.includes(normalizedOrigin)) {
            return callback(null, true);
        }
        const msg = `The CORS policy for this site does not allow access from origin: ${origin}`;
        return callback(new Error(msg), false);
    },
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
