const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const { createUser } = require("../routes/roles");

const MIN_PASSWORD_LENGTH = 8;
const SENSITIVE_KEYS = ['password', 'sessionId'];

//G1 and G2
function createSessionId() {
    return crypto.randomBytes(32).toString("hex");
}

// G3, G4, G5 and G6
function validateCredentials(username, password) {
    if (typeof username!== "string" || typeof password !== "string") {
        return false;
    }
    if (username.trim().length === 0) {
        return false;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
        return false;
    }
    return true;
}

//G7 and G8
function logAuthEvent(type, details = {}, logger = console.log) {
    const safe = {};
    for (const key of Object.keys(details)) {
        if (!SENSITIVE_KEYS.includes(key)) {
            safe[key] = details[key];
        }
    }
    const line = JSON.stringify({ type, time: new Date().toISOString(), ...safe });
    logger(line);
    return line;
}

// G9
function registerUser(input){
    try {
        if (!input || !validateCredentials(input.username, input.password)) {
            return { ok:false, error: "Invalid username or password" };
        }
        const user = createUser(input);
        user.passwordHash = bcrypt.hashSync(input.password, 10);
        return { ok: true, user };
    } catch (err) {
        return { ok: false, error: "Registration failed" };
    }
}

module.exports = { 
    createSessionId, 
    validateCredentials,
    logAuthEvent,
    registerUser,
};