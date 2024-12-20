import Pendingsxubio from "../models/pendingsxubio.js";

export const getAll = async (req, res) => {
    try {
        const pendingsxubio = await Pendingsxubio.findAll({ where: { active: true } });
        res.status(200).send(pendingsxubio);
    } catch (error) {
        console.error("Error fetching records:", error);
        res.status(500).send({ error: "Error fetching records" });
    }
}


export const add = async (req, res) => {
    try {
        const pendingsxubio = await Pendingsxubio.create(req.body);
        res.status(201).send(pendingsxubio);
    } catch (error) {
        console.error("Error creating record:", error);
        res.status(500).send({ error: "Error creating record" });
    }
}

export const del = async (req, res) => {
    try {
        const { id } = req.params;
        const pendingsxubio = await Pendingsxubio.update({ active: false }, { where: { remito: id } });
        if (pendingsxubio) {
            res.status(200).send({ message: "Record deleted successfully" });
        } else {
            res.status(404).send({ error: "Record not found" });
        }
    } catch (error) {
        console.error("Error deleting record:", error);
        res.status(500).send({ error: "Error deleting record" });
    }
}