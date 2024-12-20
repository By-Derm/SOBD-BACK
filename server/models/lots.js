import { DataTypes } from "sequelize";
import { sequelize } from "../mysql.config.js";


const Lots = sequelize.define(
    'Lot',
    {
      // Model attributes are defined here
      name:{
        type: DataTypes.STRING
      },
      expiryDate: {
        type: DataTypes.STRING,
      },
    },
   
  );

  export default Lots;