const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// Conexión con la base de datos
const { connection } = require("../config/config.db");

app.use(express.json());

// Servicio para obtener todos los estados
const getEstados = (request, response) => {
    connection.query("SELECT * FROM tbl_estados", (error, results) => {
        if (error) {
            console.error("Error al obtener estados:", error);
            response.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        response.status(200).json(results);
    });
};

// Servicio para agregar o editar un estado
const postEstado = (request, response) => {
    const { action, estado_id, estado_nombre } = request.body;

    if (action === "insert") {
        connection.query(
            "INSERT INTO tbl_estados (estado_nombre) VALUES (?)",
            [estado_nombre],
            (error, results) => {
                if (error) {
                    console.error("Error al agregar estado:", error);
                    response.status(500).json({ error: "Error interno del servidor" });
                    return;
                }
                response.status(201).json({ message: "Estado añadido correctamente", affectedRows: results.affectedRows });
            }
        );
    } else if (action === "update") {
        connection.query(
            "UPDATE tbl_estados SET estado_nombre=? WHERE estado_id=?",
            [estado_nombre, estado_id],
            (error, results) => {
                if (error) {
                    console.error("Error al actualizar estado:", error);
                    response.status(500).json({ error: "Error interno del servidor" });
                    return;
                }
                response.status(200).json({ message: "Estado editado correctamente", affectedRows: results.affectedRows });
            }
        );
    } else {
        response.status(400).json({ error: "Acción no válida" });
    }
};

// Servicio para eliminar un estado por su ID
const deleteEstado = (request, response) => {
    const estado_id = request.params.estado_id;
    connection.query("DELETE FROM tbl_estados WHERE estado_id=?", [estado_id], (error, results) => {
        if (error) {
            console.error("Error al eliminar estado:", error);
            response.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        response.status(200).json({ message: "Estado eliminado correctamente", affectedRows: results.affectedRows });
    });
};

// Rutas
app.get("/estados", getEstados);
app.post("/estados", postEstado);
app.delete("/estados/:estado_id", deleteEstado);

module.exports = app;
