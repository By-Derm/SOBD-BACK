import e from "express";
import { getAll, add } from "../../controllers/elvis.controller.js";

const router = e.Router();

router.get('/getAll', (req, res)=>getAll(req, res));
router.post('/add', (req, res)=>add(req, res));


export default router;