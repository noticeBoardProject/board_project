const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const loginMiddleware = require("./middleware/loginMiddleware");

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
const loginRouter = require("./routes/loginRoute");
app.use('/', loginRouter);

app.use("/public", express.static(__dirname + "/public"));
app.use("/imgs", express.static(__dirname + "/imgs"));
app.use("/uploads", express.static(__dirname + "/uploads"));

app.set("view engine", "ejs");
app.set("views", "./views");

require("./models/index");

// 메인페이지 이동
app.get("/", (req, res) => {
  res.render("main");
});

// 서버 실행
app.listen(port, () => {
  console.log(`서버 실행 ${port}`);
});
