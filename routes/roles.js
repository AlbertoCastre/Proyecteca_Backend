const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// Conexión con la base de datos
const { connection } = require("../config/config.db");

app.use(express.json());

// Servicio para obtener todos los roles
const getRoles = (request, response) => {
    connection.query("SELECT * FROM tbl_roles", (error, results) => {
        if (error) {
            console.error("Error al obtener roles:", error);
            response.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        response.status(200).json(results);
    });
};

// Servicio para agregar o editar un rol
const postRol = (request, response) => {
    const { action, rol_id, rol_nombre } = request.body;

    if (action === "insert") {
        connection.query("INSERT INTO tbl_roles (rol_nombre) VALUES (?)",
            [rol_nombre],
            (error, results) => {
                if (error) {
                    console.error("Error al agregar rol:", error);
                    response.status(500).json({ error: "Error interno del servidor" });
                    return;
                }
                response.status(201).json({ message: "Rol añadido correctamente", affectedRows: results.affectedRows });
            });
    } else if (action === "update") {
        connection.query("UPDATE tbl_roles SET rol_nombre=? WHERE rol_id = ?",
            [rol_nombre, rol_id],
            (error, results) => {
                if (error) {
                    console.error("Error al actualizar rol:", error);
                    response.status(500).json({ error: "Error interno del servidor" });
                    return;
                }
                response.status(200).json({ message: "Rol editado correctamente", affectedRows: results.affectedRows });
            });
    } else {
        response.status(400).json({ error: "Acción no válida" });
    }
};

// Servicio para eliminar un rol por su ID
const deleteRol = (request, response) => {
    const rol_id = request.params.rol_id;
    connection.query("DELETE FROM tbl_roles WHERE rol_id = ?", [rol_id], (error, results) => {
        if (error) {
            console.error("Error al eliminar rol:", error);
            response.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        response.status(200).json({ message: "Rol eliminado correctamente", affectedRows: results.affectedRows });
    });
};

// Rutas
app.get("/roles", getRoles);
app.post("/roles", postRol);
app.delete("/roles/:rol_id", deleteRol);

module.exports = app;
