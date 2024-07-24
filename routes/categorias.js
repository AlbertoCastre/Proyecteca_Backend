const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// Conexión con la base de datos
const { connection } = require("../config/config.db");

app.use(express.json());

// Servicio para obtener todas las carreras
const getCarreras = (request, response) => {
    connection.query("SELECT * FROM tbl_carreras", (error, results) => {
        if (error) {
            console.error("Error al obtener carreras:", error);
            response.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        response.status(200).json(results);
    });
};

// Servicio para agregar o editar una carrera
const postCarrera = (request, response) => {
    const { action, carrera_id, carrera_nombre } = request.body;

    if (action === "insert") {
        connection.query(
            "INSERT INTO tbl_carreras (carrera_nombre) VALUES (?)",
            [carrera_nombre],
            (error, results) => {
                if (error) {
                    console.error("Error al agregar carrera:", error);
                    response.status(500).json({ error: "Error interno del servidor" });
                    return;
                }
                response.status(201).json({ message: "Carrera añadida correctamente", affectedRows: results.affectedRows });
            }
        );
    } else if (action === "update") {
        connection.query(
            "UPDATE tbl_carreras SET carrera_nombre=? WHERE carrera_id=?",
            [carrera_nombre, carrera_id],
            (error, results) => {
                if (error) {
                    console.error("Error al actualizar carrera:", error);
                    response.status(500).json({ error: "Error interno del servidor" });
                    return;
                }
                response.status(200).json({ message: "Carrera editada correctamente", affectedRows: results.affectedRows });
            }
        );
    } else {
        response.status(400).json({ error: "Acción no válida" });
    }
};

// Servicio para eliminar una carrera por su ID
const deleteCarrera = (request, response) => {
    const carrera_id = request.params.carrera_id;
    connection.query("DELETE FROM tbl_carreras WHERE carrera_id=?", [carrera_id], (error, results) => {
        if (error) {
            console.error("Error al eliminar carrera:", error);
            response.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        response.status(200).json({ message: "Carrera eliminada correctamente", affectedRows: results.affectedRows });
    });
};

// Servicio para obtener todas las categorías
const getCategorias = (request, response) => {
    connection.query("SELECT * FROM tbl_categorias", (error, results) => {
        if (error) {
            console.error("Error al obtener categorías:", error);
            response.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        response.status(200).json(results);
    });
};

// Rutas
app.get("/carreras", getCarreras);
app.post("/carreras", postCarrera);
app.delete("/carreras/:carrera_id", deleteCarrera);

app.get("/categorias", getCategorias);

module.exports = app;
