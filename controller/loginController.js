const jwt = require("jsonwebtoken"); // 토큰 라이브러리
const bcrypt = require("bcrypt"); // 암호화 라이브러리

const db = require("../models"); // user 가져오기
const { where } = require("sequelize");
const loginModel = db.users; // user 모델 사용

require("dotenv").config();
const secretKey = process.env.JWT_SECRET; // JWT 시크릿 키
const salt = 10; // 해시 slat 값

// 로그인처리 (by email)
const loginUser = async (req, res) => {
  // console.log('요청받은 데이터:', req.body);
  const { email, password, stayLogin } = req.body;

  try {
    const user = await loginModel.findOne({ where: { email: email } });
    // console.log("조회된 유저 정보:", user);

    // 사용자 검증
    if (!user) {
      return res.json({
        result: false,
        message: "존재하지 않는 사용자입니다.",
      });
    }

    // 비밀번호 검증
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({
        result: false,
        message: "비밀번호가 올바르지 않습니다.",
      });
    }

    // 토큰 발급
    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "7d" });
    const cookieOptions = stayLogin
      ? { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 } // 7일 유지
      : { httpOnly: true }; // 세션 쿠키 (브라우저 종료 시 삭제)
    // 쿠키에 JWT 저장
    res.cookie("token", token, { cookieOptions });
    res.json({ result: true, message: "로그인 성공", token });
  } catch (error) {
    console.error("로그인 오류:", error);
    res.json({ result: false, message: "로그인 정보가 올바르지 않습니다." });
  }
};

// 유저 검증
const verifyUser = async (req, res, next) => {
  // 클라이언트 쿠키에서 JWT 가져오기
  const token = req.cookies.token;
  // console.log("쿠키에서 가져옴:", token);

  try {
    if (!token) {
      return res.json({ result: false, message: "토큰없음" });
    }

    const decoded = jwt.verify(token, secretKey);
    const user = await loginModel.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.json({ result: false, message: "사용자를 찾을 수 없음" });
    }

    req.user = user;
    next(); // 추가한 미들웨어 실행
  } catch (error) {
    console.error("토큰 검증 오류:", error);
    return res.json({ result: false, message: "유효하지 않은 토큰" });
  }
};

// 회원가입
const signupUser = async (req, res) => {
  // console.log("암호화할 데이터:", req.body);
  const { email, password, username, nickname, address, gender, birth, phone } =
    req.body;

  try {
    // 아이디 중복방지
    const duplicateEMAIL = await loginModel.findOne({ where: { email } });
    if (duplicateEMAIL) {
      return res.json({
        result: false,
        message: "이미 존재하는 아이디입니다.",
      });
    }

    // 비밀번호 해시 암호화
    const hashPw = await bcrypt.hash(password, salt);
    // console.log("해시처리된 pw : ", hashPw);

    // db에 저장
    const newUser = await loginModel.create({
      email,
      password: hashPw,
      username,
      nickname,
      address,
      gender,
      birthdate: birth,
      phone,
    });

    // console.log("새로운사용자: ", newUser);
    res.json({ result: true, message: "회원가입 성공" });
  } catch (error) {
    console.error("회원가입 오류:", error);
  }
};

// 아이디 중복검사
const emailDupleCheck = async (req, res) => {
  const { email } = req.query;
  // console.log("이메일 중복 요청 컨트롤러 확인:", email);
  try {
    checkUser = await loginModel.findOne({ where: { email } });

    if (checkUser) {
      return res.json({
        result: false,
        message: "이미 존재하는 이메일입니다.",
      });
    } else {
      return res.json({ result: true, message: "사용 가능한 이메일입니다." });
    }
  } catch (error) {
    console.error("이메일 중복 체크 오류:", error);
  }
};

// 닉네임 중복검사
const nickDupleCheck = async (req, res) => {
  const { nickname } = req.query;
  // console.log("닉네임 중복 요청 컨트롤러 확인:", nickname);
  try {
    checkUser = await loginModel.findOne({ where: { nickname } });

    if (checkUser) {
      return res.json({
        result: false,
        message: "이미 존재하는 닉네임입니다.",
      });
    } else {
      return res.json({ result: true, message: "사용 가능한 닉네임입니다." });
    }
  } catch (error) {
    console.error("닉네임 중복 체크 오류:", error);
  }
};

// 내 정보 가져오기
const getUserInfo = async (req, res) => {
  try {
    const user = await loginModel.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res.json({
        result: false,
        message: "사용자 정보를 찾을 수 없습니다.",
      });
    }

    res.json({ result: true, user });
  } catch (error) {
    console.error("사용자 정보 조회 오류:", error);
  }
};

// 내정보란 페이지 정보 수정
const updateUserInfo = async (req, res) => {
  try {
    const { password, username, nickname, address, phone } = req.body;

    const updateUser = { username, nickname, address, phone };

    // 비밀번호 해시 후 저장
    if (password) {
      updateUser.password = await bcrypt.hash(password, salt);
    }

    // DB 업데이트 실행
    await loginModel.update(updateUser, { where: { id: req.user.id } });

    res.json({
      result: true,
      message: "회원 정보가 성공적으로 수정되었습니다.",
    });
  } catch (error) {
    console.error("회원 정보 수정 오류:", error);
  }
};

module.exports = {
  loginUser,
  verifyUser,
  signupUser,
  emailDupleCheck,
  nickDupleCheck,
  getUserInfo,
  updateUserInfo,
};
