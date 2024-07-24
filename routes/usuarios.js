const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const { OAuth2Client } = require('google-auth-library');
const { connection } = require("../config/config.db");

app.use(express.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

// Servicio para insertar o actualizar un usuario
const postUsuario = (request, response) => {
    const {
      action,
      usuario_id,
      usuario_nombre,
      usuario_email,
      usuario_google_id,
      usuario_fecha_registro,
      carrera_id,
      usuario_matricula
    } = request.body;
  
    let rol_id;
    if (usuario_email.endsWith("@upqroo.edu.mx")) {
      rol_id = 2; // Rol de estudiante
    } else if (usuario_email.endsWith("@docentes.edu.mx")) {
      rol_id = 1; // Rol de administrador o docente
    } else {
      rol_id = 3; // Rol para otros usuarios si es necesario
    }
  
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

// Nuevo servicio para manejar el login con Google
const postGoogleLogin = async (request, response) => {
    const { token } = request.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const usuario_email = payload.email;
        const usuario_nombre = payload.name;
        const usuario_google_id = payload.sub;
        const usuario_fecha_registro = new Date().toISOString();
        const usuario_matricula = ''; // Asigna valor si es necesario

        // Verificar si el usuario ya existe
        connection.query(
            "SELECT * FROM tbl_usuarios WHERE usuario_google_id = ?",
            [usuario_google_id],
            (error, results) => {
                if (error) {
                    console.error("Error al verificar usuario:", error);
                    response.status(500).json({ error: "Error interno del servidor" });
                    return;
                }

                if (results.length > 0) {
                    // El usuario ya existe, actualizar los datos
                    connection.query(
                        "UPDATE tbl_usuarios SET usuario_nombre=?, usuario_email=?, usuario_fecha_registro=? WHERE usuario_google_id=?",
                        [usuario_nombre, usuario_email, usuario_fecha_registro, usuario_google_id],
                        (error, results) => {
                            if (error) {
                                console.error("Error al actualizar usuario:", error);
                                response.status(500).json({ error: "Error interno del servidor" });
                                return;
                            }
                            response.status(200).json({ message: "Usuario actualizado correctamente", user: { usuario_nombre, usuario_email, usuario_google_id } });
                        }
                    );
                } else {
                    // El usuario no existe, insertar nuevo
                    let rol_id;
                    if (usuario_email.endsWith("@upqroo.edu.mx")) {
                      rol_id = 2; // Rol de estudiante
                    } else if (usuario_email.endsWith("@docentes.edu.mx")) {
                      rol_id = 1; // Rol de administrador o docente
                    } else {
                      rol_id = 3; // Rol para otros usuarios si es necesario
                    }

                    connection.query(
                        "INSERT INTO tbl_usuarios (usuario_nombre, usuario_email, usuario_google_id, usuario_fecha_registro, rol_id, usuario_matricula) VALUES (?, ?, ?, ?, ?, ?)",
                        [usuario_nombre, usuario_email, usuario_google_id, usuario_fecha_registro, rol_id, usuario_matricula],
                        (error, results) => {
                            if (error) {
                                console.error("Error al agregar usuario:", error);
                                response.status(500).json({ error: "Error interno del servidor" });
                                return;
                            }
                            response.status(201).json({ message: "Usuario añadido correctamente", user: { usuario_nombre, usuario_email, usuario_google_id } });
                        }
                    );
                }
            }
        );
    } catch (error) {
        console.error("Error al verificar el token:", error);
        response.status(401).json({ error: "Token inválido" });
    }
};

// Nuevo servicio para obtener el usuario_id usando el googleId
const getUsuarioIdPorGoogleId = (request, response) => {
  const { googleId } = request.query;
  connection.query(
      "SELECT usuario_id FROM tbl_usuarios WHERE usuario_google_id = ?",
      [googleId],
      (error, results) => {
          if (error) {
              console.error("Error al obtener usuario_id:", error);
              response.status(500).json({ error: "Error interno del servidor" });
              return;
          }
          if (results.length > 0) {
              response.status(200).json({ usuario_id: results[0].usuario_id });
          } else {
              response.status(404).json({ error: "Usuario no encontrado" });
          }
      }
  );
};



// Rutas
app.get("/usuarios", getUsuarios);
app.post("/usuarios", postUsuario);
app.delete("/usuarios/:usuario_id", deleteUsuario);
app.post("/auth/google", postGoogleLogin); // Nueva ruta para el login con Google

// Agregar ruta para obtener usuario_id por googleId
app.get("/usuarios/por-google-id", getUsuarioIdPorGoogleId);

module.exports = app;
