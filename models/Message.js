module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
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
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Forneça um valor para "content"',
            },
            notEmpty: {
                msg: 'Forneça um valor para "content"',
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
      tableName: 'message',
      indexes: [],
    });
  
    Message.associate = models => {
      Message.belongsTo(models.Chat, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        foreignKey: 'chat_id',
        as: "chat",
      });
      Message.belongsTo(models.User, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        foreignKey: 'user_id',
        as: "user",
      });
    };
  
    return Message;
  };