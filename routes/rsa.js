const express = require("express");

const router = express.Router();

const rsaController = require("../controllers/rsaController");

// =========================
// Generate RSA Keys
// =========================
router.get("/generate", rsaController.generateKeys);

// =========================
// Encrypt Message
// =========================
router.post("/encrypt", rsaController.encryptMessage);

// =========================
// Decrypt Message
// =========================
router.post("/decrypt", rsaController.decryptMessage);

module.exports = router;