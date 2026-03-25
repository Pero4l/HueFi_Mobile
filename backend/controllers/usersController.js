const { Users, leaderboard } = require("../models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateWallet } = require("../utils/wallet");
const { encrypt, decrypt } = require("./protect");

async function usersCreation(req, res) {

    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !email || !password) {
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
    } else if (fullname.length < 5) {
      return res.status(400).json({ message: "Fullname must be at least 5 characters" });
    } else if (username.length < 4) {
      return res.status(400).json({ message: "Username must be at least 4 characters" });
    }

    const existingUser = await Users.findOne({ where: { email }});

    const existingUsername = await Users.findOne({ where: { username } });
    
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    } else if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const wallet = generateWallet();
    
    // Encrypt the sensitive wallet keys instead of one-way bcrypt hashing
    const encryptedWalletPrivateKey = encrypt(wallet.secretKey);
    const encryptedWalletMnemonic = encrypt(wallet.mnemonic);

    try {

        const newUser = await Users.create({ 
            fullname, 
            username, 
            email, 
            password: hashedPassword,
            wallet_address: wallet.publicKey,
            wallet_private_key: encryptedWalletPrivateKey,
            wallet_mnemonic: encryptedWalletMnemonic
        });

        await leaderboard.create({
            user_id: newUser.id,
            fullname: newUser.fullname,
            username: newUser.username,
            address: wallet.publicKey,
            points: 0,
            rank: 0
        });

        res.status(201).json({ success: true, message: "User created successfully", data: newUser });

    } catch (error) {

        res.status(500).json({ success: false, message: "User creation failed", error: error.message });
    }
} 




async function usersLogin(req, res) {
    const { userLog, password } = req.body;

    if (!userLog || !password) {
        return res.status(400).json({ error: "Email or username and password are required" });
    }   

    const user = await Users.findOne({ where: { [Op.or]: [{ email: userLog }, { username: userLog }] } });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email/username or password" });
    }

  

     const token = jwt.sign(
    {
      user_id: user.id,
      currentUser: `FullName:${user.fullname}, UserName:${user.username}`,
      address: user.wallet_address,
      secretKey: decrypt(user.wallet_private_key),
      mnemonic: decrypt(user.wallet_mnemonic),
      email: `${user.email}`
    },
    process.env.JWT_SECRET,
    { expiresIn: "72h" }
  );

  const address = user.wallet_address;


    res.status(200).json({ 
      success: true, 
      message: "User logged in successfully",
      token: token,
      address: address
    });
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