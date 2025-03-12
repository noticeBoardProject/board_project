const express = require("express");
const router = express.Router();
const mainController = require("../controller/mainController");
const optionMiddleware = require("../middleware/optionMiddleware");

// 메인 게시글 불러오기
router.get("/boardData", optionMiddleware, mainController.getMainBoard);

// 게시글 상세 조회
router.get("/move/detail/:id", optionMiddleware, mainController.getDetailBoard);

// 검색기능 (제목기준)
router.get("/search", mainController.searchTitle);

// 내 글 모음
router.get("/mywrite", mainController.getMyWrite);

// 내 좋아요 모음
router.get("/mylike", mainController.getMyLike);

module.exports = router;
