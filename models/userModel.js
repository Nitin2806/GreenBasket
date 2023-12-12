//      Group Members
// Nitin Mishra - 8891046
// Rachna Shukla - 8922636
// Kritagya Mishra - 8899402
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    created_at: {
      type: DataTypes.TIMESTAMP,
      defaultValue: DataTypes.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.TIMESTAMP,
      defaultValue: DataTypes.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
      allowNull: false,
    },
  });

  return User;
};
