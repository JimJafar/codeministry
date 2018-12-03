module.exports = function (sequelize, DataTypes) {
  const Logs = sequelize.define('logs', {
    log_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    callstack: {
      type: DataTypes.JSON,
      allowNull: true
    },
    device_info: {
      type: DataTypes.JSON,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER,
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
    tableName: 'logs',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  Logs.associate = models => {
    Logs.belongsTo(
      models[ 'users' ],
      { foreignKey: 'identifier', targetKey: 'user_id', as: 'user', constraints: false })
  }
  return Logs
}
