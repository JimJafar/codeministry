module.exports = function (sequelize, DataTypes) {
  const Users = sequelize.define('users', {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
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
    business_address_line1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    business_address_line2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    business_city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    business_postal_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    business_state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    facebook: {
      type: DataTypes.STRING,
      allowNull: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true
    },
    instagram: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    job_title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    linkedin: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    personal_id_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    personalise_third_party_ads: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
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
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true
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
    residential_address_line1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    residential_address_line2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    residential_city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    residential_postal_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    residential_state: {
      type: DataTypes.STRING,
      allowNull: true
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
    two_factor_secret: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
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
