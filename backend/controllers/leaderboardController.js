const { leaderboard } = require("../models");

async function updatePoints(req, res) {
    const user_id = req.user.user_id;

    try {
        const board = await leaderboard.findOne({ where: { user_id } });
        if (!board) {
            return res.status(404).json({ success: false, message: "Leaderboard entry not found" });
        }

        board.points += 2;
        await board.save();

        res.status(200).json({ success: true, message: "Points updated successfully", data: board });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update points", error: error.message });
    }
}

async function getLeaderboard(req, res) {
    try {
        const topUsers = await leaderboard.findAll({
            order: [['points', 'DESC']],
            limit: 50,
            raw: true
        });

        const rankedUsers = topUsers.map((user, index) => ({
            ...user,
            rank: index + 1
        }));

        res.status(200).json({ success: true, data: rankedUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch leaderboard", error: error.message });
    }
}

module.exports = { updatePoints, getLeaderboard };