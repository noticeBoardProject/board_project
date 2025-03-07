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

// 이메일 중복체크 라우터
router.get("/DupleCheck/email", loginController.emailDupleCheck);

// 닉네임 중복체크 라우터
router.get("/DupleCheck/nickname", loginController.nickDupleCheck);

// 내 정보 조회
router.get("/mypage/info", loginMiddleware, loginController.getUserInfo);

// 회원 정보 수정
router.patch("/mypage/update", loginMiddleware, loginController.updateUserInfo);

module.exports = router;