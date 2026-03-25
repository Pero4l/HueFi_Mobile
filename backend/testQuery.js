const { Users, leaderboard } = require("./models");

async function test() {
  try {
    const users = await Users.findAll({ limit: 1, order: [['createdAt', 'DESC']] });
    console.log("USERS:", JSON.stringify(users, null, 2));

    const leaders = await leaderboard.findAll({ limit: 1, order: [['createdAt', 'DESC']] });
    console.log("LEADERBOARD:", JSON.stringify(leaders, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}
test();
