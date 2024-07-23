const express = require("express");
const multer = require("multer");
const { connection } = require("../config/config.db");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Servicio para obtener todos los proyectos con el nombre del autor
const getProyectos = (req, res) => {
    const query = `
        SELECT p.*, u.usuario_nombre AS autor_nombre
        FROM tbl_proyectos p
        LEFT JOIN tbl_usuarios u ON p.usuario_id = u.usuario_id
    `;
    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error al obtener proyectos:", error);
            res.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        res.status(200).json(results);
    });
};

// Servicio para obtener un proyecto por su ID
const getProyectoById = (req, res) => {
    const proyecto_id = req.params.proyecto_id;
    const query = `
        SELECT p.*, u.usuario_nombre AS autor_nombre
        FROM tbl_proyectos p
        LEFT JOIN tbl_usuarios u ON p.usuario_id = u.usuario_id
        WHERE p.proyecto_id = ?
    `;
    connection.query(query, [proyecto_id], (error, results) => {
        if (error) {
            console.error("Error al obtener el proyecto:", error);
            res.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: "Proyecto no encontrado" });
            return;
        }
        res.status(200).json(results[0]);
    });
};

// Servicio para agregar o editar un proyecto
const postProyecto = (req, res) => {
    const { action, proyecto_id, proyecto_titulo, proyecto_descripcion, proyecto_fecha_subida, usuario_id, carrera_id, estado_id } = req.body;
    const proyecto_archivo_pdf = req.file.buffer;

    if (action === "insert") {
        const query = `
            INSERT INTO tbl_proyectos (
                proyecto_titulo, proyecto_descripcion, proyecto_fecha_subida,
                proyecto_archivo_pdf, usuario_id, carrera_id, estado_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        connection.query(query, [
            proyecto_titulo, 
            proyecto_descripcion, 
            proyecto_fecha_subida, 
            proyecto_archivo_pdf, 
            usuario_id, 
            carrera_id, 
            estado_id
        ], (error, results) => {
            if (error) {
                console.error("Error al agregar proyecto:", error);
                res.status(500).json({ error: "Error interno del servidor" });
                return;
            }
            res.status(201).json({ message: "Proyecto añadido correctamente", affectedRows: results.affectedRows });
        });
    } else if (action === "update") {
        const query = `
            UPDATE tbl_proyectos SET
                proyecto_titulo=?, proyecto_descripcion=?, proyecto_fecha_subida=?,
                proyecto_archivo_pdf=?, usuario_id=?, carrera_id=?, estado_id=?
            WHERE proyecto_id=?
        `;
        connection.query(query, [
            proyecto_titulo, 
            proyecto_descripcion, 
            proyecto_fecha_subida, 
            proyecto_archivo_pdf, 
            usuario_id, 
            carrera_id, 
            estado_id, 
            proyecto_id
        ], (error, results) => {
            if (error) {
                console.error("Error al actualizar proyecto:", error);
                res.status(500).json({ error: "Error interno del servidor" });
                return;
            }
            res.status(200).json({ message: "Proyecto editado correctamente", affectedRows: results.affectedRows });
        });
    } else {
        res.status(400).json({ error: "Acción no válida" });
    }
};

// Servicio para eliminar un proyecto por su ID
const deleteProyecto = (req, res) => {
    const proyecto_id = req.params.proyecto_id;
    connection.query("DELETE FROM tbl_proyectos WHERE proyecto_id=?", [proyecto_id], (error, results) => {
        if (error) {
            console.error("Error al eliminar proyecto:", error);
            res.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        res.status(200).json({ message: "Proyecto eliminado correctamente", affectedRows: results.affectedRows });
    });
};

// Rutas
router.get("/home", getProyectos);
router.get("/proyecto/:proyecto_id", getProyectoById); // Ruta para obtener un proyecto por ID
router.post("/", upload.single('archivo_pdf'), postProyecto);
router.delete("/:proyecto_id", deleteProyecto);

module.exports = router;
