const { leaderboard } = require("../models");

async function leaderboardCreation(req, res) {
    const { user_id, username, address, points, rank } = req.body;

    if (!user_id || !username || !address || !points || !rank) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        await leaderboard.create({ user_id, username, address, points, rank });

        res.status(201).json({ success: true, message: "Leaderboard created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Leaderboard creation failed", error: error.message });
    }
}

module.exports = { leaderboardCreation };