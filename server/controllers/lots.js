import { addDoc, collection } from "firebase/firestore";
import { db } from "../db.js";
import Boxes from "../models/boxes.js";
import Lots from "../models/lots.js";

export const lotsController = async (req, res)=>{
    try {
      // ConvierteRecipeValue a un objeto plano
      const lotData = {
        expiration:req.body.expiration,
        product:req.body.product,
        quantity: req.body.quantity
      };
      const lotsCollection = collection(db, 'lots');
      const docRef = await addDoc(lotsCollection, lotData);
      res.send(docRef.id);
    } catch (error) {
      console.error('Error registering lot:', error);
      return null;
  }
}

export const getLots = async (req, res) => {
  try {
    const productId = req.params.id;

    // Encontrar todos los lotes para el producto especificado
    const lots = await Lots.findAll({
      where: {
        ProductId: productId
      }
    });

    if (lots.length === 0) {
      res.send({
        message: 'No hay lotes para este producto'
      });
      return;
    }

    // Inicializar el array para almacenar los lotes y sus cajas
    let lotsWithBoxes = [];
    let totalBoxCount = 0;

    // Iterar sobre cada lote para encontrar las cajas relacionadas
    for (const lot of lots) {
      const boxesInLot = await Boxes.findAll({
        where: {
          LotId: lot.dataValues.id
        }
      });

      // Sumar la cantidad de cajas encontradas
      totalBoxCount += boxesInLot.length;

      // Agregar el lote y sus cajas al array
      lotsWithBoxes.push({
        lot,
        boxes: boxesInLot
      });
    }

    // Enviar la respuesta con los lotes, sus cajas y la cantidad total de cajas
    res.send({
      lotsWithBoxes,
      totalBoxCount
    });
  } catch (error) {
    console.error('Error listing lots:', error);
    res.status(500).send({
      message: 'Error al listar los lotes'
    });
  }
};