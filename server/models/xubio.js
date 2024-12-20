import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../mysql.config.js";


const Xubio = sequelize.define('Xubio', {
  code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  adresseeName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'xubio',
  timestamps: false, // Desactiva createdAt y updatedAt, si no necesitas esos campos
});

export default Xubio;