const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// Conexión con la base de datos
const { connection } = require("../config/config.db");

app.use(express.json());

// Servicio para obtener todos los usuarios
const getUsuarios = (request, response) => {
    connection.query("SELECT * FROM tbl_usuarios", (error, results) => {
        if (error) {
            console.error("Error al obtener usuarios:", error);
            response.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        response.status(200).json(results);
    });
};

// Servicio para agregar o editar un usuario
const postUsuario = (request, response) => {
    const {
        action,
        usuario_id,
        usuario_nombre,
        usuario_email,
        usuario_google_id,
        usuario_fecha_registro,
        carrera_id,
        rol_id,
        usuario_matricula
    } = request.body;

    if (action === "insert") {
        connection.query(
            "INSERT INTO tbl_usuarios (usuario_nombre, usuario_email, usuario_google_id, usuario_fecha_registro, carrera_id, rol_id, usuario_matricula) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                usuario_nombre,
                usuario_email,
                usuario_google_id,
                usuario_fecha_registro,
                carrera_id,
                rol_id,
                usuario_matricula
            ],
            (error, results) => {
                if (error) {
                    console.error("Error al agregar usuario:", error);
                    response.status(500).json({ error: "Error interno del servidor" });
                    return;
                }
                response.status(201).json({ message: "Usuario añadido correctamente", affectedRows: results.affectedRows });
            }
        );
    } else if (action === "update") {
        connection.query(
            "UPDATE tbl_usuarios SET usuario_nombre=?, usuario_email=?, usuario_google_id=?, usuario_fecha_registro=?, carrera_id=?, rol_id=?, usuario_matricula=? WHERE usuario_id=?",
            [
                usuario_nombre,
                usuario_email,
                usuario_google_id,
                usuario_fecha_registro,
                carrera_id,
                rol_id,
                usuario_matricula,
                usuario_id
            ],
            (error, results) => {
                if (error) {
                    console.error("Error al actualizar usuario:", error);
                    response.status(500).json({ error: "Error interno del servidor" });
                    return;
                }
                response.status(200).json({ message: "Usuario editado correctamente", affectedRows: results.affectedRows });
            }
        );
    } else {
        response.status(400).json({ error: "Acción no válida" });
    }
};

// Servicio para eliminar un usuario por su ID
const deleteUsuario = (request, response) => {
    const usuario_id = request.params.usuario_id;
    connection.query("DELETE FROM tbl_usuarios WHERE usuario_id = ?", [usuario_id], (error, results) => {
        if (error) {
            console.error("Error al eliminar usuario:", error);
            response.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        response.status(200).json({ message: "Usuario eliminado correctamente", affectedRows: results.affectedRows });
    });
};

// Rutas
app.get("/usuarios", getUsuarios);
app.post("/usuarios", postUsuario);
app.delete("/usuarios/:usuario_id", deleteUsuario);

module.exports = app;
