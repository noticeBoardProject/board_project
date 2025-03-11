const express = require("express");
const router = express.Router();
const mainController = require("../controller/mainController");
const optionMiddleware = require("../middleware/optionMiddleware");

// 메인 게시글 불러오기
router.get("/boardData", optionMiddleware, mainController.getMainBoard);

// 게시글 상세 조회
router.get("/move/detail/:id", mainController.getDetailBoard);

// 만약 console.log("해당 상세페이지 확인: ", boardData); 결과중 userCheck가 false만 나오면 이걸로 사용하기!!
// router.get("/move/detail/:id", optionMiddleware, mainController.getDetailBoard);

// 검색기능 (제목기준)
router.get("/search", mainController.searchTitle);

module.exports = router;
