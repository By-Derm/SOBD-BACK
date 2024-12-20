import Zonas from "../models/zonas.js";


export const getZonas = async (req, res) => {
    try {
      const zonas = await Zonas.findAll();
      res.send(zonas);
    } catch (error) {
      console.error('Error listing zonas:', error);
      return null;
    }
}

export const updateZonas = async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;
      const updateData = {};
      updateData[data.estante] = data.nuevoNombre;

       const zonas = await Zonas.update(updateData, {
        where: { nombre_zona: id },
      });
      res.send(zonas); 
    } catch (error) {
      console.error('Error updating zonas:', error);
      return null;
    }
}