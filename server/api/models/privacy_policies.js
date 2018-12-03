module.exports = function (sequelize, DataTypes) {
  const PrivacyPolicies = sequelize.define('privacy_policies', {
    privacy_policy_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    version_notes: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uploaded_by: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
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
    tableName: 'privacy_policies',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  })

  PrivacyPolicies.associate = models => {
    PrivacyPolicies.belongsTo(
      models['users'],
      { foreignKey: 'uploaded_by', targetKey: 'user_id', as: 'uploader', constraints: false })
  }
  return PrivacyPolicies
}
