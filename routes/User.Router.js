const router = require('express').Router();
const { signup, verifyEmail, login, verifyLogin, getUsers, deleteUser, logout } = require('../controller/User.Controller');

const protectRoute = require('../Middleware/authMiddleware');

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/verify-login', verifyLogin);
router.post('/logout', logout);

router.get('/me', protectRoute, (req, res) => {
    res.json(req.user);
});

router.get('/', protectRoute, getUsers);
router.delete('/:id', protectRoute, deleteUser);


module.exports = router;