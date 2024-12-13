// src/register.js
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// File to store user data
const USERS_FILE = path.join(__dirname, 'users.json');

// Function to read users from the file
function readUsersFromFile() {
    if (!fs.existsSync(USERS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
}

// Function to write users to the file
function writeUsersToFile(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Function to validate username
const validateUsername = (username) => {
    const isValid = /^[A-Za-z]+$/.test(username); // Only letters allowed
    return isValid ? null : 'Username must contain only letters without numbers.';
};

// Function to validate password
const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigits = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+]/.test(password);

    if (password.length < minLength) return 'Password must be at least 8 characters long.';
    if (!hasUpperCase) return 'Password must include at least one uppercase letter.';
    if (!hasLowerCase) return 'Password must include at least one lowercase letter.';
    if (!hasDigits) return 'Password must include at least one digit.';
    if (!hasSpecialChars) return 'Password must include at least one special character.';
    
    return null; // Valid password
};

// Function to register a new user
function registerUser(req, res) {
    const { username, email, password } = req.body;
    const users = readUsersFromFile();

    // Check if user already exists
    if (users.some(user => user.email === email)) {
        return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Validate username
    const usernameError = validateUsername(username);
    if (usernameError) {
        return res.status(400).json({ message: usernameError });
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
        return res.status(400).json({ message: passwordError });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: users.length + 1, // Serial ID based on the length of the array
        username,
        email,
        password: hashedPassword
    };
    users.push(newUser);
    writeUsersToFile(users);

    return res.status(201).json({ message: 'User registered successfully.', userId: newUser.id });
}

module.exports = { registerUser };
