import { db } from "../db.js"
import { collection, addDoc, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import Product from "../models/products.js";
import Boxes from "../models/boxes.js";
import Lots from "../models/lots.js";

export const addProduct = async (req, res)=>{
        try {
          // ConvierteRecipeValue a un objeto plano
          const productData = {
            name:req.body.name,
            minimunQuantityOnStock: parseInt(req.body.minimunQuantityOnStock, 10),
            quantity: req.body.quantity,
            active: true,
            category: req.body.category
          };


          const product = await Product.create(productData)



          const lot = await Lots.create({
            ProductId: product.id,
          })

          const box = await Boxes.create({
            ProductId: product.id,
            quantity: parseInt(req.body.quantity, 10),
            LotId: lot.id
          })

          res.send(product);
        } catch (error) {
          console.error('Error registering product:', error);
          return null;
      }
}

export const all = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { active: true } });
    res.send(products);
  } catch (error) {
    console.error('Error listing products:', error);
    return null;
  }
};


export const getAll = async (req, res) => {
    try {
      // Obtener todos los registros de la tabla Boxes
      const boxes = await Boxes.findAll();

      const productsId = boxes.map((box) => ({
        ProductId: box.dataValues.ProductId,
        quantity: box.dataValues.quantity
      }));
      
      const products = await Product.findAll({ where: { active: true } });
      

      for (const product of products) {
        const productBox = productsId.find((box) => box.ProductId === product.dataValues.id);

        if (productBox) {
          product.dataValues.quantity = productBox.quantity;
        }
      }

      
      
      
      
      // Inicializar un objeto para almacenar la información agrupada
        const productsInfo = {};

        for (const box of boxes) {
        const productId = box.dataValues.ProductId;


        

        // Obtener el producto correspondiente usando el productId
        const product = products.find((p) => p.dataValues.id === productId);

        

        if (!product) {
            continue; // Si no se encuentra el producto, saltar a la siguiente iteración
        }

        // Si el producto ya está en el objeto, actualizar la cantidad y el número de cajas
        if (productsInfo[productId]) {
            productsInfo[productId].quantity += box.dataValues.quantity;
            productsInfo[productId].boxCount += 1;
        } else {
            // Si el producto no está en el objeto, agregarlo con la información inicial
            productsInfo[productId] = {
            ...product.dataValues,
            quantity: box.dataValues.quantity,
            boxCount: 1,
            };
        }
        }

        // Convertir el objeto en un array
        const prods = Object.values(productsInfo);

        res.send(prods.sort((a, b) => a.name.localeCompare(b.name))); // Devolver los productos agrupados con la información adicional
    } catch (error) {
      console.error('Error listing products:', error);
      res.status(500).send({ error: 'An error occurred while listing products' });
    }
  };
  
  

export const updateProducts = async(req, res)=>{
  try {
    const id = req.params.id
    const product = await Product.findByPk(id)
    const updatedProduct = await Product.update({...product, ...req.body}, {
        where: {id}
    });

    res.send('Product Updated');
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}


//TODO Manejar que pasa cuando hay un error front / back
export const getById = async(req, res)=>{
  try {
    const id = req.params.id
    const product = await Product.findByPk(id)
    res.send(product)  
  } catch (error) {
    console.error('Error listing product:', error);
    return null;
  }
}


export const deleteProduct = async(req, res)=>{
  try {
    const id = req.params.id
    const product = await Product.findByPk(id)

    const updatedProduct = await Product.update({...product, active: false}, {
        where: {id}
    });
    res.send('Product Deleted');
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}


export const addAll = async(req, res)=>{
  try {
 
    const productsCollection = collection(db, 'products');

    const json = [
      
        {
            "description": "",
            "minimunQuantityOnStock": 0,
            "quantity": 0,
            "name": "MUESTRA CLEANSER GEL".toUpperCase(),
            "active": true,
        },
        {
            "description": "-",
            "quantity": 18197,
            "name": "Inner envase 30ml".toUpperCase(),
            "active": true,
            "minimunQuantityOnStock": "1000",
        },
        {
            "quantity": 0,
            "active": true,
            "name": "ESTUCHE - CLARIFIER".toUpperCase(),
            "description": "",
            "minimunQuantityOnStock": 0,
        },
        {
            "name": "Rollo Etiqueta Equilibrium".toUpperCase(),
            "active": true,
            "description": "-",
            "quantity": 2500,
            "minimunQuantityOnStock": "1000",
        },
        {
            "description": "",
            "quantity": 15,
            "name": "FRISBY".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "active": true,
        },
        {
            "description": "",
            "quantity": 128,
            "minimunQuantityOnStock": 1000,
            "name": "ALCOHOL X 100".toUpperCase(),
            "active": true,
        },
        {
            "description": "",
            "active": true,
            "name": "DISPROFARMA TESTERS - EQUILIBRIUM".toUpperCase(),
            "quantity": 4,
            "minimunQuantityOnStock": 0,
        },
        {
            "quantity": 0,
            "minimunQuantityOnStock": 0,
            "description": "",
            "name": "DISPROFARMA TESTERS - CAPILAR FORTX X 30".toUpperCase(),
            "active": true,
        },
        {
            "active": true,
            "quantity": 4,
            "description": "",
            "name": "DISPROFARMA TESTERS - EY30".toUpperCase(),
            "minimunQuantityOnStock": 1000,
        },
        {
            "description": "",
            "name": "ESTUCHE - CAPILAR OX-SA X 250".toUpperCase(),
            "active": true,
            "quantity": 0,
            "minimunQuantityOnStock": 1000,
        },
        {
            "description": "",
            "name": "DISPROFARMA PRODUCTO ROTO UREA 10 400".toUpperCase(),
            "active": true,
            "minimunQuantityOnStock": 1000,
            "quantity": 0,
        },
        {
            "active": true,
            "quantity": 1500,
            "description": "-",
            "minimunQuantityOnStock": "1000",
            "name": "Rollo Etiqueta Filler".toUpperCase(),
        },
        {
            "minimunQuantityOnStock": 1000,
            "description": "",
            "quantity": 494,
            "active": true,
            "name": "RENO SKIN 8".toUpperCase(),
        },
        {
            "quantity": 0,
            "description": "",
            "minimunQuantityOnStock": 0,
            "name": "DISPROFARMA PRODUCTO ROTO FILLER".toUpperCase(),
            "active": true,
        },
        {
            "minimunQuantityOnStock": 1000,
            "description": "",
            "quantity": 757,
            "name": "MUESTRA FILLER".toUpperCase(),
            "active": true,
        },
        {
            "minimunQuantityOnStock": 0,
            "quantity": 0,
            "active": true,
            "name": "DISPROFARMA PRODUCTO ROTO EYES15".toUpperCase(),
            "description": "",
        },
        {
            "description": "",
            "active": true,
            "name": "vademecum".toUpperCase(),
            "quantity": 6,
            "minimunQuantityOnStock": 1000,
        },
        {
            "minimunQuantityOnStock": 1000,
            "description": "",
            "active": true,
            "name": "BB CLARO X 60".toUpperCase(),
            "quantity": 2573,
        },
        {
            "name": "DISPROFARMA PRODUCTO ROTO STEM CELL PLUS".toUpperCase(),
            "minimunQuantityOnStock": 0,
            "description": "",
            "active": true,
            "quantity": 0,
        },
        {
            "name": "LAPICERAS - EQUILIBRIUM".toUpperCase(),
            "description": "",
            "quantity": 100,
            "minimunQuantityOnStock": 1000,
            "active": true,
        },
        {
            "minimunQuantityOnStock": 1000,
            "description": "",
            "quantity": 5098,
            "name": "TARJETITA KFL".toUpperCase(),
            "active": true,
        },
        {
            "quantity": 0,
            "active": true,
            "description": "",
            "name": "RECETARIO INTERIOR".toUpperCase(),
            "minimunQuantityOnStock": 0,
        },
        {
            "description": "",
            "active": true,
            "name": "DISPROFARMA PRODUCTO ROTO EQUILIBRIUM".toUpperCase(),
            "quantity": 0,
            "minimunQuantityOnStock": 0,
        },
        {
            "quantity": 5,
            "description": "",
            "active": true,
            "minimunQuantityOnStock": 1000,
            "name": "DISPROFARMA TESTERS - CLARIF".toUpperCase(),
        },
        {
            "description": "-",
            "name": "Folleto - Glicolicos / Despigmentantes".toUpperCase(),
            "minimunQuantityOnStock": "1000",
            "active": true,
            "quantity": 0,
        },
        {
            "minimunQuantityOnStock": 0,
            "quantity": 280,
            "description": "",
            "active": true,
            "name": "ESTUCHE - HYDRA X 60".toUpperCase(),
        },
        {
            "minimunQuantityOnStock": 1000,
            "active": true,
            "description": "",
            "name": "BBFLUIDCLARO75".toUpperCase(),
            "quantity": 4425,
        },
        {
            "description": "",
            "name": "DISPROFARMA PRODUCTO ROTO STEM TENSE".toUpperCase(),
            "minimunQuantityOnStock": 0,
            "active": true,
            "quantity": 0,
        },
        {
            "active": true,
            "quantity": 3,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "name": "DISPROFARMA TESTERS - FRESH 75".toUpperCase(),
        },
        {
            "description": "-",
            "minimunQuantityOnStock": "1000",
            "quantity": 218,
            "active": true,
            "name": "Botella Nutri Corporal 200".toUpperCase(),
        },
        {
            "name": "HYDRA X 50".toUpperCase(),
            "active": true,
            "description": "",
            "minimunQuantityOnStock": 1000,
            "quantity": 1663,
        },
        {
            "minimunQuantityOnStock": "1000",
            "description": "-",
            "quantity": 7500,
            "active": true,
            "name": "Rollo etiqueta VT".toUpperCase(),
        },
        {
            "name": "RELOJ DE PARED".toUpperCase(),
            "quantity": 3,
            "description": "",
            "minimunQuantityOnStock": 1000,
            "active": true,
        },
        {
            "description": "",
            "name": "ESTUCHE - BY BLOCK BLANCO X 60".toUpperCase(),
            "active": true,
            "minimunQuantityOnStock": 1000,
            "quantity": 2386,
        },
        {
            "description": "",
            "minimunQuantityOnStock": 1000,
            "active": true,
            "name": "TAPAS NEGRAS".toUpperCase(),
            "quantity": 1085,
        },
        {
            "active": true,
            "quantity": 6,
            "name": "DISPROFARMA TESTERS - CLG 150".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "description": "",
        },
        {
            "active": true,
            "quantity": 2,
            "name": "MALUS STEM CELLS PLUS BOTELLA 1KG".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "description": "",
        },
        {
            "active": true,
            "name": "C AQUA X 250".toUpperCase(),
            "description": "",
            "minimunQuantityOnStock": 1000,
            "quantity": 342,
        },
        {
            "minimunQuantityOnStock": 1000,
            "name": "MUESTRA - KOLLAGEN".toUpperCase(),
            "quantity": 1755,
            "active": true,
            "description": "",
        },
        {
            "description": "",
            "quantity": 13548,
            "active": true,
            "minimunQuantityOnStock": 1000,
            "name": "MUESTRA BB FLUID MEDIO".toUpperCase(),
        },
        {
            "quantity": 2857,
            "minimunQuantityOnStock": "1000",
            "active": true,
            "description": "-",
            "name": "Valvula Stem Grape".toUpperCase(),
        },
        {
            "description": "-",
            "quantity": 10200,
            "name": "Botella Heaven 150 en Blanco".toUpperCase(),
            "minimunQuantityOnStock": "1000",
            "active": true,
        },
        {
            "active": true,
            "quantity": 10986,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "name": "MUESTRA STEM TENSE".toUpperCase(),
        },
        {
            "name": "MUESTRA UREA 10".toUpperCase(),
            "active": true,
            "description": "",
            "quantity": 0,
            "minimunQuantityOnStock": 0,
        },
        {
            "quantity": 2637,
            "description": "",
            "name": "FRESH ROXA X 75".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "active": true,
        },
        {
            "name": "Pomo C/Impresión Cleanser Milk".toUpperCase(),
            "description": "-",
            "minimunQuantityOnStock": "1000",
            "active": true,
            "quantity": 0,
        },
        {
            "minimunQuantityOnStock": 1000,
            "quantity": 3500,
            "active": true,
            "name": "ESTUCHE - CAPILAR FORTE X 30".toUpperCase(),
            "description": "",
        },
        {
            "active": true,
            "quantity": 1,
            "description": "",
            "minimunQuantityOnStock": 1000,
            "name": "BANNERS DE KOLLAGENO".toUpperCase(),
        },
        {
            "minimunQuantityOnStock": "0",
            "quantity": 0,
            "name": "Folleto - Tratamientos Intensivos Serums".toUpperCase(),
            "active": true,
            "description": "-",
        },
        {
            "quantity": 2190,
            "minimunQuantityOnStock": "1000",
            "name": "Tapa para micelar aqua 100".toUpperCase(),
            "description": "-",
            "active": true,
        },
        {
            "minimunQuantityOnStock": 0,
            "description": "",
            "quantity": 3,
            "active": true,
            "name": "DISPROFARMA TESTERS - FILLER".toUpperCase(),
        },
        {
            "name": "DISPROFARMA PRODUCTO ROTO CLARIFIER".toUpperCase(),
            "minimunQuantityOnStock": 0,
            "quantity": 0,
            "active": true,
            "description": "",
        },
        {
            "quantity": 14,
            "minimunQuantityOnStock": 1000,
            "name": "DISPROFARMA TESTERS - AQUA MICLEAR 250".toUpperCase(),
            "description": "",
            "active": true,
        },
        {
            "quantity": 1215,
            "name": "RECETARIOS CABA".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "active": true,
            "description": "",
        },
        {
            "name": "bb fluid blanco Estuches".toUpperCase(),
            "quantity": 14285,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "active": true,
        },
        {
            "quantity": 1146,
            "name": "LAPICERA - KOLLAGENO".toUpperCase(),
            "description": "",
            "minimunQuantityOnStock": 1000,
            "active": true,
        },
        {
            "name": "ENVASE S/IMPRESION PARA HY-NF-RP-RS".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "description": "",
            "quantity": 7450,
            "active": true,
        },
        {
            "quantity": 0,
            "active": true,
            "name": "DISPROFARMA PRODUCTO ROTO NUTRI FACIAL 50".toUpperCase(),
            "minimunQuantityOnStock": 0,
            "description": "",
        },
        {
            "quantity": 2,
            "minimunQuantityOnStock": 1000,
            "active": true,
            "description": "",
            "name": "DISPROFARMA TESTERS - OXSA".toUpperCase(),
        },
        {
            "name": "etiquetas de cierre".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "quantity": 57,
            "active": true,
            "description": "",
        },
        {
            "description": "-",
            "minimunQuantityOnStock": "1000",
            "name": "Inner envase 15ml".toUpperCase(),
            "active": true,
            "quantity": 13643,
        },
        {
            "minimunQuantityOnStock": "1000",
            "quantity": 4518,
            "name": "Botella Urea 400".toUpperCase(),
            "active": true,
            "description": "-",
        },
        {
            "description": "",
            "active": true,
            "name": "DISPROFARMA TESTERS - BB OSCURO".toUpperCase(),
            "quantity": 21,
            "minimunQuantityOnStock": 1000,
        },
        {
            "active": true,
            "name": "Botella Serum".toUpperCase(),
            "minimunQuantityOnStock": "1000",
            "quantity": 22052,
            "description": "-",
        },
        {
            "description": "-",
            "name": "Folleto - Fresh Skin Roxa".toUpperCase(),
            "minimunQuantityOnStock": "0",
            "active": true,
            "quantity": 0,
        },
        {
            "quantity": 7,
            "description": "",
            "minimunQuantityOnStock": 1000,
            "name": "DISPROFARMA TESTERS - FRESH 150".toUpperCase(),
            "active": true,
        },
        {
            "description": "",
            "name": "MUESTRA VT".toUpperCase(),
            "quantity": 1937,
            "active": true,
            "minimunQuantityOnStock": 1000,
        },
        {
            "minimunQuantityOnStock": 0,
            "description": "",
            "quantity": 0,
            "active": true,
            "name": "DISPROFARMA TESTERS - CAPILAR FORTX X 60".toUpperCase(),
        },
        {
            "minimunQuantityOnStock": 1000,
            "name": "DISPROFARMA PRODUCTO ROTO CLEANSER AQUA MICELAR".toUpperCase(),
            "active": true,
            "quantity": 0,
            "description": "",
        },
        {
            "quantity": 0,
            "minimunQuantityOnStock": 1000,
            "name": "ESTUCHE - C+H FACIAL".toUpperCase(),
            "description": "",
            "active": true,
        },
        {
            "quantity": 2487,
            "name": "BOLSA KFL 50".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "description": "",
            "active": true,
        },
        {
            "quantity": 0,
            "minimunQuantityOnStock": "1000",
            "active": true,
            "description": "-",
            "name": "Botella Micelar Aqua 100".toUpperCase(),
        },
        {
            "description": "",
            "quantity": 2745,
            "active": true,
            "minimunQuantityOnStock": 1000,
            "name": "ESTUCHE - RENO SKIN 5".toUpperCase(),
        },
        {
            "quantity": 3692,
            "name": "CAPILAR OX-SA X250".toUpperCase(),
            "active": true,
            "minimunQuantityOnStock": 1000,
            "description": "",
        },
        {
            "minimunQuantityOnStock": 1000,
            "active": true,
            "quantity": 1,
            "description": "",
            "name": "DEVOLUCION DISPROFARMA TESTERS BY BLOCK FLUID BL".toUpperCase(),
        },
        {
            "active": true,
            "description": "-",
            "minimunQuantityOnStock": "1000",
            "name": "Tapas Cap + Pump".toUpperCase(),
            "quantity": 17984,
        },
        {
            "active": true,
            "minimunQuantityOnStock": 1000,
            "name": "RENO SKIN 10".toUpperCase(),
            "quantity": 1,
            "description": "",
        },
        {
            "name": "ESTUCHE - CAPILAR FORTE X 60".toUpperCase(),
            "active": true,
            "description": "",
            "minimunQuantityOnStock": 1000,
            "quantity": 1656,
        },
        {
            "active": true,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "name": "CUCHARAS KOLLAGENO".toUpperCase(),
            "quantity": 14000,
        },
        {
            "quantity": 2540,
            "description": "-",
            "minimunQuantityOnStock": "1000",
            "name": "Envase C+ H Facial".toUpperCase(),
            "active": true,
        },
        {
            "quantity": 7,
            "name": "DISPROFARMA TESTERS - VT".toUpperCase(),
            "description": "",
            "active": true,
            "minimunQuantityOnStock": 1000,
        },
        {
            "description": "",
            "minimunQuantityOnStock": 0,
            "active": true,
            "quantity": 0,
            "name": "MUESTRA FRESH".toUpperCase(),
        },
        {
            "active": true,
            "quantity": 24,
            "name": "DISPROFARMA TESTERS - CAQ100".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "description": "",
        },
        {
            "name": "Tapas envase 15ml".toUpperCase(),
            "minimunQuantityOnStock": "1000",
            "description": "-",
            "active": true,
            "quantity": 1454,
        },
        {
            "quantity": 15889,
            "description": "",
            "minimunQuantityOnStock": 1000,
            "active": true,
            "name": "MUESTRA BB FLUID CLARO".toUpperCase(),
        },
        {
            "quantity": 558,
            "active": true,
            "description": "-",
            "minimunQuantityOnStock": "1000",
            "name": "Botella fresh 75".toUpperCase(),
        },
        {
            "description": "",
            "active": true,
            "quantity": 2,
            "minimunQuantityOnStock": 1000,
            "name": "DISPROFARMA TESTERS - HY".toUpperCase(),
        },
        {
            "active": true,
            "quantity": 0,
            "name": "DISPROFARMA PRODUCTO ROTO BY BLOCK OSCURO".toUpperCase(),
            "description": "",
            "minimunQuantityOnStock": 0,
        },
        {
            "quantity": 1000,
            "active": true,
            "minimunQuantityOnStock": "1000",
            "name": "Botella Stem Cells Plus".toUpperCase(),
            "description": "-",
        },
        {
            "description": "",
            "name": "ESTUCHE - CLEANSER MILK X 150".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "quantity": 0,
            "active": true,
        },
        {
            "quantity": 1,
            "active": true,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "name": "DISPROFARMA PRODUCTO ROTO EYES 30".toUpperCase(),
        },
        {
            "minimunQuantityOnStock": 1000,
            "quantity": 0,
            "active": true,
            "name": "DISPROFARMA PRODUCTO ROTO KOLLAGENO 250".toUpperCase(),
            "description": "",
        },
        {
            "name": "DISPROFARMA PRODUCTO ROTO CAPILAR FORTE X 30".toUpperCase(),
            "description": "",
            "active": true,
            "quantity": 0,
            "minimunQuantityOnStock": 0,
        },
        {
            "active": true,
            "quantity": 1,
            "minimunQuantityOnStock": 0,
            "description": "",
            "name": "DISPROFARMA TESTERS - BB BLANCO".toUpperCase(),
        },
        {
            "minimunQuantityOnStock": "1000",
            "description": "-",
            "active": true,
            "quantity": 50004,
            "name": "Rollo Etiqueta BB Fluid Medio".toUpperCase(),
        },
        {
            "name": "BASE MOSTRADOR CELULITS".toUpperCase(),
            "active": true,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "quantity": 166,
        },
        {
            "quantity": 3132,
            "active": true,
            "description": "",
            "minimunQuantityOnStock": 1000,
            "name": "ESTUCHE - CLEANSER MILK X 100".toUpperCase(),
        },
        {
            "name": "CUNAS 14X14 (CLG150/CLM150)".toUpperCase(),
            "active": true,
            "quantity": 2000,
            "minimunQuantityOnStock": 1000,
            "description": "",
        },
        {
            "quantity": 2442,
            "minimunQuantityOnStock": 1000,
            "active": true,
            "name": "C AQUA X 100".toUpperCase(),
            "description": "",
        },
        {
            "quantity": 3530,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "active": true,
            "name": "NUTRI U10 X 60".toUpperCase(),
        },
        {
            "active": true,
            "quantity": 200,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "name": "TAPAS GRIS".toUpperCase(),
        },
        {
            "active": true,
            "description": "",
            "quantity": 8,
            "minimunQuantityOnStock": 1000,
            "name": "DISPROFARMA TESTERS - SCP".toUpperCase(),
        },
        {
            "quantity": 0,
            "active": true,
            "description": "",
            "minimunQuantityOnStock": 0,
            "name": "DISPROFARMA PRODUCTO ROTO HYDRA 50".toUpperCase(),
        },
        {
            "description": "-",
            "name": "Botella S/Impresión heaven 75".toUpperCase(),
            "minimunQuantityOnStock": "1000",
            "quantity": 85380,
            "active": true,
        },
        {
            "minimunQuantityOnStock": 0,
            "description": "",
            "active": true,
            "name": "BOLSAS PLASTICAS".toUpperCase(),
            "quantity": 0,
        },
        {
            "active": true,
            "minimunQuantityOnStock": 1000,
            "name": "STEM TENSE".toUpperCase(),
            "description": "",
            "quantity": 3358,
        },
        {
            "minimunQuantityOnStock": 1000,
            "quantity": 3167,
            "active": true,
            "description": "",
            "name": "ESTUCHE - FILLER B3+B5+AH".toUpperCase(),
        },
        {
            "active": true,
            "quantity": 17,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "name": "DISPROFARMA TESTERS - SG".toUpperCase(),
        },
        {
            "active": true,
            "quantity": 0,
            "description": "-",
            "name": "Folleto - Fotoprotección".toUpperCase(),
            "minimunQuantityOnStock": "0",
        },
        {
            "minimunQuantityOnStock": "1000",
            "quantity": 14331,
            "name": "Valvulas envase 30ml".toUpperCase(),
            "description": "-",
            "active": true,
        },
        {
            "quantity": 0,
            "name": "DISPROFARMA PRODUCTO ROTO FRESH 150".toUpperCase(),
            "description": "",
            "active": true,
            "minimunQuantityOnStock": 0,
        },
        {
            "quantity": 4956,
            "name": "Pomo C/Impresión BB Claro".toUpperCase(),
            "minimunQuantityOnStock": "1000",
            "description": "-",
            "active": true,
        },
        {
            "name": "MUESTRA MICLEAR AQUA".toUpperCase(),
            "quantity": 4660,
            "description": "",
            "active": true,
            "minimunQuantityOnStock": 1000,
        },
        {
            "minimunQuantityOnStock": 1000,
            "description": "",
            "active": true,
            "name": "DISPROFARMA PRODUCTO ROTO FRESH 75".toUpperCase(),
            "quantity": 0,
        },
        {
            "name": "Gotero Serum".toUpperCase(),
            "active": true,
            "quantity": 21724,
            "minimunQuantityOnStock": "1000",
            "description": "-",
        },
        {
            "quantity": 1537,
            "active": true,
            "name": "Pomo C/Impresión Clarifier".toUpperCase(),
            "description": "-",
            "minimunQuantityOnStock": "1000",
        },
        {
            "quantity": 0,
            "active": true,
            "name": "DISPROFARMA PRODUCTO ROTO STEM GRAPE".toUpperCase(),
            "description": "",
            "minimunQuantityOnStock": 0,
        },
        {
            "description": "",
            "active": true,
            "quantity": 517,
            "minimunQuantityOnStock": 1000,
            "name": "MUESTRA BB CLARO".toUpperCase(),
        },
        {
            "quantity": 629,
            "active": true,
            "name": "EQUILIBRIUM".toUpperCase(),
            "description": "",
            "minimunQuantityOnStock": 1000,
        },
        {
            "minimunQuantityOnStock": 1000,
            "name": "MUESTRA RENOVATION".toUpperCase(),
            "description": "",
            "active": true,
            "quantity": 1953,
        },
        {
            "quantity": 3095,
            "active": true,
            "name": "CLARIFIER".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "description": "",
        },
        {
            "minimunQuantityOnStock": 1000,
            "name": "ESTUCHE - NUTRI U10 X 400".toUpperCase(),
            "description": "",
            "quantity": 2478,
            "active": true,
        },
        {
            "minimunQuantityOnStock": 1000,
            "quantity": 15006,
            "description": "",
            "name": "MUESTRAS EYES".toUpperCase(),
            "active": true,
        },
        {
            "minimunQuantityOnStock": 1000,
            "quantity": 187,
            "description": "",
            "name": "C MILK 150".toUpperCase(),
            "active": true,
        },
        {
            "description": "",
            "quantity": 1123,
            "active": true,
            "minimunQuantityOnStock": 1000,
            "name": "ESTUCHE - BY BLOCK OSCURO X 60".toUpperCase(),
        },
        {
            "minimunQuantityOnStock": 1000,
            "name": "MUESTRA CAPILAR FORTE".toUpperCase(),
            "quantity": 2919,
            "active": true,
            "description": "",
        },
        {
            "name": "Envase Nutri Skin Facial".toUpperCase(),
            "minimunQuantityOnStock": "1000",
            "quantity": 1011,
            "active": true,
            "description": "-",
        },
        {
            "minimunQuantityOnStock": 0,
            "active": true,
            "name": "DISPROFARMA PRODUCTO ROTO CAPILAR FORTE X 10".toUpperCase(),
            "description": "",
            "quantity": 0,
        },
        {
            "description": "",
            "minimunQuantityOnStock": 1000,
            "name": "ESPONJAS".toUpperCase(),
            "quantity": 362,
            "active": true,
        },
        {
            "active": true,
            "minimunQuantityOnStock": 1000,
            "name": "TAPAS NARANJAS".toUpperCase(),
            "quantity": 1431,
            "description": "",
        },
        {
            "description": "-",
            "quantity": 0,
            "active": true,
            "minimunQuantityOnStock": "1000",
            "name": "Pomo S/Impresión".toUpperCase(),
        },
        {
            "description": "",
            "name": "LAPICERA - renovation 8".toUpperCase(),
            "quantity": 77,
            "active": true,
            "minimunQuantityOnStock": 1000,
        },

        {
            "name": "Valvula Cremeras".toUpperCase(),
            "minimunQuantityOnStock": "1000",
            "description": "-",
            "active": true,
            "quantity": 18044,
        },
        {
            "description": "",
            "active": true,
            "quantity": 0,
            "name": "DISPROFARMA PRODUCTO ROTO BY BLOCK CLARO".toUpperCase(),
            "minimunQuantityOnStock": 0,
        },
        {
            "description": "",
            "active": true,
            "quantity": 999,
            "name": "lapiceras serum".toUpperCase(),
            "minimunQuantityOnStock": 0,
        },
        {
            "description": "",
            "active": true,
            "quantity": 999,
            "name": "lapiceras fluid".toUpperCase(),
            "minimunQuantityOnStock": 0,
        },
        {
            "description": "",
            "active": true,
            "quantity": 10200,
            "name": "pomos sin impresión en blanco 60mg para by block".toUpperCase(),
            "minimunQuantityOnStock": 0,
        },
        {
            "description": "",
            "active": true,
            "quantity": 5264,
            "name": "pomos sin impresión en blanco 60mg para hy/nf/Crumb".toUpperCase(),
            "minimunQuantityOnStock": 0,
        },
        {
            "description": "",
            "active": true,
            "quantity": 0,
            "name": "DISPROFARMA PRODUCTO ROTO BY BLOCK CLARO".toUpperCase(),
            "minimunQuantityOnStock": 0,
        },
        {
            "description": "-",
            "quantity": 3117,
            "minimunQuantityOnStock": "1000",
            "name": "Botella Urea 250".toUpperCase(),
            "active": true,
        },
        {
            "name": "MUESTRA BB OSCURO".toUpperCase(),
            "quantity": 0,
            "active": true,
            "minimunQuantityOnStock": 0,
            "description": "",
        },
        {
            "quantity": 0,
            "minimunQuantityOnStock": 0,
            "description": "",
            "name": "DISPROFARMA PRODUCTO ROTO RENOVATION 5".toUpperCase(),
            "active": true,
        },
        {
            "description": "",
            "name": "FILM PARA EMBALAR".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "active": true,
            "quantity": 3,
        },
        {
            "quantity": 70,
            "minimunQuantityOnStock": 1000,
            "name": "NECESER".toUpperCase(),
            "description": "",
            "active": true,
        },
        {
            "quantity": 3361,
            "description": "",
            "minimunQuantityOnStock": 1000,
            "active": true,
            "name": "BBFLUIDMEDIOX75".toUpperCase(),
        },
        {
            "minimunQuantityOnStock": 1000,
            "active": true,
            "description": "",
            "quantity": 1474,
            "name": "ESTUCHE - STEM GRAPE".toUpperCase(),
        },
        {
            "name": "DISPROFARMA TESTERS - CAPILAR FORTX X 10".toUpperCase(),
            "description": "",
            "minimunQuantityOnStock": 0,
            "quantity": 0,
            "active": true,
        },
        {
            "description": "",
            "name": "LAPICERA - stem cells plus".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "quantity": 155,
            "active": true,
        },
        {
            "minimunQuantityOnStock": "0",
            "name": "Folleto - Kolageno".toUpperCase(),
            "quantity": 0,
            "description": "-",
            "active": true,
        },
        {
            "minimunQuantityOnStock": 1000,
            "name": "DISPROFARMA TESTERS - CELULITIS".toUpperCase(),
            "active": true,
            "description": "",
            "quantity": 21,
        },
        {
            "description": "",
            "active": true,
            "quantity": 0,
            "minimunQuantityOnStock": 0,
            "name": "MUESTRA REPAIR".toUpperCase(),
        },
        {
            "name": "DISPROFARMA PRODUCTO ROTO CLEANSER GEL 150".toUpperCase(),
            "minimunQuantityOnStock": 0,
            "description": "",
            "active": true,
            "quantity": 0,
        },
        {
            "name": "Folleto - Capilar Forte".toUpperCase(),
            "description": "-",
            "quantity": 0,
            "active": true,
            "minimunQuantityOnStock": "0",
        },
        {
            "active": true,
            "quantity": 0,
            "description": "",
            "minimunQuantityOnStock": 0,
            "name": "DISPROFARMA PRODUCTO ROTO BY BLOCK FLUID CLARO".toUpperCase(),
        },
        {
            "minimunQuantityOnStock": 1000,
            "name": "C GEL X 100".toUpperCase(),
            "active": true,
            "description": "",
            "quantity": 2,
        },
        {
            "description": "-",
            "active": true,
            "name": "Botella BB Fluid Medio".toUpperCase(),
            "minimunQuantityOnStock": "1000",
            "quantity": 35,
        },
        {
            "name": "EXIBIDORES KOLLAGEN".toUpperCase(),
            "description": "",
            "active": true,
            "minimunQuantityOnStock": 1000,
            "quantity": 6,
        },
        {
            "active": true,
            "minimunQuantityOnStock": 0,
            "description": "",
            "name": "VASOS GRIS".toUpperCase(),
            "quantity": 0,
        },
        {
            "description": "",
            "active": true,
            "minimunQuantityOnStock": 1000,
            "quantity": 3869,
            "name": "ESTUCHE - EQUILIBRIUM".toUpperCase(),
        },
        {
            "quantity": 3957,
            "minimunQuantityOnStock": "1000",
            "description": "-",
            "active": true,
            "name": "Botella Cleanser Milk 150".toUpperCase(),
        },
        {
            "description": "",
            "active": true,
            "quantity": 1885,
            "name": "REPAIR SKIN".toUpperCase(),
            "minimunQuantityOnStock": 1000,
        },
        {
            "quantity": 0,
            "name": "Envase S/Impresión Para HY-NF-RP-RS".toUpperCase(),
            "description": "-",
            "active": true,
            "minimunQuantityOnStock": "1000",
        },
        {
            "name": "A CELLULITE X 200".toUpperCase(),
            "quantity": 2024,
            "active": true,
            "description": "",
            "minimunQuantityOnStock": 1000,
        },
        {
            "minimunQuantityOnStock": 1000,
            "active": true,
            "name": "LAPICERAS - FRESH SKIN ROXA".toUpperCase(),
            "description": "",
            "quantity": 148,
        },
        {
            "minimunQuantityOnStock": 1000,
            "quantity": 69,
            "active": true,
            "name": "C+H FACIAL".toUpperCase(),
            "description": "",
        },
        {
            "description": "",
            "active": true,
            "minimunQuantityOnStock": 1000,
            "name": "MUESTRA EQUILIBRIUM".toUpperCase(),
            "quantity": 683,
        },
        {
            "name": "BOLSAS CARTON BLANCAS".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "active": true,
            "description": "",
            "quantity": 438,
        },
        {
            "active": true,
            "name": "KOLLAGEN X 250".toUpperCase(),
            "description": "",
            "minimunQuantityOnStock": 1000,
            "quantity": 1236,
        },
        {
            "quantity": 2795,
            "description": "",
            "minimunQuantityOnStock": 1000,
            "active": true,
            "name": "NUTRI X 200".toUpperCase(),
        },
        {
            "name": "BB FLUID BLANCO X75".toUpperCase(),
            "quantity": 1035,
            "active": true,
            "description": "",
            "minimunQuantityOnStock": 1000,
        },
        {
            "description": "",
            "name": "DISPROFARMA TESTERS - CLM 150".toUpperCase(),
            "active": true,
            "minimunQuantityOnStock": 1000,
            "quantity": 11,
        },
        {
            "active": true,
            "name": "ESTUCHE - BB FLUID CLARO X 75GR".toUpperCase(),
            "quantity": 10529,
            "minimunQuantityOnStock": 1000,
            "description": "",
        },
        {
            "active": true,
            "name": "ESTUCHE - BB FLUID BLANCO".toUpperCase(),
            "quantity": 14285,
            "minimunQuantityOnStock": 1000,
            "description": "",
        },
        {
            "name": "Envase Eyes 15".toUpperCase(),
            "active": true,
            "quantity": 6186,
            "minimunQuantityOnStock": "1000",
            "description": "-",
        },
        {
            "description": "",
            "minimunQuantityOnStock": 0,
            "name": "DISPROFARMA PRODUCTO ROTO REPAIR".toUpperCase(),
            "quantity": 0,
            "active": true,
        },
        {
            "minimunQuantityOnStock": 1000,
            "quantity": 908,
            "active": true,
            "description": "",
            "name": "FRANJAS NEGRAS".toUpperCase(),
        },
        {
            "name": "Capuchon / Tapa envase 30ml".toUpperCase(),
            "quantity": 18281,
            "active": true,
            "minimunQuantityOnStock": "1000",
            "description": "-",
        },
        {
            "description": "",
            "minimunQuantityOnStock": 0,
            "active": true,
            "quantity": 0,
            "name": "DISPROFARMA PRODUCTO ROTO NUTRI CORPORAL 200".toUpperCase(),
        },
        {
            "active": true,
            "description": "",
            "minimunQuantityOnStock": 0,
            "quantity": 0,
            "name": "DISPROFARMA PRODUCTO ROTO NUTRI FACIAL 100".toUpperCase(),
        },
        {
            "active": true,
            "quantity": 1,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "name": "DISPROFARMA TESTERS - BB FLUID BLANCO".toUpperCase(),
        },
        {
            "quantity": 3321,
            "description": "",
            "name": "ESTUCHE - NUTRI U10 X 250".toUpperCase(),
            "active": true,
            "minimunQuantityOnStock": 1000,
        },
        {
            "minimunQuantityOnStock": 1000,
            "description": "",
            "name": "LAPICERAS - CLARIFIER".toUpperCase(),
            "active": true,
            "quantity": 3,
        },
        {
            "description": "",
            "quantity": 7,
            "name": "DISPROFARMA TESTERS - NUTRI FACIAL 60".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "active": true,
        },
        {
            "description": "-",
            "active": true,
            "minimunQuantityOnStock": "1000",
            "quantity": 5000,
            "name": "Rollo Etiqueta BB fluid Blanco".toUpperCase(),
        },
        {
            "quantity": 0,
            "minimunQuantityOnStock": "1000",
            "description": "-",
            "name": "Folleto - Tratamientos Corporales".toUpperCase(),
            "active": true,
        },
        {
            "quantity": 2843,
            "minimunQuantityOnStock": 1000,
            "active": true,
            "name": "MUESTRA CLARIFIER".toUpperCase(),
            "description": "",
        },
        {
            "active": true,
            "description": "",
            "minimunQuantityOnStock": 0,
            "name": "DISPROFARMA TESTERS - RS10".toUpperCase(),
            "quantity": 1,
        },
        {
            "description": "",
            "name": "NUTRI X 50".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "quantity": 1294,
            "active": true,
        },
        {
            "description": "",
            "active": true,
            "name": "NUTRI X 60".toUpperCase(),
            "quantity": 2,
            "minimunQuantityOnStock": 0,
        },
        {
            "minimunQuantityOnStock": 0,
            "quantity": 0,
            "name": "DISPROFARMA PRODUCTO ROTO CLEANSER MILK 100".toUpperCase(),
            "active": true,
            "description": "",
        },
        {
            "quantity": 5139,
            "description": "",
            "active": true,
            "name": "RECETARIOS FARMACIAS ADHERIDAS CON QR".toUpperCase(),
            "minimunQuantityOnStock": 1000,
        },
        {
            "active": true,
            "minimunQuantityOnStock": "1000",
            "name": "Valvulas envase 15ml".toUpperCase(),
            "description": "-",
            "quantity": 14302,
        },
        {
            "quantity": 28,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "name": "DISPROFARMA TESTERS - EY15".toUpperCase(),
            "active": true,
        },
        {
            "name": "HYDRA X 60".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "description": "",
            "active": true,
            "quantity": 2479,
        },
        {
            "active": true,
            "minimunQuantityOnStock": "1000",
            "quantity": 1054,
            "description": "-",
            "name": "Valvula Stem Cells Plus".toUpperCase(),
        },
        {
            "description": "-",
            "quantity": 10000,
            "name": "Etiqueta Cleanser Aqua Micelar 250".toUpperCase(),
            "minimunQuantityOnStock": "1000",
            "active": true,
        },
        {
            "active": true,
            "quantity": 3055,
            "description": "-",
            "name": "Tapa DISK Top".toUpperCase(),
            "minimunQuantityOnStock": "1000",
        },
        {
            "minimunQuantityOnStock": "1000",
            "name": "Botella Stem Grape".toUpperCase(),
            "active": true,
            "quantity": 2551,
            "description": "-",
        },
        {
            "quantity": 0,
            "active": true,
            "name": "DISPROFARMA PRODUCTO ROTO CLEANSER MILK 150".toUpperCase(),
            "minimunQuantityOnStock": 0,
            "description": "",
        },
        {
            "quantity": 0,
            "description": "",
            "active": true,
            "name": "ESTUCHE - NUTRI X 50".toUpperCase(),
            "minimunQuantityOnStock": 1000,
        },
        {
            "quantity": 4258,
            "active": true,
            "description": "",
            "name": "ESTUCHE - CLEANSER GEL X 100".toUpperCase(),
            "minimunQuantityOnStock": 1000,
        },
        {
            "active": true,
            "description": "",
            "name": "FRANJAS GRIS".toUpperCase(),
            "quantity": 28,
            "minimunQuantityOnStock": 1000,
        },
        {
            "minimunQuantityOnStock": 1000,
            "description": "",
            "quantity": 411,
            "active": true,
            "name": "FRESH ROXA X 150".toUpperCase(),
        },
        {
            "name": "ESTUCHE - ANTI CELULITIS X 200".toUpperCase(),
            "quantity": 0,
            "active": true,
            "minimunQuantityOnStock": 0,
            "description": "",
        },
        {
            "active": true,
            "name": "Botella Fresh 150".toUpperCase(),
            "description": "-",
            "minimunQuantityOnStock": "1000",
            "quantity": 43,
        },
        {
            "description": "",
            "name": "DISPROFARMA PRODUCTO ROTO SHAMPOO OXSA".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "active": true,
            "quantity": 0,
        },
        {
            "name": "LAPICERAS - FILLER".toUpperCase(),
            "description": "",
            "active": true,
            "minimunQuantityOnStock": 1000,
            "quantity": 156,
        },
        {
            "name": "DISPROFARMA PRODUCTO ROTO ALCOHOL 100".toUpperCase(),
            "active": true,
            "description": "",
            "quantity": 0,
            "minimunQuantityOnStock": 1000,
        },
        {
            "minimunQuantityOnStock": 1000,
            "quantity": 989,
            "description": "",
            "active": true,
            "name": "ESTUCHE - RENO SKIN 10".toUpperCase(),
        },
        {
            "active": true,
            "minimunQuantityOnStock": "1000",
            "quantity": 7957,
            "description": "-",
            "name": "Botella Cleanser Gel 150".toUpperCase(),
        },
        {
            "minimunQuantityOnStock": "1000",
            "active": true,
            "quantity": 12551,
            "name": "Botella S/Impresión Para C+HF/RS10".toUpperCase(),
            "description": "-",
        },
        {
            "description": "",
            "active": true,
            "quantity": 9,
            "minimunQuantityOnStock": 1000,
            "name": "DISPROFARMA TESTERS - RS".toUpperCase(),
        },
        {
            "quantity": 7883,
            "active": true,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "name": "MUESTRA STEM CELLS PLUS".toUpperCase(),
        },
        {
            "description": "-",
            "active": true,
            "quantity": 4151,
            "minimunQuantityOnStock": "1000",
            "name": "Cunas 7x7 (Eyes/Clarifier)".toUpperCase(),
        },
        {
            "quantity": 10,
            "minimunQuantityOnStock": 0,
            "active": true,
            "name": "DISPROFARMA TESTERS - HY POMO".toUpperCase(),
            "description": "",
        },
        {
            "quantity": 0,
            "active": true,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "name": "ESTUCHE - EYES X 15".toUpperCase(),
        },
        {
            "name": "Botella S/Impresión Omega 250".toUpperCase(),
            "description": "-",
            "minimunQuantityOnStock": "1000",
            "active": true,
            "quantity": 14137,
        },
        {
            "quantity": 33000,
            "minimunQuantityOnStock": "1000",
            "active": true,
            "name": "Valvula Fresh 150".toUpperCase(),
            "description": "-",
        },
        {
            "name": "DISPROFARMA TESTERS - BB FLUID CLARO".toUpperCase(),
            "minimunQuantityOnStock": 0,
            "active": true,
            "quantity": 0,
            "description": "",
        },
        {
            "description": "-",
            "minimunQuantityOnStock": "1000",
            "name": "Botella OXSA".toUpperCase(),
            "active": true,
            "quantity": 0,
        },
        {
            "quantity": 1030,
            "name": "FRANJAS NARANJAS".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "description": "",
            "active": true,
        },
        {
            "active": true,
            "description": "",
            "quantity": 0,
            "name": "DISPROFARMA TESTERS - UREA 400".toUpperCase(),
            "minimunQuantityOnStock": 1000,
        },
        {
            "quantity": 13,
            "active": true,
            "description": "",
            "name": "DISPROFARMA TESTERS - CLG 100".toUpperCase(),
            "minimunQuantityOnStock": 1000,
        },
        {
            "description": "",
            "active": true,
            "minimunQuantityOnStock": 0,
            "name": "DISPROFARMA PRODUCTO ROTO HYDRA 60".toUpperCase(),
            "quantity": 0,
        },
        {
            "name": "MUESTRA STEM GRAPE".toUpperCase(),
            "quantity": 9565,
            "active": true,
            "description": "",
            "minimunQuantityOnStock": 1000,
        },
        {
            "name": "ESTUCHE - CAPILAR VT X 250".toUpperCase(),
            "description": "",
            "active": true,
            "minimunQuantityOnStock": 1000,
            "quantity": 2325,
        },
        {
            "name": "LAPICERAS DE MESA".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "quantity": 396,
            "description": "",
            "active": true,
        },
        {
            "description": "",
            "minimunQuantityOnStock": 1000,
            "name": "CIRCULOS 20% OFF".toUpperCase(),
            "quantity": 0,
            "active": true,
        },
        {
            "active": true,
            "minimunQuantityOnStock": 1000,
            "quantity": 0,
            "description": "",
            "name": "ESTUCHE - REPAIR SKIN".toUpperCase(),
        },
        {
            "name": "ESTUCHE - RENO SKIN 8".toUpperCase(),
            "description": "",
            "active": true,
            "minimunQuantityOnStock": 1000,
            "quantity": 2176,
        },
        {
            "active": true,
            "minimunQuantityOnStock": 0,
            "name": "DISPROFARMA PRODUCTO ROTO C+HF".toUpperCase(),
            "quantity": 1,
            "description": "",
        },
        {
            "active": true,
            "minimunQuantityOnStock": 0,
            "name": "DISPROFARMA TESTERS - CAPILAR FORTE X 10".toUpperCase(),
            "quantity": 0,
            "description": "",
        },
        {
            "active": true,
            "minimunQuantityOnStock": 0,
            "name": "DISPROFARMA TESTERS - CAPILAR FORTE X 30".toUpperCase(),
            "quantity": 0,
            "description": "",
        },
        {
            "active": true,
            "minimunQuantityOnStock": 0,
            "name": "DISPROFARMA TESTERS - CAPILAR FORTE X 60".toUpperCase(),
            "quantity": 0,
            "description": "",
        },
        {
            "minimunQuantityOnStock": 1000,
            "description": "",
            "active": true,
            "name": "DISPROFARMA TESTER - CHF".toUpperCase(),
            "quantity": 13,
        },
        {
            "active": true,
            "quantity": 2002,
            "description": "-",
            "name": "Envase Repair".toUpperCase(),
            "minimunQuantityOnStock": "1000",
        },
        {
            "minimunQuantityOnStock": "1000",
            "name": "Valvula Fluid 75 Premium 20410 Sin Cortar".toUpperCase(),
            "active": true,
            "description": "-",
            "quantity": 0,
        },
        {
            "active": true,
            "minimunQuantityOnStock": "0",
            "name": "Folleto - Linea Stem".toUpperCase(),
            "quantity": 0,
            "description": "-",
        },
        {
            "description": "-",
            "active": true,
            "quantity": 5501,
            "name": "Botella S/Impresión para S.Tense/Eyes15".toUpperCase(),
            "minimunQuantityOnStock": "1000",
        },
        {
            "active": true,
            "description": "",
            "minimunQuantityOnStock": 1000,
            "name": "EYES X 30".toUpperCase(),
            "quantity": 1947,
        },
        {
            "description": "",
            "name": "ESTUCHE - STEM TENSE".toUpperCase(),
            "active": true,
            "minimunQuantityOnStock": 1000,
            "quantity": 3946,
        },
        {
            "description": "",
            "active": true,
            "minimunQuantityOnStock": 1000,
            "name": "DISPROFARMA PRODUCTO ROTO SHAMPOO VT".toUpperCase(),
            "quantity": 0,
        },
        {
            "name": "DISPROFARMA TESTERS - NUTRI FACIAL 50".toUpperCase(),
            "quantity": 7,
            "active": true,
            "minimunQuantityOnStock": 1000,
            "description": "",
        },
        {
            "name": "PARLANTES".toUpperCase(),
            "quantity": 9,
            "minimunQuantityOnStock": 1000,
            "active": true,
            "description": "",
        },
        {
            "quantity": 19,
            "minimunQuantityOnStock": 1000,
            "name": "DISPROFARMA TESTERS - BB CLARO".toUpperCase(),
            "description": "",
            "active": true,
        },
        {
            "quantity": 1680,
            "description": "",
            "name": "ESTUCHE - STEM CELLS PLUS".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "active": true,
        },
        {
            "active": true,
            "minimunQuantityOnStock": 1000,
            "name": "STEM GRAPE".toUpperCase(),
            "description": "",
            "quantity": 3411,
        },
        {
            "quantity": 0,
            "name": "DISPROFARMA PRODUCTO ROTO BY BLOCK FLUID BLANCO".toUpperCase(),
            "description": "",
            "active": true,
            "minimunQuantityOnStock": 0,
        },
        {
            "name": "CAPILAR FORTE X 60".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "description": "",
            "quantity": 422,
            "active": true,
        },
        {
            "quantity": 0,
            "name": "DISPROFARMA TESTERS - KOLLAGEN 250".toUpperCase(),
            "active": true,
            "minimunQuantityOnStock": 0,
            "description": "",
        },
        {
            "quantity": 8750,
            "minimunQuantityOnStock": "1000",
            "description": "-",
            "active": true,
            "name": "Rollo Etiqueta OXSA".toUpperCase(),
        },
        {
            "description": "",
            "minimunQuantityOnStock": 1000,
            "name": "DISPROFARMA TESTERS - UREA 250".toUpperCase(),
            "active": true,
            "quantity": 21,
        },
        {
            "active": true,
            "description": "",
            "name": "BB BLANCO X 60".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "quantity": 2129,
        },
        {
            "description": "-",
            "name": "Botella Celulitis".toUpperCase(),
            "minimunQuantityOnStock": "1000",
            "active": true,
            "quantity": 0,
        },
        {
            "description": "-",
            "name": "A. Celulite x 200".toUpperCase(),
            "minimunQuantityOnStock": "1000",
            "active": true,
            "quantity": 1910,
        },
        {
            "quantity": 19833,
            "minimunQuantityOnStock": 1000,
            "name": "MUESTRA RENOVATION 10".toUpperCase(),
            "active": true,
            "description": "",
        },
        {
            "description": "",
            "active": true,
            "minimunQuantityOnStock": 1000,
            "name": "RELOJ DE MESA".toUpperCase(),
            "quantity": 43,
        },
        {
            "description": "",
            "active": true,
            "name": "STEM CELLS PLUS".toUpperCase(),
            "quantity": 3440,
            "minimunQuantityOnStock": 1000,
        },
        {
            "description": "",
            "active": true,
            "quantity": 0,
            "name": "DISPROFARMA PRODUCTO ROTO RENOVATION10".toUpperCase(),
            "minimunQuantityOnStock": 0,
        },
        {
            "description": "",
            "quantity": 0,
            "active": true,
            "minimunQuantityOnStock": 0,
            "name": "DISPROFARMA PRODUCTO ROTO BY BLOCK BLANCO".toUpperCase(),
        },
        {
            "description": "-",
            "active": true,
            "quantity": 23500,
            "minimunQuantityOnStock": "1000",
            "name": "Valvula Fresh 75".toUpperCase(),
        },
        {
            "active": true,
            "name": "CENEFAS CORTAS".toUpperCase(),
            "description": "",
            "quantity": 30,
            "minimunQuantityOnStock": 1000,
        },
        {
            "active": true,
            "minimunQuantityOnStock": "1000",
            "name": "Pomo C/Impresión Cleanser gel".toUpperCase(),
            "quantity": 0,
            "description": "-",
        },
        {
            "quantity": 2742,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "name": "CAPILAR VT X 250".toUpperCase(),
            "active": true,
        },
        {
            "description": "",
            "name": "DISPROFARMA TESTERS - RP".toUpperCase(),
            "active": true,
            "minimunQuantityOnStock": 1000,
            "quantity": 29,
        },
        {
            "quantity": 16,
            "active": true,
            "name": "DISPROFARMA TESTERS - NUTRI CORPORAL 200".toUpperCase(),
            "description": "",
            "minimunQuantityOnStock": 1000,
        },
        {
            "quantity": 1275,
            "name": "RENO SKIN 5".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "active": true,
            "description": "",
        },
        {
            "quantity": 0,
            "active": true,
            "name": "DISPROFARMA TESTERS - BB FLUID MEDIO".toUpperCase(),
            "description": "",
            "minimunQuantityOnStock": 0,
        },
        {
            "name": "DISPROFARMA PRODUCTO ROTO CAPILAR FORTE X 60".toUpperCase(),
            "quantity": 0,
            "active": true,
            "description": "",
            "minimunQuantityOnStock": 0,
        },
        {
            "active": true,
            "description": "",
            "quantity": 0,
            "minimunQuantityOnStock": 0,
            "name": "DISPROFARMA PRODUCTO ROTO BY BLOCK FLUID MEDIO".toUpperCase(),
        },
        {
            "name": "Valvulas Para los Fluid".toUpperCase(),
            "active": true,
            "quantity": 48188,
            "minimunQuantityOnStock": "1000",
            "description": "-",
        },
        {
            "minimunQuantityOnStock": "1000",
            "name": "Envase Hydra".toUpperCase(),
            "description": "-",
            "quantity": 2002,
            "active": true,
        },
        {
            "name": "CAPILARFORTEX30".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "quantity": 357,
            "description": "",
            "active": true,
        },
        {
            "minimunQuantityOnStock": "1000",
            "description": "-",
            "active": true,
            "name": "Pomo C/Impresión Hydra".toUpperCase(),
            "quantity": 2745,
        },
        {
            "minimunQuantityOnStock": "0",
            "active": true,
            "quantity": 0,
            "description": "-",
            "name": "Folleto - Familia Cleanser".toUpperCase(),
        },
        {
            "active": true,
            "quantity": 15,
            "minimunQuantityOnStock": 1000,
            "name": "PEINES".toUpperCase(),
            "description": "",
        },
        {
            "name": "Envase Stem tense".toUpperCase(),
            "active": true,
            "quantity": 2016,
            "minimunQuantityOnStock": "1000",
            "description": "-",
        },
        {
            "active": true,
            "name": "Botella Micelar Aqua 250".toUpperCase(),
            "minimunQuantityOnStock": "1000",
            "quantity": 0,
            "description": "-",
        },
        {
            "minimunQuantityOnStock": 1000,
            "name": "pancartas".toUpperCase(),
            "description": "",
            "quantity": 1,
            "active": true,
        },
        {
            "name": "Pomo C/Impresión Eyes 30".toUpperCase(),
            "description": "-",
            "quantity": 0,
            "minimunQuantityOnStock": "1000",
            "active": true,
        },
        {
            "name": "EYES X 15".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "quantity": 1419,
            "active": true,
            "description": "",
        },
        {
            "active": true,
            "minimunQuantityOnStock": 1000,
            "name": "RECETARIO CÓRDOBA".toUpperCase(),
            "quantity": 609,
            "description": "",
        },
        {
            "minimunQuantityOnStock": 1000,
            "description": "",
            "active": true,
            "name": "CUNAS 12X12 (SERUM)".toUpperCase(),
            "quantity": 2600,
        },
        {
            "description": "",
            "quantity": 0,
            "active": true,
            "minimunQuantityOnStock": 1000,
            "name": "BLISTERS CAPILAR FORTE 10 COMPRIMIDOS".toUpperCase(),
        },
        {
            "active": true,
            "description": "",
            "quantity": 2087,
            "minimunQuantityOnStock": 1000,
            "name": "BOLSAS CARTON - KOLLAGENO".toUpperCase(),
        },
        {
            "quantity": 1270,
            "name": "BOLSAS CARTON SERUM8BB".toUpperCase(),
            "description": "",
            "active": true,
            "minimunQuantityOnStock": 1000,
        },
        {
            "minimunQuantityOnStock": 1000,
            "name": "ESTUCHE - NUTRI X 60".toUpperCase(),
            "quantity": 0,
            "description": "",
            "active": true,
        },
        {
            "active": true,
            "minimunQuantityOnStock": 1000,
            "quantity": 1646,
            "name": "MUESTRA FRESH CON APLICADOR".toUpperCase(),
            "description": "",
        },
        {
            "description": "",
            "quantity": 1,
            "active": true,
            "minimunQuantityOnStock": 1000,
            "name": "BANNERS CAPILAR".toUpperCase(),
        },
        {
            "name": "CAPILAR FORTE X 10".toUpperCase(),
            "quantity": 0,
            "description": "",
            "active": true,
            "minimunQuantityOnStock": 0,
        },
        {
            "active": true,
            "description": "",
            "minimunQuantityOnStock": 1000,
            "quantity": 19771,
            "name": "MUESTRA OXSA".toUpperCase(),
        },
        {
            "description": "",
            "quantity": 15,
            "minimunQuantityOnStock": 1000,
            "active": true,
            "name": "DISPROFARMA TESTERS - ALCOHOL 100".toUpperCase(),
        },
        {
            "minimunQuantityOnStock": 1000,
            "description": "",
            "name": "PAQUETE - KOLLAGENO250".toUpperCase(),
            "quantity": 8028,
            "active": true,
        },
        {
            "minimunQuantityOnStock": 0,
            "description": "",
            "name": "RECETARIO USHUAIA".toUpperCase(),
            "quantity": 0,
            "active": true,
        },
        {
            "quantity": 0,
            "active": true,
            "minimunQuantityOnStock": "1000",
            "name": "Envase Renovation".toUpperCase(),
            "description": "-",
        },
        {
            "name": "Folleto - Higiene Básica".toUpperCase(),
            "minimunQuantityOnStock": "1000",
            "active": true,
            "quantity": 0,
            "description": "-",
        },
        {
            "quantity": 15000,
            "description": "-",
            "name": "Rollo Etiqueta BB Fluid Claro".toUpperCase(),
            "minimunQuantityOnStock": "1000",
            "active": true,
        },
        {
            "description": "",
            "active": true,
            "quantity": 1377,
            "minimunQuantityOnStock": 1000,
            "name": "ESTUCHE - CLEANSER GEL X 150".toUpperCase(),
        },
        {
            "quantity": 4465,
            "active": true,
            "name": "Pomo C/Impresión BB Oscuro".toUpperCase(),
            "description": "-",
            "minimunQuantityOnStock": "1000",
        },
        {
            "minimunQuantityOnStock": "1000",
            "quantity": 2519,
            "description": "-",
            "name": "Envase renovation 10".toUpperCase(),
            "active": true,
        },
        {
            "description": "",
            "name": "DISPROFARMA TESTERS - CLM 100".toUpperCase(),
            "active": true,
            "minimunQuantityOnStock": 1000,
            "quantity": 24,
        },
        {
            "active": true,
            "description": "-",
            "name": "Folleto - C + H Facial".toUpperCase(),
            "quantity": 0,
            "minimunQuantityOnStock": "1000",
        },
        {
            "description": "",
            "minimunQuantityOnStock": 1000,
            "name": "C GEL X 150".toUpperCase(),
            "active": true,
            "quantity": 1134,
        },
        {
            "name": "BB OSCURO X 60".toUpperCase(),
            "quantity": 3187,
            "active": true,
            "minimunQuantityOnStock": 1000,
            "description": "",
        },
        {
            "minimunQuantityOnStock": "1000",
            "quantity": 2600,
            "name": "Rollo Etiqueta Renovation 8".toUpperCase(),
            "active": true,
            "description": "-",
        },
        {
            "quantity": 20,
            "active": true,
            "description": "",
            "minimunQuantityOnStock": 1000,
            "name": "RECETARIO PATAGÓNICO".toUpperCase(),
        },
        {
            "minimunQuantityOnStock": 1000,
            "name": "CENEFAS".toUpperCase(),
            "description": "",
            "active": true,
            "quantity": 0,
        },
        {
            "minimunQuantityOnStock": 0,
            "active": true,
            "description": "",
            "quantity": 0,
            "name": "DISPROFARMA PRODUCTO ROTO RENOVATION 8".toUpperCase(),
        },
        {
            "name": "FILLER B3+B5+AH".toUpperCase(),
            "description": "",
            "minimunQuantityOnStock": 1000,
            "quantity": 635,
            "active": true,
        },
        {
            "minimunQuantityOnStock": 1000,
            "quantity": 12,
            "description": "",
            "active": true,
            "name": "CINTA SCOTCH".toUpperCase(),
        },
        {
            "quantity": 351,
            "active": true,
            "description": "",
            "name": "ESTUCHE - EYES X 30".toUpperCase(),
            "minimunQuantityOnStock": 1000,
        },
        {
            "quantity": 2708,
            "active": true,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "name": "C MILK X 100".toUpperCase(),
        },
        {
            "minimunQuantityOnStock": "1000",
            "active": true,
            "description": "-",
            "quantity": 254,
            "name": "Botella BB FLUID Claro".toUpperCase(),
        },
        {
            "quantity": 0,
            "active": true,
            "description": "",
            "minimunQuantityOnStock": 0,
            "name": "CARTEL HORA".toUpperCase(),
        },
        {
            "quantity": 0,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "active": true,
            "name": "GANCHOS PARA CIRCULOS 20% OFF".toUpperCase(),
        },
        {
            "name": "ESTUCHE - HYDRA X 50".toUpperCase(),
            "description": "",
            "active": true,
            "quantity": 0,
            "minimunQuantityOnStock": 1000,
        },
        {
            "minimunQuantityOnStock": 1000,
            "name": "ESTUCHE - BB FLUID MEDIO X 75 GR".toUpperCase(),
            "quantity": 26927,
            "description": "",
            "active": true,
        },
        {
            "active": true,
            "quantity": 7965,
            "name": "BOLSAS ECOLOGICAS".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "description": "",
        },
        {
            "quantity": 744,
            "minimunQuantityOnStock": 1000,
            "name": "ESTUCHE - BY BLOCK CLARO X 60".toUpperCase(),
            "active": true,
            "description": "",
        },
        {
            "minimunQuantityOnStock": 1000,
            "description": "",
            "name": "DISPROFARMA TESTERS - STENSE".toUpperCase(),
            "quantity": 28,
            "active": true,
        },
        {
            "minimunQuantityOnStock": "1000",
            "name": "Pomo c/Impresión BB Blanco".toUpperCase(),
            "active": true,
            "quantity": 4984,
            "description": "-",
        },
        {
            "active": true,
            "quantity": 2490,
            "description": "-",
            "minimunQuantityOnStock": "1000",
            "name": "Pomo C/Impresión Nutri Skin Facial".toUpperCase(),
        },
        {
            "description": "-",
            "name": "Cunas 11ymedio x 11ymedio (RP/RS/NF/HY)".toUpperCase(),
            "active": true,
            "minimunQuantityOnStock": "1000",
            "quantity": 789,
        },
        {
            "quantity": 2205,
            "active": true,
            "minimunQuantityOnStock": 0,
            "description": "",
            "name": "VASOS BLANCOS".toUpperCase(),
        },
        {
            "name": "PAQUETE - KOLLAGENO50".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "quantity": 19550,
            "description": "",
            "active": true,
        },
        {
            "quantity": 9486,
            "active": true,
            "name": "MUESTRA C + H".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "description": "",
        },
        {
            "minimunQuantityOnStock": 1000,
            "quantity": 12,
            "name": "DISPROFARMA TESTERS - RENOVATION 8".toUpperCase(),
            "description": "",
            "active": true,
        },
        {
            "active": true,
            "name": "ESTUCHE - CLEANSER AQUA X 250".toUpperCase(),
            "description": "",
            "minimunQuantityOnStock": 1000,
            "quantity": 1481,
        },
        {
            "quantity": 1,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "active": true,
            "name": "BASE MOSTRADOR UREA 250".toUpperCase(),
        },
        {
            "minimunQuantityOnStock": 1000,
            "name": "BANNERS FLUID".toUpperCase(),
            "quantity": 3,
            "active": true,
            "description": "",
        },
        {
            "name": "NUTRI U10 X 400".toUpperCase(),
            "active": true,
            "description": "",
            "minimunQuantityOnStock": 1000,
            "quantity": 3078,
        },
        {
            "name": "NUTRI U10 X 250".toUpperCase(),
            "active": true,
            "description": "",
            "minimunQuantityOnStock": 1000,
            "quantity": 3325,
        },
        {
            "quantity": 750,
            "minimunQuantityOnStock": 1000,
            "description": "",
            "name": "ESTUCHE - CAPILAR FORTE X 10".toUpperCase(),
            "active": true,
        },
        {
            "name": "ESTUCHE - NUTRI x 200".toUpperCase(),
            "description": "",
            "quantity": 0,
            "active": true,
            "minimunQuantityOnStock": 0,
        },
        {
            "name": "Pomo C/Impresión Alcohol".toUpperCase(),
            "quantity": 0,
            "active": true,
            "description": "-",
            "minimunQuantityOnStock": "1000",
        },
        {
            "quantity": 0,
            "minimunQuantityOnStock": "1000",
            "active": true,
            "name": "Botella VT".toUpperCase(),
            "description": "-",
        },
        {
            "name": "DISPROFARMA PRODUCTO ROTO CLEANSER GEL 100".toUpperCase(),
            "minimunQuantityOnStock": 0,
            "quantity": 0,
            "description": "",
            "active": true,
        },
        {
            "minimunQuantityOnStock": 0,
            "active": true,
            "quantity": 0,
            "description": "",
            "name": "DISPROFARMA PRODUCTO ROTO CELLULITIS".toUpperCase(),
        },
        {
            "active": true,
            "quantity": 0,
            "name": "DISPROFARMA PRODUCTO ROTO UREA 10 250".toUpperCase(),
            "minimunQuantityOnStock": 1000,
            "description": "",
        }
    
        
  ];

  
    Product.bulkCreate(json)
    res.send('Products added');
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}