module.exports = (sequelize, DataTypes) => {
  const UserFriend = sequelize.define("user_friends", {
    userId: {
      type: DataTypes.INTEGER,
    },

    friendId: {
      type: DataTypes.INTEGER,
    },
  });

  return UserFriend;
};
