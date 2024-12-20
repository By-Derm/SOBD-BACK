import { DataTypes } from "sequelize";
import { sequelize } from "../mysql.config.js";

const Pending = sequelize.define(
    'Pending',
    {
      // Model attributes are defined here
      adresseeName: {
        type: DataTypes.STRING,
      },
      active: {
        type: DataTypes.BOOLEAN,
      },
      date: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      date: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      enterpryse: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      expiration: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      lot: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      product: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      productionOrder: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      quantity: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      referNumber: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      responsable: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      suplierName: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      typeOfAdressee: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      typeOfMoviment: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      typeOfProduct: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      bonus: {
        type: DataTypes.BOOLEAN,
        // allowNull defaults to true
      },
    },
    {
      // Other model options go here
    },
  );

  export default Pending;