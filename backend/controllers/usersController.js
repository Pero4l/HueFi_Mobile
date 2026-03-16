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

module.exports = { usersCreation };