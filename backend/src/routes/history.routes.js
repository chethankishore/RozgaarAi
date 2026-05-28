const express = require("express");
const router = express.Router();
const {
  getHistory,
  getHistoryById,
  deleteHistory,
} = require("../controllers/history.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/", protect, getHistory);
router.get("/:id", protect, getHistoryById);
router.delete("/:id", protect, deleteHistory);

module.exports = router;