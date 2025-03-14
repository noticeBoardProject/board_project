const express = require("express");
const router = express.Router();
const boardController = require("../controller/boardController");
const loginMiddleware = require("../middleware/loginMiddleware");
const upload = require("../middleware/upload");

// 카테고리 목록 가져오기
router.get("/category", boardController.getCategory);

// 게시물 db 연동
router.post("/post", loginMiddleware, upload.array("image[]"), boardController.createBoard);

// 게시글 삭제
router.delete("/delete/:boardId", loginMiddleware, boardController.deleteBoard);

// 게시물 수정
router.patch("/edit/:boardId", upload.array("image[]"), boardController.editBoard);

module.exports = router;