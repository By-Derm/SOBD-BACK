import { DataTypes } from "sequelize";
import { sequelize } from "../mysql.config.js";


const Boxes = sequelize.define('Boxes', {
  size: {
    type: DataTypes.INTEGER,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  weight: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },
});

export default Boxes;