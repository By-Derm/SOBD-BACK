const express = require('express');
const cron = require('node-cron');
const { getRecipesFinal } = require('./index.recetas');
const { getApmsFinal } = require('./index.apms');
const { getRecipesAndCommentsFinal } = require('./index.visitsAndComents');

const app = express();

// Rutas de tu aplicación
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Cron jobs
const taskRecipes = cron.schedule('* */30 * * *', () => {
  try {
    getRecipesFinal();
  } catch (error) {
    console.error(error);
  }
});

const taskVisitsAndComments = cron.schedule('* */15 * * *', () => {
  try {
    getRecipesAndCommentsFinal();
  } catch (error) {
    console.error(error);
  }
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});