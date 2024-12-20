import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../mysql.config.js";


const Award = sequelize.define('Award', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  apm_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cantidad_alcanzada: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  objetivo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  premio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  tableName: 'awards',
  timestamps: false, // Esto desactiva las columnas 'createdAt' y 'updatedAt' que Sequelize añade por defecto
});

export default Award;