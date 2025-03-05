const express = require("express");
const router = express.Router();

// const loginController = require("../controllers/logincontroller");

// // 로그인 페이지
// router.get("/login", loginController.renderLogin);

// // 로그인 처리
// router.post("/login", loginController.handleLogin);

// // 로그아웃
// router.post("/logout", loginController.handleLogout);

const {
  index,
  login,
  loginProcess,
  verifyProcess,
  joins,
  joinProcess,
  signup,
} = require("../controller/controller");

// get-메인페이지
router.get("/", index);

// get-로그인페이지
router.get("/login", login);

// get-회원가입페이지
router.get("/join", joins);
router.get("/signup", signup);

// post-로그인처리
router.post("/login", loginProcess);

// post-회원가입처리
router.post("/join", joinProcess);

// post-/verify-유저 정보 처리
router.post("/verify", verifyProcess);

module.exports = router;
