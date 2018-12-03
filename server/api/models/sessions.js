module.exports = function (sequelize, DataTypes) {
  return sequelize.define('sessions', {
    session_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'sessions',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })
}
