module.exports = (sequelize, DataTypes) => {
  const UserChat = sequelize.define('UserChat', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Forneça um valor para "chat_id"',
        },
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Forneça um valor para "user_id"',
        },
      },
    },
    actived: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    }
  }, {
    freezeTableName: true,
    tableName: 'user_chat',
    indexes: [],
  });

  UserChat.associate = models => {
    UserChat.belongsTo(models.Chat, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      foreignKey: 'chat_id',
      as: "chat",
    });
    UserChat.belongsTo(models.User, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      foreignKey: 'user_id',
      as: "user",
    });
  };

  return UserChat;
};