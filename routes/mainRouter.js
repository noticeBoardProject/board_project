const express = require("express");
const router = express.Router();
const mainController = require("../controller/mainController");
const optionMiddleware = require("../middleware/optionMiddleware");

// 메인 게시글 불러오기
router.get("/boardData", optionMiddleware, mainController.getMainBoard);

// 검색기능 (제목기준)
router.get("/search", mainController.searchTitle);

module.exports = router;
