// 토큰 라이브러리
const jwt = require("jsonwebtoken");

// 비밀번호 암호화
const crypto = require("crypto");
const salt = "Pr9925pe6SVrT/zyUFF2cA==";
const iterations = 100000;
const keylen = 64;
const digest = "sha512";
const Join = require("../models/index");
const createPbkdf = (password) => {
  return crypto
    .pbkdf2Sync(password, salt, iterations, keylen, digest)
    .toString("base64");
};

// 메인페이지
const index = (req, res) => {
  res.render("main");
};

// 메인페이지
const login = (req, res) => {
  res.render("login");
};

const joins = (req, res) => {
  res.render("join");
};
const signup = (req, res) => {
  res.render("signup");
};

// 로그인 처리
const loginProcess = async (req, res) => {
  // 프론트가 보낸 데이터를 담아서 백엔드가 확인
  const { id, pw } = req.body;
  // 비밀번호 암호화
  const keypass = createPbkdf(pw);

  console.log(keypass);
  // 데이터베이스 유저 조회
  const user = await Join.findOne({ where: { userid: id, pw: keypass } });

  // 반환하는게 참,거짓
  // const match=await bcrypt.compare(pw, user.dataValues.pw);  //bcrypt암호화
  console.log(user.dataValues.id);
  if (!user.dataValues.id) {
    //bcrypt암호화로 바꾸려면 이 안에 match넣으면 됨
    // 로그인 실패
    return res.status(401).json({ result: false, message: "로그인 실패" });
  }
  // 토큰 발급
  const token = jwt.sign({ id: user.dataValues.id }, process.env.SECRET);

  // 백엔드에서 쿠키 설정(js로 하면 프론트엔드에서 한거임)
  res.cookie("token", token);
  res.json({ result: true });
};

// 회원가입 처리
const joinProcess = async (req, res) => {
  // 프론트가 보낸 데이터를 담아서 백엔드가 확인
  const { id, pw, name } = req.body;
  // const salt=await bcrypt.genSalt(10);//bcrypt암호화
  // 비밀번호 암호화
  // const hashedpw=await bcrypt.hash(pw, salt)//bcrypt암호화

  try {
    // 비밀번호 암호화
    const keypass = createPbkdf(pw);

    await Join.create({ userid: id, pw: keypass, name: name });

    res.json({ result: true });
  } catch (error) {
    console.log(error);
    res.json({ message: "회원가입 실패!" });
  }
};

// 유저정보처리
const verifyProcess = async (req, res) => {
  // 토큰 확인
  if (req.headers.authorization) {
    // 헤더확인
    const headers = req.headers.authorization;
    // 토큰 확인
    const [bearer, token] = headers.split(" ");
    // 토근 검증
    try {
      const { id } = jwt.verify(token, process.env.SECRET);
      // 데이터베이스 유저 조회
      const user = await Join.findOne({ where: { id } });
      if (!user.dataValues.id) {
        // 로그인 실패
        return res.status(403).json({ result: false, message: "검증실패" });
      }
      // 성공
      res.json({ result: true, name: user.name });
    } catch (e) {
      return res
        .status(403)
        .json({ result: false, message: "토큰이 만료되었습니다." });
    }
  } else {
    return res.status(403).json({ result: false, message: "토큰이 없습니다." });
  }
};

module.exports = {
  index,
  login,
  loginProcess,
  verifyProcess,
  joins,
  joinProcess,
  signup,
};
