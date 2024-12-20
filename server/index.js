import express from 'express'
import products from './routes/products/products.js';
import moviments from './routes/moviment/moviment.js';
import lots from './routes/lots/lots.js';
import users from './routes/users/users.js';
import visits from './routes/visits/visits.js';
import recipes from './routes/recipes/recipes.js';
import dcPoints from './routes/dcPoints/dcPoints.js';
import map from './routes/maps/map.js';
import transfers from './routes/transfers/transfers.js';
import awards from './routes/awards/awards.js';
import xubio from './routes/xubio/xubio.js'
import pendingsxubio from './routes/pendingsxubio/pendingsxubio.js'
import elvis from './routes/elvis/elvis.js'


import cors from 'cors'
const app = express();
import morgan from "morgan";


const PORT = process.env.PORT || 3003;

app.use(morgan('tiny'));
app.use(express.json());
app.use(cors({
  origin: '*', // Acepta todos los orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
}));


app.use('/products', products);
app.use('/moviments', moviments);
app.use('/lots', lots);
app.use('/users', users);
app.use('/visits', visits);
app.use('/recipes', recipes)
app.use('/dcPoints', dcPoints)
app.use('/zonas', map)
app.use('/transfers', transfers)
app.use('/awards', awards)
app.use('/xubio', xubio)
app.use('/pendingsxubio', pendingsxubio)
app.use('/elvis', elvis)

app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  });

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
