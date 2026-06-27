// ============================
// ELEMENTS
// ============================
const toast = document.getElementById("toast");

function showToast(message, color = "#22C55E") {

    toast.innerHTML = message;

    toast.style.background = color;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}
const generateBtn = document.getElementById("generateBtn");
const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");

const publicKey = document.getElementById("publicKey");
const privateKey = document.getElementById("privateKey");

const plainText = document.getElementById("plainText");
const charCounter = document.getElementById("charCounter");

const encryptKey = document.getElementById("encryptKey");

const encryptedText = document.getElementById("encryptedText");

const decryptInput = document.getElementById("decryptInput");
const decryptKey = document.getElementById("decryptKey");

const decryptedText = document.getElementById("decryptedText");

const copyPublic = document.getElementById("copyPublic");
const copyPrivate = document.getElementById("copyPrivate");
const copyEncrypted = document.getElementById("copyEncrypted");

const downloadPublic = document.getElementById("downloadPublic");
const downloadPrivate = document.getElementById("downloadPrivate");

const keySize = document.getElementById("keySize");
const clearBtn = document.getElementById("clearBtn");

// ============================
// GENERATE KEYS
// ============================

generateBtn.addEventListener("click", async () => {

    try {

        generateBtn.disabled = true;

        generateBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

        const response = await fetch(`/rsa/generate?size=${keySize.value}`);

        const data = await response.json();

        if (data.success) {

            publicKey.value = data.publicKey;
            privateKey.value = data.privateKey;

            showToast("✔ RSA Keys Generated");

        }

        else {

            showToast(data.message, "#EF4444");

        }

    }

    catch (err) {

        console.error(err);

        showToast("Unable to generate keys.", "#EF4444");

    }

    generateBtn.disabled = false;

    generateBtn.innerHTML =
        '<i class="fa-solid fa-bolt"></i> Generate Keys';

});

// ============================
// ENCRYPT
// ============================

encryptBtn.addEventListener("click", async () => {

    if (!plainText.value.trim()) {

        showToast("Enter a message", "#EF4444");

        return;

    }

    if (!encryptKey.value.trim()) {

        showToast("Please enter Public Key", "#EF4444");

        return;

    }
    if (!plainText.value.trim()) {

        showToast("Enter a message", "#EF4444");

        return;

    }

    if (!encryptKey.value.trim()) {

        showToast("Please enter Public Key", "#EF4444");

        return;

    }

    // Maximum message length based on selected key size

    let maxLength = 214;

    if (keySize.value == "1024") {

        maxLength = 86;

    }

    else if (keySize.value == "2048") {

        maxLength = 214;

    }

    else if (keySize.value == "3072") {

        maxLength = 342;

    }

    else if (keySize.value == "4096") {

        maxLength = 470;

    }

    if (plainText.value.length > maxLength) {

        showToast(
            `Message is too long. Maximum ${maxLength} characters allowed for ${keySize.value}-bit RSA.`,
            "#EF4444"
        );

        return;

    }
    encryptBtn.disabled = true;

    encryptBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Encrypting...';

    try {


        const response = await fetch("/rsa/encrypt", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                message: plainText.value,

                publicKey: encryptKey.value

            })

        });

        const data = await response.json();

        if (data.success) {

            encryptedText.value = data.encryptedText;
            showToast("✔ Message Encrypted");

        }

        else {

            showToast(data.message, "#EF4444");

        }

    }

    catch (err) {

        console.error(err);

        showToast("Encryption Failed.", "#EF4444");

    }
    encryptBtn.disabled = false;

    encryptBtn.innerHTML =
        '<i class="fa-solid fa-lock"></i> Encrypt';
});


// ============================
// DECRYPT
// ============================

decryptBtn.addEventListener("click", async () => {

    if (!decryptInput.value.trim()) {

        showToast("Enter encrypted text", "#EF4444");

        return;

    }

    if (!decryptKey.value.trim()) {

        showToast("Please enter Private Key", "#EF4444");

        return;

    }
    decryptBtn.disabled = true;

    decryptBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Decrypting...';

    try {

        const response = await fetch("/rsa/decrypt", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                encryptedText: decryptInput.value,

                privateKey: decryptKey.value

            })

        });

        const data = await response.json();

        if (data.success) {

            decryptedText.value = data.decryptedText;
            showToast("✔ Message Decrypted");

        }

        else {

            showToast(data.message, "#EF4444");

        }

    }

    catch (err) {

        console.error(err);

        showToast("Decryption Failed.", "#EF4444");

    }
    decryptBtn.disabled = false;

    decryptBtn.innerHTML =
        '<i class="fa-solid fa-unlock"></i> Decrypt';

});

// ============================
// COPY BUTTONS
// ============================

copyPublic.onclick = () => {

    navigator.clipboard.writeText(publicKey.value);

    showToast("✔ Public Key Copied");

};

copyPrivate.onclick = () => {

    navigator.clipboard.writeText(privateKey.value);

    showToast("✔ Private Key Copied");

};



copyEncrypted.onclick = () => {

    navigator.clipboard.writeText(encryptedText.value);

    showToast("✔ Encrypted Text Copied");
};
// ============================
// THEME
// ============================

const themeBtn = document.getElementById("themeBtn");

// Load saved theme
if(localStorage.getItem("theme") === "light"){

    document.body.classList.add("light");

    themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        localStorage.setItem("theme","light");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    }

    else{

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    }

});
// ============================
// CLEAR ALL
// ============================

clearBtn.addEventListener("click", () => {

    if (!confirm("Clear all fields?")) return;

    publicKey.value = "";
    privateKey.value = "";

    plainText.value = "";
    encryptKey.value = "";
    encryptedText.value = "";

    decryptInput.value = "";
    decryptKey.value = "";
    decryptedText.value = "";
    showToast("✔ Cleared Successfully");
    plainText.focus();
    updateCharacterCounter();
});
// ============================
// CHARACTER COUNTER
// ============================

function updateCharacterCounter() {

    let maxLength = 214;

    if (keySize.value == "1024") {

        maxLength = 86;

    }

    else if (keySize.value == "2048") {

        maxLength = 214;

    }

    else if (keySize.value == "3072") {

        maxLength = 342;

    }

    else if (keySize.value == "4096") {

        maxLength = 470;

    }

    charCounter.innerHTML =
        `Characters: ${plainText.value.length} / ${maxLength}`;

}

// Update while typing
plainText.addEventListener("input", updateCharacterCounter);

// Update when key size changes
keySize.addEventListener("change", updateCharacterCounter);

// Initial display
updateCharacterCounter();