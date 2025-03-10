const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../models");
const loginModel = db.users; // user 모델 사용
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET; // JWT 시크릿 키

// 네이버 로그인 API
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const state = Math.random().toString().substring(2, 5); // 위조 방지 랜덤 문자 5글자
const redirectURI = encodeURI("http://localhost:3000/auth/naver/callback");
let naverAPI_URL = "";

// 네이버 로그인 페이지로 이동 (url 생성)
router.get("/naver", (req, res) => {
  naverAPI_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirectURI}&state=${state}`;
  res.redirect(naverAPI_URL);
});

// 네이버 로그인 콜백 처리
router.get("/naver/callback", async (req, res) => {
  const { code, state } = req.query;
  naverAPI_URL = "https://nid.naver.com/oauth2.0/token";

  try {
    // 접근 토큰 요청
    const tokenAxios = await axios({
      method: "GET",
      url: naverAPI_URL,
      params: {
        grant_type: "authorization_code",
        client_id: client_id,
        client_secret: client_secret,
        code: code,
        state: state,
      },
      headers: {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret,
      },
    });
    const accessToken = tokenAxios.data.access_token;

    // 사용자 프로필 정보 요청
    const profileRes = await axios({
      method: "GET",
      url: "https://openapi.naver.com/v1/nid/me",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // console.log("사용자 프로필 정보:", profileRes.data);

    const { email, name, nickname, mobile } = profileRes.data.response;

    // DB에서 기존 회원 여부 확인
    let user = await loginModel.findOne({ where: { email } });
    if (!user) {
      // 없으면 신규 회원 가입
      user = await loginModel.create({
        email,
        username: name,
        nickname: nickname,
        phone: mobile,
        provider: "naver",
      });
    }

    // JWT 토큰 발급
    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "7d" });

    // 쿠키에 토큰 저장
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/?loginSuccess=true");
  } catch (error) {
    console.error("네이버 로그인 실패:", error);
  }
});

const KAKAO_ID = process.env.KAKAO_ID;
const kakaoredirectURI = encodeURI("http://localhost:3000/auth/kakao/callback");
const kakao_secret = process.env.KAKAO_SECRET;
let kakaoAPI_URL = "";

// 카카오 로그인 페이지로 이동 (url 생성)
router.get("/kakao", (req, res) => {
  kakaoAPI_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_ID}&redirect_uri=${kakaoredirectURI}`;
  res.redirect(kakaoAPI_URL);
});

// 카카오 로그인 콜백 처리
router.get("/kakao/callback", async (req, res) => {
  const { code } = req.query;
  kakaoAPI_URL = "https://kauth.kakao.com/oauth/token";
  try {
    // 접근 토큰 요청
    const tokenAxios = await axios({
      method: "get",
      url: kakaoAPI_URL,
      params: {
        grant_type: "authorization_code",
        client_id: KAKAO_ID,
        redirect_uri: kakaoredirectURI,
        code: code,
        client_secret: kakao_secret,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    const accessToken = tokenAxios.data.access_token;

    // 사용자 프로필 정보 요청
    const profileRes = await axios({
      method: "get",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { email, name, phone_number } = profileRes.data.kakao_account;
    const { nickname } = profileRes.data.kakao_account.profile;
    const phone = phone_number.replace("+82 ", 0);

    // DB에서 기존 회원 여부 확인
    let user = await loginModel.findOne({ where: { email } });
    if (!user) {
      // 없으면 신규 회원 가입
      user = await loginModel.create({
        email,
        username: name,
        nickname: nickname,
        phone,
        provider: "kakao",
      });
    }

    // JWT 토큰 발급
    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "7d" });

    // 쿠키에 토큰 저장
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/?loginSuccess=true");
  } catch (error) {
    console.error("카카오 로그인 실패:", error);
  }
});

module.exports = router;
