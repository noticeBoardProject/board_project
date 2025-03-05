const jwt = require("jsonwebtoken"); // 토큰 라이브러리
const bcrypt = require("bcrypt"); // 암호화 라이브러리

const loginModel = require("../models/users"); // user db 모델

const salt = 10; // 해시 slat 값

// 로그인처리 (by email)
const loginUser = async (req, res) =>{
  console.log('요청받은 데이터:', req.body);
  const { email, password } = req.body;

  try {
    const user = await loginModel.findOne({where: {email: email}});
    console.log("조회된 유저 정보:", user);

    // 사용자 검증
    if(!user){
      return res.json({ result: false, message: "존재하지 않는 사용자입니다." });
    }

    // 비밀번호 검증
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.json({ result: false, message: "비밀번호가 올바르지 않습니다." });
    }

    // 토큰 발급
    const token = jwt.sign({ id: user.id }, secretKey);
    // 쿠키에 JWT 저장
    res.cookie("토큰", token, { httpOnly: true });
    res.json({ result: true, message: "로그인 성공", token });

  } catch (error) {
    console.error("로그인 오류:", error);
    res.json({ result: false, message: "로그인 정보가 올바르지 않습니다." });
  }
}

// 유저 검증
const verifyUser = async (req, res, next) => {
  // 클라이언트 쿠키에서 JWT 가져오기
  const token = req.cookies.token;
  console.log("쿠키에서 가져옴:", token);

  try {
    if (!token) {
        return res.json({ result: false, message: "토큰없음" });
    }

    const decoded = jwt.verify(token, secretKey);
    const user = await loginModel.findOne({where: {id: decoded.id}});

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
const signupUser = async (req, res) =>{
  console.log("암호화할 데이터:", req.body);
  const {email, password} = req.body;

  try{
      // 아이디 중복방지
      const duplicateEMAIL = await loginModel.findOne({where: {email}});
      if (duplicateEMAIL) {
          return res.json({result: false, message: "이미 존재하는 아이디입니다."});
      }

      // 비밀번호 해시 암호화
      const hashPw = await bcrypt.hash(password, salt);
      console.log("입력한 pw : ", password);
      console.log("해시처리된 pw : ", hashPw);

      // db에 저장
      await loginModel.create({email, password:hashPw});
      res.json({result: true, message: "회원가입 성공"});
  } catch (error){
      console.error("회원가입 오류:", error);
  }
}


const index = (req, res) => {
  res.render("main");
};
const signup = (req, res) => {
  res.render("signup");
};

module.exports = { index, signup, loginUser, verifyUser, signupUser }; // 테스트용 필요