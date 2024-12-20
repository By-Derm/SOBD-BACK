import { addDoc, collection, doc, endBefore, getDoc, getDocs, limit, orderBy, query, startAfter, updateDoc, where } from "firebase/firestore";
import { db } from "../db.js";
import Moviment from "../models/moviments.js";
import Product from "../models/products.js";
import Lots from "../models/lots.js";
import Boxes from "../models/boxes.js";
import Pending from "../models/pending.js";



export const add = async (req, res) => {
  try {
    const products = req.body.products; // Asumiendo que req.body.products es un array de productos

    const newMoviments = [];

    for (let productData of products) {
      const { product, quantity, expiration, date, typeOfMoviment, suplierName, responsable, description, enterpryse, lot, referNumber, adresseeName, productionOrder, typeOfProduct, typeOfAdressee, bonus } = productData;

      const productToChange = await Product.findOne({
        where: { name: product }
      });

      if (!productToChange) {
        throw new Error(`Product ${product} not found`);
      }

      // Buscar si existe un lote con el producto
      let lotEntry = await Lots.findOne({
        where: { ProductId: productToChange.dataValues.id }
      });

      // Si no existe un lote, crear uno nuevo
      if (!lotEntry) {
        lotEntry = await Lots.create({
          ProductId: productToChange.dataValues.id,
          expiryDate: expiration || null
          // Otros campos necesarios para Lots, ajustar según sea necesario
        });
      }

      const boxQuantity = await Boxes.findOne({
        where: { ProductId: productToChange.dataValues.id }
      });

      if (!boxQuantity) {
        await Boxes.create({
          ProductId: productToChange.dataValues.id,
          quantity: quantity,
          LotId: lotEntry.dataValues.id
        });
      } else {
        const currentQuantity = boxQuantity.dataValues.quantity;
        await Boxes.update(
          { quantity: parseInt(currentQuantity) + parseInt(quantity) },
          { where: { ProductId: productToChange.dataValues.id } }
        );
      }

      const movimentData = {
        ProductId: productToChange.dataValues.id,
        date,
        typeOfMoviment,
        suplierName,
        responsable,
        product,
        description,
        enterpryse,
        lot,
        referNumber,
        expiration,
        quantity,
        adresseeName,
        productionOrder,
        typeOfProduct,
        typeOfAdressee,
        bonus
      };

      const newMoviment = await Moviment.create(movimentData);
      newMoviments.push(newMoviment);

      await Lots.update({ MovimentId: newMoviment.dataValues.id }, { where: { id: lotEntry.dataValues.id } });
    }
     res.send(newMoviments);
  } catch (error) {
    console.error('Error registering product:', error);
    res.status(500).send('Error registering product');
  }
};



export const getAll = async (req, res) => {
  try {
    // Obtener todos los movimientos
    const movements = await Moviment.findAll({
      order: [['createdAt', 'DESC']], // Ordenar por la fecha de creación
    });

    // Obtener el primer y último día del mes actual
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Primer día del mes
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Último día del mes

    // Filtrar movimientos para obtener solo los del mes actual
    const currentMonthMovements = movements.filter((movement) => {
      // Validar que createdAt esté en el formato correcto
      if (!movement.date || !movement.date.includes(',')) {
        return false; // Omitir registros sin el formato esperado
      }

      // Convertir la fecha en formato dd/mm/aaaa a un objeto Date
      const [datePart] = movement.date.split(','); // Obtener solo la parte de la fecha
      const [day, month, year] = datePart.split('/').map(Number);
      const movementDate = new Date(year, month - 1, day);

      // Comparar movimiento con el rango del mes actual
      return movementDate >= startOfMonth && movementDate <= endOfMonth;
    });

    res.json({
      data: currentMonthMovements,
    });
  } catch (error) {
    console.error('Error listing movements:', error);
    res.status(500).send('Internal Server Error');
  }
};



  
  export const update = async(req, res)=>{
    try {
      const id = req.params.id
      const movimentToChange = await Moviment.findOne({
        where:{
          id
        }
      });
      const productToChange = await Product.findOne({
        where:{
          name: movimentToChange.product
        }
      })
      
        const updatedProduct = Product.update({...productToChange, quantity: parseInt(productToChange.quantity) - parseInt(movimentToChange.quantity,10) + parseInt(req.body.quantity)}, {where:
       { id:productToChange.id,}
        })

        const newMovimentData = {
          date:req.body.date,
          typeOfMoviment: req.body.typeOfMoviment,
          suplierName: req.body.suplierName,
          responsable: req.body.responsable,
          product: req.body.product,
          description: req.body.description,
          enterpryse: req.body.enterpryse,
          lot: req.body.lot,
          referNumber: req.body.referNumber,
          expiration: req.body.expiration,
          quantity: req.body.quantity,
          adresseeName: req.body.adresseeName,
          productionOrder: req.body.productionOrder,
          typeOfProduct: req.body.typeOfProduct,
          typeOfAdressee: req.body.typeOfAdressee,
          bonus: req.body.bonus
        };

        await Moviment.update(newMovimentData, {
          where:{
            id
          }
        })
      res.send('Moviment Updated');
    } catch (error) {
      console.error('Error updating moviment:', error);
      return null;
    }
  }
  
  
  // //TODO Manejar que pasa cuando hay un error front / back
  export const getById = async(req, res)=>{
    try {
      const id = req.params.id
      const product = await Moviment.findOne({
        where:{
          id
        }
      });
      res.send(product)  
    } catch (error) {
      console.error('Error listing product:', error);
      return null;
    }
  }
  
  
  export const deleteMoviment = async(req, res)=>{
    try {
      const id = req.params.id
      const movimentToChange = await Moviment.findOne({
        where:{
          id
        }
      });
      const productToChange = await Product.findOne({
        where:{
          name: movimentToChange.dataValues.product
        }
      })

      

      const quantityBox = await Boxes.findOne({
        where:{
          ProductId: productToChange.dataValues.id
        }
      })

      
      
        const updatedProduct = await Boxes.update({quantity: parseInt(quantityBox.dataValues.quantity) - parseInt(movimentToChange.dataValues.quantity)}, {
          where: { ProductId:productToChange.id,}
        })

        
        await Moviment.destroy({
          where:{
            id
          }
        })
      res.send('Moviment Deleted');
  } catch (error) {
    console.error('Error registering product:', error);
    return null;
}
  }

  export const getMovimentPending = async(req, res)=>{
    try {
      const pendings = await Pending.findAll({
        where:{
          active: true
        }
      })
      res.send(pendings)
    } catch (error) {
      console.error('Error listing pendings:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  export const newPending = async (req, res) => {
    try {
      const pendingProducts = req.body.products; // Asumiendo que req.body.products es un array de productos
  
      // Array para almacenar los productos pendientes creados
      const newPendings = [];
  
      // Iterar sobre cada producto en el array y crear un registro en Pending
      for (let product of pendingProducts) {
        const newPending = await Pending.create(product);
        newPendings.push(newPending);
      }
  
      // Enviar todos los productos pendientes creados como respuesta
      res.send(newPendings);
    } catch (error) {
      console.error('Error registering pending:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  

  export const acceptMoviment = async(req, res)=>{
    try {
      const id = req.params.id

      const pendingProduct = await Pending.findOne({
        where:{
          id
        }
      })


      const product = await Product.findOne({
        where:{
          name: pendingProduct.dataValues.product
        }
      })

      const newMoviment = await Moviment.create({
          date:pendingProduct.dataValues.date,
          typeOfMoviment: pendingProduct.dataValues.typeOfMoviment,
          suplierName: pendingProduct.dataValues.suplierName,
          responsable: pendingProduct.dataValues.responsable,
          product: pendingProduct.dataValues.product,
          enterpryse: pendingProduct.dataValues.enterpryse,
          lot: pendingProduct.dataValues.lot,
          referNumber: pendingProduct.dataValues.referNumber,
          expiration: pendingProduct.dataValues.expiration,
          quantity: pendingProduct.dataValues.quantity,
          adresseeName: pendingProduct.dataValues.adresseeName,
          productionOrder: pendingProduct.dataValues.productionOrder,
          typeOfProduct: pendingProduct.dataValues.typeOfProduct,
          typeOfAdressee: pendingProduct.dataValues.typeOfAdressee,
          ProductId: product.dataValues.id,
          bonus: pendingProduct.dataValues.bonus
        }) 

      const quantityBox = await Boxes.findOne({
        where:{
          ProductId: product.dataValues.id
        }
      })


      const updatedProduct = await Boxes.update({quantity: parseInt(quantityBox.dataValues.quantity) + parseInt(newMoviment.dataValues.quantity)}, {
        where: { ProductId:product.dataValues.id,}
      })

      await Pending.update({active: false}, {
        where:{
          id
        }
      })

      res.send(newMoviment)


    } catch (error) {
      console.error('Error registering product:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  export const deletePending = async(req, res)=>{
    try {
      const id = req.params.id
      const pendingToChange = await Pending.findOne({
        where:{
          id
        }
      })
      await Pending.update({active: false}, {
        where:{
          id
        }
      })
      res.send(pendingToChange)
    } catch (error) {
      console.error('Error registering product:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  export const editPending = async(req, res)=>{
    try {
      const id = req.params.id
      const quantity = req.body.quantity
      const pendingToChange = await Pending.update({quantity: quantity, referNumber: req.body.referNumber}, {
        where:{
          id
        }
        
      })

      console.log(pendingToChange)

      res.send(pendingToChange)
    } catch (error) {
      console.error('Error registering product:', error);
      res.status(500).send('Internal Server Error');
    }
  }