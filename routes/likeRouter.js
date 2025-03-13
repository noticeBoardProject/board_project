const express = require("express");
const router = express.Router();
const likeController = require("../controller/likeController");
const loginMiddleware = require("../middleware/loginMiddleware");
const optionMiddleware = require("../middleware/optionMiddleware");

// 좋아요 상태확인
router.get("/status/:boardId", optionMiddleware, likeController.getLikeStatus);

// 좋아요 추가
router.post("/post", loginMiddleware, likeController.addLike);

// 좋아요 삭제
router.delete("/delete/:boardId", loginMiddleware, likeController.deleteLike);

module.exports = router;
