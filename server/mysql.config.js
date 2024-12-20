import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('railway', 'root', 'UPOjuhphZXWPnhngfSGyrFHCzGeVHfnU', {
    host: 'monorail.proxy.rlwy.net',
    port: 49152,
    dialect: 'mysql',
    logging: false,
  });
  

export { sequelize };