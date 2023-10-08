const { sequelize } = require('../configs/connectDb');
const { DataTypes } = require('sequelize');

const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    section_order: {
      type: DataTypes.TEXT,
    },
    password: {
      type: DataTypes.STRING(255),
    },
    provider: {
      type: DataTypes.STRING(255),
    },
    profile_pic: {
      type: DataTypes.TEXT,
    },
    refresh_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

const Role = sequelize.define(
  'role',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(225),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

const UserRoles = sequelize.define(
  'user_roles',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false, freezeTableName: true }
);
const Permission = sequelize.define(
  'permission',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

const UserPermissions = sequelize.define(
  'user_permissions',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

const RolePermissions = sequelize.define(
  'roles_permissions',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

// Define associations

Role.belongsToMany(User, { through: UserRoles, foreignKey: 'role_id' });
User.belongsToMany(Role, { through: UserRoles, foreignKey: 'user_id' });
Role.belongsToMany(Permission, {
  through: RolePermissions,
  foreignKey: 'role_id',
});
Permission.belongsToMany(Role, {
  through: RolePermissions,
  foreignKey: 'permission_id',
});

Permission.belongsToMany(User, {
  through: UserPermissions,
  foreignKey: 'permission_id',
});
User.belongsToMany(Permission, {
  through: UserPermissions,
  foreignKey: 'user_id',
});
module.exports = { User, Role, Permission };
