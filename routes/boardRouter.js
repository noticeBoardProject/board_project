const express = require("express");
const router = express.Router();
const boardController = require("../controller/boardController");

router.get("/category", boardController.getCategory);

module.exports = router;