import express from 'express';
import {getAll, add, update, deleteMoviment, getMovimentPending, newPending, acceptMoviment, deletePending, editPending  } from '../../controllers/moviments.js';


const router = express.Router();
// Ruta del índice
router.post('/add', (req, res)=>add(req, res));
router.get('/getAll', (req, res)=>getAll(req, res));
router.put('/update/:id', (req, res)=>update(req, res))
router.delete('/delete/:id', (req, res)=>deleteMoviment(req, res))
router.get('/pending', (req, res)=>getMovimentPending(req, res))
router.post('/addPending', (req, res)=>newPending(req, res))
router.put('/accept/:id', (req, res)=>acceptMoviment(req, res))
router.delete('/deletePending/:id', (req, res)=>deletePending(req, res))
router.put('/updatePending/:id', (req, res)=>editPending(req, res));

// router.put('/update/:id', (req, res)=>update(req, res));






export default router;