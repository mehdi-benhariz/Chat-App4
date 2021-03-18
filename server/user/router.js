const express = require("express");
const router = express.Router();
const {register,login,logout,userInfo} = require("./controllers")
const {auth} =require("../middleware/auth")

router.post('/login',login);
router.post('/register',register);
router.post('/logout',logout);
router.get('/userInfo',auth,userInfo)

module.exports = router