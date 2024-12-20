import express from 'express';
import {addProduct, getAll, updateProducts, getById, deleteProduct, addAll, all} from '../../controllers/products.js';


const router = express.Router();
// Ruta del índice
router.post('/add', (req, res)=>addProduct(req, res));
router.get('/all', (req, res)=>all(req, res));
router.put('/update/:id', (req, res)=>updateProducts(req, res));
router.get('/getAll', (req, res)=>getAll(req, res));
router.get('/:id', (req, res)=>getById(req, res));
router.delete('/delete/:id', (req, res)=>deleteProduct(req, res));


export default router;