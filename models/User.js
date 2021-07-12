module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Forneça um valor para "name"',
        },
        notEmpty: {
          msg: 'Forneça um valor para "name"',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      set(val) {
        this.setDataValue('email', val ? val.toLowerCase() : null);
      },
      unique: {
        args: true,
        msg: 'Email já utilizado',
      },
    },
    senha: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contra_senha: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ativo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    }
  }, {
    freezeTableName: true,
    tableName: "user",
  });

  User.associate = models => {
    User.hasMany(models.UserChat, {
      foreignKey: 'user_id',
      targetKey: 'id',
      as: 'users_chat',
    });
  };
  return User;
};
