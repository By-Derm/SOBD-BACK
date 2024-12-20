import { DataTypes } from "sequelize";
import { sequelize } from "../mysql.config.js";


const Product = sequelize.define(
    'Product',
    {
      // Model attributes are defined here
      active: {
        type: DataTypes.BOOLEAN,
      },
      description: {
        type: DataTypes.STRING,
      },
      minimunQuantityOnStock: {
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      category: {
        type: DataTypes.STRING,
        defaultValue:null,
      },
      quantity: {
        type: DataTypes.INTEGER,
      }
    },
   
  );

  export default Product;