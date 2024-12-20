import Xubio from "../models/xubio.js";

export const getAll = async (req, res) => {
    try {
        const xubios = await Xubio.findAll();
        res.status(200).send(xubios);
    } catch (error) {
        console.error("Error fetching records:", error);
        res.status(500).send({ error: "Error fetching records" });
    }
}

export const add = async (req, res) => {
    try {
        const { code, adresseeName, active } = req.body;
        const xubio = await Xubio.create({ code, adresseeName, active });
        res.status(201).send(xubio); // Código 201 para "Creado"
    } catch (error) {
        console.error("Error creating record:", error);
        res.status(500).send({ error: "Error creating record" });
    }
}

export const del = async (req, res) => {
    try {
        const { id } = req.params;
        const xubio = await Xubio.update({ active: false }, { where: { id } });
        
        if (xubio) {
            res.status(200).send({ message: "Record deleted successfully" });
        } else {
            res.status(404).send({ error: "Record not found" });
        }
    } catch (error) {
        console.error("Error deleting record:", error);
        res.status(500).send({ error: "Error deleting record" });
    }
}
