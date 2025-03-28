require("dotenv").config(); // env 파일 사용

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const loginMiddleware = require("./middleware/loginMiddleware");

// 기본 시간대를 한국 시간으로 설정
const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

const app = express();
const port = 3000;

var corOptions = {
  origin: "http://localhost:3000",
};

app.use(cookieParser()); // 서명된 쿠키 사용
app.use(cors(corOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터
const loginRouter = require("./routes/loginRouter");
app.use("/", loginRouter);
const snsRouter = require("./routes/snsRouter");
app.use("/auth", snsRouter);
const boardRouter = require("./routes/boardRouter");
app.use("/board", boardRouter);
const mainRouter = require("./routes/mainRouter");
app.use("/main", mainRouter);
const likeRouter = require("./routes/likeRouter");
app.use("/like", likeRouter);

app.use("/public", express.static(__dirname + "/public"));
app.use("/imgs", express.static(__dirname + "/imgs"));
app.use("/uploads", express.static(__dirname + "/uploads"));

app.set("view engine", "ejs");
app.set("views", "./views");

require("./models/index");

// 메인 페이지 이동
app.get("/", (req, res) => {
  res.render("main");
});

// 회원가입 페이지 이동
app.get("/signup", (rea, res) => {
  res.render("signup");
});

// 수정페이지 이동
// app.get("/edit", (rea, res) => {
//   res.render("edit");
// });

// 작성(수정) 페이지 이동
app.get("/write", (req, res) => {
  res.render("write");
});

// 내 정보란 페이지 이동
// app.get("/mypage", loginMiddleware, (req, res) => {
//   res.render("mypage");
// });

// 찾기 페이지 이동
app.get("/find", (req, res) => {
  res.render("find");
});

// 상세페이지 이동
app.get("/detailpage", (req, res) => {
  res.render("detailpage");
});

// 검색페이지 이동
app.get("/search", (req, res) => {
  res.render("search");
});

// 서버 실행
app.listen(port, () => {
  console.log(`서버 실행 ${port}`);
});
