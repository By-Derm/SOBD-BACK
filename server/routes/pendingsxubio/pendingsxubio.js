import express from 'express';
import { getAll, add, del } from '../../controllers/pendingsxubio.controller.js';


const router = express.Router();

router.get('/getAll', (req, res)=>getAll(req, res));
router.post('/add', (req, res)=>add(req, res));
router.delete('/delete/:id', (req, res)=>del(req, res));


export default router;