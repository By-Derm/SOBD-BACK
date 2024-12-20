import express from 'express';
import { getAll, add, del } from '../../controllers/xubio.controller.js';

const router = express.Router();

router.get('/get', getAll);
router.post('/add', add);
router.delete('/delete/:id', del);

export default router;
