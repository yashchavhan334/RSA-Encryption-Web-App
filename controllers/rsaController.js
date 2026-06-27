const crypto = require("crypto");

// ================================
// Generate RSA Keys
// ================================

const generateKeys = (req, res) => {

    try {

        const keySize = parseInt(req.query.size) || 2048;

        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {

            modulusLength: keySize,

            publicKeyEncoding: {

                type: "spki",

                format: "pem"

            },

            privateKeyEncoding: {

                type: "pkcs8",

                format: "pem"

            }

        });

        res.json({

            success: true,

            publicKey,

            privateKey

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ================================
// Encrypt Message
// ================================

const encryptMessage = (req, res) => {

    try {

        const { message, publicKey } = req.body;

        if (!message || !publicKey) {

            return res.status(400).json({

                success: false,

                message: "Message and Public Key are required."

            });

        }

        const encrypted = crypto.publicEncrypt(

            publicKey,

            Buffer.from(message)

        );

        res.json({

            success: true,

            encryptedText: encrypted.toString("base64")

        });

    }

  catch (error) {

    console.log(error);

    res.status(500).json({

        success: false,

        message: "Invalid Public Key or Encryption Failed."

    });

}
};

// ================================
// Decrypt Message
// ================================

const decryptMessage = (req, res) => {

    try {

        const { encryptedText, privateKey } = req.body;

        if (!encryptedText || !privateKey) {

            return res.status(400).json({

                success: false,

                message: "Encrypted text and Private Key are required."

            });

        }

        const decrypted = crypto.privateDecrypt(

            privateKey,

            Buffer.from(encryptedText, "base64")

        );

        res.json({

            success: true,

            decryptedText: decrypted.toString()

        });

    }

   catch (error) {

    console.log(error);

    res.status(500).json({

        success: false,

        message: "Invalid Private Key or Decryption Failed."

    });

}
};

module.exports = {

    generateKeys,

    encryptMessage,

    decryptMessage

};