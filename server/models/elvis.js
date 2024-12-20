import { DataTypes } from "sequelize";
import { sequelize } from "../mysql.config.js";

const Elvis = sequelize.define('Elvis', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  codigo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  apm: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  adress: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  drog: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  sucursal: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  client: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'elvis', // Nombre de la tabla en la base de datos
  timestamps: false,  // Desactiva createdAt y updatedAt
});

export default Elvis;