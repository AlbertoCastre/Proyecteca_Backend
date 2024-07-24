const express = require('express');
const multer = require('multer');
const { connection } = require('../config/config.db');
const dotenv = require('dotenv');

dotenv.config(); // Configuración de variables de entorno

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.fieldname !== 'proyecto_archivo_pdf') {
            return cb(new Error('Campo de archivo incorrecto'), false);
        }
        cb(null, true);
    }
});

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
    console.log("Datos recibidos en el backend:", req.body);
    console.log("Archivo recibido:", req.file ? req.file.originalname : "Ninguno");

    const { action, proyecto_titulo, proyecto_descripcion, proyecto_fecha_subida, usuario_id, carrera_id, estado_id, categoria_id } = req.body;

    const proyecto_archivo_pdf = req.file ? req.file.buffer : null;

    if (!proyecto_titulo || !proyecto_descripcion || !proyecto_fecha_subida || !usuario_id || !carrera_id || !estado_id || !proyecto_archivo_pdf) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    if (action === 'insert') {
        const query = `
            INSERT INTO tbl_proyectos (
                proyecto_titulo, proyecto_descripcion, proyecto_fecha_subida,
                proyecto_archivo_pdf, usuario_id, carrera_id, estado_id, categoria_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        connection.query(query, [
            proyecto_titulo,
            proyecto_descripcion,
            proyecto_fecha_subida,
            proyecto_archivo_pdf,
            usuario_id,
            carrera_id,
            estado_id,
            categoria_id
        ], (error, results) => {
            if (error) {
                console.error("Error al agregar proyecto:", error);
                res.status(500).json({ error: "Error interno del servidor", details: error });
                return;
            }
            res.status(201).json({ message: "Proyecto añadido correctamente", affectedRows: results.affectedRows });
        });
    } else if (action === 'update') {
        const query = `
            UPDATE tbl_proyectos SET
                proyecto_titulo=?, proyecto_descripcion=?, proyecto_fecha_subida=?,
                proyecto_archivo_pdf=?, usuario_id=?, carrera_id=?, estado_id=?, categoria_id=?
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
            categoria_id,
            req.body.proyecto_id
        ], (error, results) => {
            if (error) {
                console.error("Error al actualizar proyecto:", error);
                res.status(500).json({ error: "Error interno del servidor", details: error });
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

// Servicio para obtener el archivo PDF del proyecto
const getPdfByProyectoId = (req, res) => {
    const proyecto_id = req.params.proyecto_id;
    const query = 'SELECT proyecto_archivo_pdf FROM tbl_proyectos WHERE proyecto_id = ?';

    connection.query(query, [proyecto_id], (error, results) => {
        if (error) {
            console.error("Error al obtener el archivo PDF:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        if (results.length === 0 || !results[0].proyecto_archivo_pdf) {
            return res.status(404).json({ error: "Archivo PDF no encontrado" });
        }

        const pdfBuffer = results[0].proyecto_archivo_pdf;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=proyecto_${proyecto_id}.pdf`);
        res.send(pdfBuffer);
    });
};

// Rutas
router.get("/home", getProyectos);
router.get("/proyecto/:proyecto_id", getProyectoById);
router.get("/proyecto/:proyecto_id/pdf", getPdfByProyectoId); // Nueva ruta para obtener el PDF
router.post("/sube", upload.single('proyecto_archivo_pdf'), postProyecto);
router.delete("/:proyecto_id", deleteProyecto);

module.exports = router;
