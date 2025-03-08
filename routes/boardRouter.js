const express = require("express");
const router = express.Router();
const boardController = require("../controller/boardController");
const loginMiddleware = require("../middleware/loginMiddleware");
const uploadMiddleware = require("../middleware/upload");

router.get("/category", boardController.getCategory);

router.post("/post", loginMiddleware, uploadMiddleware.array("image[]", 3), boardController.createBoard);

module.exports = router;