import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';
import { sequelize } from './mysql.config.js';
import Boxes from './models/boxes.js';
import Lots from './models/lots.js';
import Products from './models/products.js';
import Moviments from './models/moviments.js';

Lots.hasMany(Boxes);
Boxes.belongsTo(Lots);

Moviments.hasMany(Lots);
Lots.belongsTo(Moviments);

Products.hasMany(Moviments);
Moviments.belongsTo(Products);

Products.hasMany(Lots);
Lots.belongsTo(Products);

Products.hasMany(Boxes);
Boxes.belongsTo(Products);


try {
  await sequelize.sync();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}



const firebaseConfig = {
  apiKey: "AIzaSyCjFhGson3rMRAreevYI3cladnZuprjZNI",
  authDomain: "depositotemporary.firebaseapp.com",
  projectId: "depositotemporary",
  storageBucket: "depositotemporary.appspot.com",
  messagingSenderId: "682061232493",
  appId: "1:682061232493:web:5eb36598b0e782f07e4264"
};



  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app)
  
  export { db, collection, sequelize }; 