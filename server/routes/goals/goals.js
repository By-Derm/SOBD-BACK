import express from 'express';
import {getAll, addGoal, updateGoal, getAllGoals} from '../../controllers/goals.js';


const router = express.Router();
// Ruta del índice
router.post('/add', (req, res)=>addGoal(req, res));
router.get('/getOne/:id', (req, res)=>getOne(req, res));
router.put('/update/:id', (req, res)=>updateGoal(req, res));
router.get('/getAll', (req, res)=>getAllGoals(req, res))

// router.put('/update/:id', (req, res)=>update(req, res));






export default router;