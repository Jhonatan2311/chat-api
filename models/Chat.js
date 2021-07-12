module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    actived: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    }
  }, {
    freezeTableName: true,
    tableName: 'chat',
    indexes: [],
  });

  Chat.associate = models => {
    Chat.hasMany(models.Message, {
      foreignKey: 'chat_id',
      targetKey: 'id',
      as: 'messages',
    });
    Chat.hasMany(models.UserChat, {
      foreignKey: 'chat_id',
      targetKey: 'id',
      as: 'users_chat',
    });
  };

  return Chat;
};