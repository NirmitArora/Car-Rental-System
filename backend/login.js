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

function setupAdminUser() {
    const users = readUsersFromFile();
    const adminExists = users.some(user => user.email === 'nirmitarora@gmail.com');
    if (!adminExists) {
        const hashedPassword = bcrypt.hashSync('Nirmitarora@1', 10);
        users.push({
            email: 'nirmitarora@gmail.com',
            password: hashedPassword,
            role: 'admin',
        });
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        console.log('Admin user created.');
    }
}
setupAdminUser();



// Function to login a user
function loginUser(req, res) {
    const { email, password } = req.body;
    const users = readUsersFromFile();

    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ message: 'User not found.' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: 'Incorrect password.' });
    }
    const userRole = user.role || 'user'; // Default to 'user' if no role is specified
    return res.status(200).json({ message: 'User logged in successfully.', role: userRole,});
}

module.exports = { loginUser };
