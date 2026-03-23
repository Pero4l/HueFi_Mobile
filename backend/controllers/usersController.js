const { Users } = require("../models");
const bcrypt = require("bcrypt");

async function usersCreation(req, res) {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

      if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return res.status(400).json({ message: "Password must contain both uppercase and lowercase letters" });
    } else if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: "Password must contain a number" });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    } else if (username.length < 4) {
      return res.status(400).json({ message: "Username must be at least 4 characters" });
    }

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await Users.create({ username, email, password: hashedPassword });

        res.status(201).json({ success: true, message: "User created successfully" });

    } catch (error) {

        res.status(500).json({ success: false, message: "User creation failed", error: error.message });
    }
} 

async function usersLogin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }   

    const user = await Users.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
    }

    res.status(200).json({ success: true, message: "User logged in successfully" });
}

// async function forgotPassword(req, res) {
//     const { email } = req.body;

//     if (!email) {
//         return res.status(400).json({ error: "All fields are required" });
//     }

//     const user = await Users.findOne({ where: { email } });
//     if (!user) {
//         return res.status(404).json({ error: "User not found" });
//     }

//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

//     user.resetToken = resetToken;
//     user.resetTokenExpiry = resetTokenExpiry;

//     await user.save();

//     res.status(200).json({ success: true, message: "Password reset link sent successfully" });
// }

module.exports = { usersCreation, usersLogin };