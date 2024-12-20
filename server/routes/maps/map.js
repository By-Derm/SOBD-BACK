import { Router } from "express";

import { getZonas, updateZonas } from "../../controllers/maps.js";

const router = Router();
// Ruta del índice
router.get('/getZonas', (req, res)=>getZonas(req, res));
router.put('/upZonas/:id', (req, res)=>updateZonas(req, res));


export default router