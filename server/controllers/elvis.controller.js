import Elvis from "../models/elvis.js";

export const getAll = async (req, res) => {
    try {
        const elvis = await Elvis.findAll();
        res.status(200).send(elvis);
    } catch (error) {
        console.error("Error fetching records:", error);
        res.status(500).send({ error: "Error fetching records" });
    }
};


export const add = async (req, res) => {
    try {
        const records = req.body; // Asume que req.body es un array de objetos
        const createdRecords = [];

        for (const record of records) {
            // Busca el registro por el campo `codigo`
            const [elvis, created] = await Elvis.findOrCreate({
                where: { codigo: record.codigo },
                defaults: record
            });

            if (created) {
                createdRecords.push(elvis); // Solo agrega al array si fue creado
            }
        }

        res.status(201).send({
            message: "Records processed successfully",
            createdRecords
        });
    } catch (error) {
        console.error("Error creating records:", error);
        res.status(500).send({ error: "Error creating records" });
    }
};
