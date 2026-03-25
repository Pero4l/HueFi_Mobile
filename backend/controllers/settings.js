const { Users } = require("../models");

async function getMnemonic(req, res) {
    try {
        const { address } = req.user;
        const user = await Users.findOne({ where: { wallet_address: address } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const mnemonic = decrypt(user.wallet_mnemonic);
        return res.status(200).json({ success: true, mnemonic });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to get mnemonic", error: error.message });
    }
}

async function getPrivateKey(req, res) {
    try {
        const { address } = req.user;
        const user = await Users.findOne({ where: { wallet_address: address } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const privateKey = decrypt(user.wallet_private_key);
        return res.status(200).json({ success: true, privateKey });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to get private key", error: error.message });
    }
}

module.exports = {
    getMnemonic,
    getPrivateKey
};