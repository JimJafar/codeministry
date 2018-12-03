module.exports = function (sequelize, DataTypes) {
  const Users = sequelize.define('users', {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    office_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    activation_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    two_factor_secret: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    two_factor_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    two_factor_login: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    personalise_third_party_ads: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    receive_code_ministry_update_emails: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    receive_third_party_offers: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    privacy_policy_agreed_version: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    privacy_policy_agreed_version_history: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    terms_of_use_agreed_version: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    terms_of_use_agreed_version_history: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
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
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  return Users
}
