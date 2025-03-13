const express = require("express");
const router = express.Router();
const mainController = require("../controller/mainController");
const optionMiddleware = require("../middleware/optionMiddleware");
const loginMiddleware = require("../middleware/loginMiddleware");

// 메인 게시글 불러오기
router.get("/boardData", optionMiddleware, mainController.getMainBoard);

// 게시글 상세 조회
router.get("/move/detail/:id", optionMiddleware, mainController.getDetailBoard);

// 검색기능 (제목기준)
router.get("/search", mainController.searchTitle);

// 내 글 모음
router.get("/mywrite", loginMiddleware, mainController.getMyWrite);

// 내 좋아요 모음
router.get("/mylike", loginMiddleware, mainController.getMyLike);

// 게시글 수정 이동
router.get("/edit/:boardId", mainController.getEdit);

module.exports = router;
