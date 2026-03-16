'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class leaderboard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      leaderboard.belongsTo(models.Users, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  leaderboard.init({
    user_id: DataTypes.UUID,
    username: DataTypes.STRING,
    address: DataTypes.STRING,
    points: DataTypes.INTEGER,
    rank: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'leaderboard',
  });
  return leaderboard;
};