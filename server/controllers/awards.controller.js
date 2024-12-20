import Award from "../models/awards.js";
import { Op } from 'sequelize';
import moment from 'moment';

export const newAward = async (req, res) => {
    const { apm_name, cantidad_alcanzada, objetivo, premio, fecha } = req.body;
    const newAward = await Award.create({
        apm_name,
        cantidad_alcanzada,
        objetivo,
        premio,
        fecha,
    });
    res.status(200).json(newAward);
};

export const getAwards = async (req, res) => {
    try {
      // Obtener la fecha del primer día y el último día del mes actual
      const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
      const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');
      
      // Consultar los premios filtrando por la fecha del mes actual
      const awards = await Award.findAll({
        where: {
          fecha: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      });
  
      res.status(200).json(awards);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los premios.', error });
    }
  };