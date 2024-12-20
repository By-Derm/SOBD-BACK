import { DataTypes } from "sequelize";
import { sequelize } from "../mysql.config.js";


const Zonas = sequelize.define(
    'Zonas',
    {
      // Model attributes are defined here
    nombre_zona:{
        type: DataTypes.STRING
    },
    estante_1:{
        type: DataTypes.STRING
    },
    estante_2:{
        type: DataTypes.STRING
    },
    estante_3:{
        type: DataTypes.STRING
    },
    estante_4:{
        type: DataTypes.STRING
    },
    estante_5:{
        type: DataTypes.STRING
    },
    },
   
  );

  export default Zonas;