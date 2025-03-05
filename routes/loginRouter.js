const express = require('express');
const router = express.Router();
const loginController = require("../controller/loginController");
const loginMiddleware = require("../middleware/loginMiddleware");

// 로그인 라우터
router.post("/login", loginController.loginUser);

// 로그인 검증 라우터
router.post("/verify", loginMiddleware, (req, res) => {
    res.json({ result: true, user: req.user });
});

// 회원가입 라우터
router.post("/signup", loginController.signupUser);

module.exports = router;