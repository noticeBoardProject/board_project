const express = require("express");
const router = express.Router();
const mainController = require("../controller/mainController");

// 메인 게시글 불러오기
router.get("/boardData", mainController.getMainBoard);

// 검색기능 (제목기준)
router.get("/searchTitle", mainController.searchTitle);

module.exports = router;