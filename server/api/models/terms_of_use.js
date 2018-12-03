module.exports = function (sequelize, DataTypes) {
  const TermsOfUse = sequelize.define('terms_of_use', {
    terms_of_use_id: {
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
    tableName: 'terms_of_use',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  })

  TermsOfUse.associate = models => {
    TermsOfUse.belongsTo(
      models['users'],
      { foreignKey: 'uploaded_by', targetKey: 'user_id', as: 'uploader', constraints: false })
  }
  return TermsOfUse
}
