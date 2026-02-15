const express = require('express');
const router = express.Router();
const {register, login} = require('../controllers/authController');
const { protect } = require('../middleware/protect');


router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, (req, res)=>{
    res.json({
        message: "Welcome "+req.user.name+"! This is your profile data.",
        user: req.user
    })
})


module.exports = router;