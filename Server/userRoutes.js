const express = require("express");
const { loginController, registerController } = require("../controllers/userController.js");

const router = express.Router();

// ✅ Login Route
router.post("/login", loginController);

// ✅ Register Route
router.post("/register", registerController);

// ✅ Add a GET route to test
router.get("/", (req, res) => {
  res.status(200).json({ message: "User API is working!" });
});

module.exports = router;
