import express from 'express';
import { addUser, getUser } from '../../controllers/users.js';


const router = express.Router();
// Ruta del índice
router.post('/add', (req, res)=>addUser(req, res));
router.get('/get/:id', (req, res)=>getUser(req, res));





export default router;