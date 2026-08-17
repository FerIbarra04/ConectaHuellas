require("dotenv").config()

const express = require("express")
const cors = require("cors")
const db = require("./db")

const multer = require("multer")
const streamifier = require("streamifier")
const cloudinary = require("cloudinary").v2
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const app = express()

app.use(cors())
app.use(express.json())

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
})

const storage = multer.memoryStorage()
const upload = multer({ storage })

const PORT = process.env.PORT || 3001

const verificarTokenAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      error: "Acceso no autorizado",
    })
  }

  const token = authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({
      error: "Token no proporcionado",
    })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
    )

    req.admin = decoded

    next()
  } catch (error) {
    return res.status(401).json({
      error:
        "La sesión no es válida o ha expirado",
    })
  }
}

const generarFolioSolicitud = () => {
  const year = new Date().getFullYear()
  const random = Math.floor(1000 + Math.random() * 9000)

  return `SI-${year}-${random}`
}

// ==========================
// 🔐 LOGIN ADMIN
// ==========================
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({
      error: "Usuario y contraseña son obligatorios.",
    })
  }

  const sql = `
    SELECT id, username, password_hash
    FROM usuarios_admin
    WHERE username = ?
    LIMIT 1
  `

  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Error buscando administrador:", err)

      return res.status(500).json({
        error: "No se pudo iniciar sesión.",
      })
    }

    if (results.length === 0) {
      return res.status(401).json({
        error: "Credenciales incorrectas.",
      })
    }

    const admin = results[0]

    const passwordValida = await bcrypt.compare(
      password,
      admin.password_hash,
    )

    if (!passwordValida) {
      return res.status(401).json({
        error: "Credenciales incorrectas.",
      })
    }

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      },
    )

    res.json({
      message: "Inicio de sesión correcto",
      token,
      user: {
        id: admin.id,
        username: admin.username,
      },
    })
  })
})

// ==========================
// ☁️ SUBIR ARCHIVO A CLOUDINARY
// ==========================
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No se recibió ningún archivo",
      })
    }

    const resourceType = req.file.mimetype.startsWith("video")
      ? "video"
      : "image"

    const uploadStream = cloudinary.uploader.unsigned_upload_stream(
      "ml_default",
      {
        resource_type: resourceType,
        folder: "conecta-huellas",
      },
      (error, result) => {
        if (error) {
  console.error("ERROR CLOUDINARY:", error)

  return res.status(500).json({
    error: error.message || "Error al subir el archivo a Cloudinary",
  })
}

        res.json({
          url: result.secure_url,
          type: resourceType,
        })
      }
    )

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream)
  } catch (error) {
    console.error("ERROR UPLOAD:", error)
    res.status(500).json({ error })
  }
})

// ==========================
// 🏷 GET TODOS LOS TAGS
// ==========================
app.get('/tags', (req, res) => {
    const sqlTags = 'SELECT * FROM tags ORDER BY nombre ASC'
    const sqlAnimales = 'SELECT tags FROM animales'

    db.query(sqlTags, (err, tagsResults) => {
        if (err) {
            return res.status(500).json({ error: err })
        }

        db.query(sqlAnimales, (err, animalesResults) => {
            if (err) {
                return res.status(500).json({ error: err })
            }

            const conteoTags = {}

            animalesResults.forEach((animal) => {
                let tagsAnimal = []

                try {
                    if (Array.isArray(animal.tags)) {
                        tagsAnimal = animal.tags
                    } else if (typeof animal.tags === 'string') {
                        tagsAnimal = JSON.parse(animal.tags)
                    } else {
                        tagsAnimal = []
                    }
                } catch {
                    tagsAnimal = []
                }

                tagsAnimal.forEach((tag) => {
                    conteoTags[tag] = (conteoTags[tag] || 0) + 1
                })
            })

            const data = tagsResults.map((tag) => ({
                ...tag,
                usadoPor: conteoTags[tag.nombre] || 0,
            }))

            res.json(data)
        })
    })
})

// ==========================
// ➕ CREAR TAG
// ==========================
app.post('/tags', (req, res) => {

    const { nombre } = req.body

    const sql = `
        INSERT INTO tags (nombre)
        VALUES (?)
    `

    db.query(sql, [nombre], (err, result) => {

        if (err) {
            return res.status(500).json({ error: err })
        }

        res.json({
            id: result.insertId,
            nombre
        })
    })
})


// ==========================
// 🗑 ELIMINAR TAG
// ==========================
app.delete('/tags/:id', (req, res) => {
    const { id } = req.params

    const sql = 'DELETE FROM tags WHERE id = ?'

    db.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({ error: err })
        }

        res.json({
            message: 'Tag eliminado correctamente 🗑️'
        })
    })
})

// ==========================
// ✏️ EDITAR TAG
// ==========================
app.put('/tags/:id', (req, res) => {

    const { id } = req.params
    const { nombre } = req.body

    const sql = `
        UPDATE tags
        SET nombre = ?
        WHERE id = ?
    `

    db.query(sql, [nombre, id], (err) => {

        if (err) {
            return res.status(500).json({ error: err })
        }

        res.json({
            message: 'Tag actualizado correctamente ✏️'
        })
    })
})

// ==========================
// 🟢 GET TODOS LOS ANIMALES
// ==========================
app.get('/animales', (req, res) => {
    const sql = 'SELECT * FROM animales'

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err })
        }

        const data = results.map(animal => {
            let tags = []
            let multimedia = []

            try {
                if (Array.isArray(animal.tags)) {
                    tags = animal.tags
                } else if (typeof animal.tags === 'string') {
                    tags = JSON.parse(animal.tags)
                }
            } catch {
                tags = []
            }

            try {
                if (Array.isArray(animal.multimedia)) {
                    multimedia = animal.multimedia
                } else if (typeof animal.multimedia === 'string') {
                    multimedia = JSON.parse(animal.multimedia)
                }
            } catch {
                multimedia = []
            }

            return {
                ...animal,
                tags,
                multimedia
            }
        })

        res.json(data)
    })
})


// ==========================
// 🟢 GET POR ID
// ==========================
app.get('/animales/:id', (req, res) => {
    const { id } = req.params

    const sql = 'SELECT * FROM animales WHERE id = ?'

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err })
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Animal no encontrado'
            })
        }

        const animal = results[0]

        try {
            if (Array.isArray(animal.tags)) {
                animal.tags = animal.tags
            } else if (typeof animal.tags === 'string') {
                animal.tags = JSON.parse(animal.tags)
            } else {
                animal.tags = []
            }
        } catch {
            animal.tags = []
        }

        try {
            if (Array.isArray(animal.multimedia)) {
                animal.multimedia = animal.multimedia
            } else if (typeof animal.multimedia === 'string') {
                animal.multimedia = JSON.parse(animal.multimedia)
            } else {
                animal.multimedia = []
            }
        } catch {
            animal.multimedia = []
        }

        res.json(animal)
    })
})


// ==========================
// 🟢 POST (CREAR ANIMAL)
// ==========================
app.post('/animales', (req, res) => {
    const {
        nombre,
        edad,
        tamaño,
        convivencia_perros,
        descripcion,
        estado,
        tags,
        multimedia,
        fecha_alta_coordinacion
    } = req.body

    const parsedTags =
        Array.isArray(tags)
            ? tags
            : typeof tags === 'string'
                ? tags.split(',').map(t => t.trim()).filter(Boolean)
                : []

    const parsedMultimedia =
        Array.isArray(multimedia)
            ? multimedia
            : []

    const sql = `
        INSERT INTO animales 
        (
            nombre,
            edad,
            tamaño,
            convivencia_perros,
            descripcion,
            estado,
            tags,
            multimedia,
            fecha_alta_coordinacion
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    db.query(
        sql,
        [
            nombre,
            edad,
            tamaño,
            convivencia_perros,
            descripcion,
            estado,
            JSON.stringify(parsedTags),
            JSON.stringify(parsedMultimedia),
            fecha_alta_coordinacion || new Date()
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err })
            }

            res.json({
                message: 'Animal agregado correctamente 🐾',
                id: result.insertId
            })
        }
    )
})


// ==========================
// 🟡 PUT (ACTUALIZAR ANIMAL)
// ==========================
app.put('/animales/:id', (req, res) => {
    const { id } = req.params

    const {
        nombre,
        edad,
        tamaño,
        convivencia_perros,
        descripcion,
        estado,
        tags,
        multimedia,
        fecha_alta_coordinacion
    } = req.body

    const fecha_adopcion =
        estado === 'adoptado'
            ? new Date()
            : null

    const parsedTags =
        Array.isArray(tags)
            ? tags
            : typeof tags === 'string'
                ? tags.split(',').map(t => t.trim()).filter(Boolean)
                : []

    const parsedMultimedia =
        Array.isArray(multimedia)
            ? multimedia
            : []

    const sql = `
        UPDATE animales 
        SET
            nombre = ?,
            edad = ?,
            tamaño = ?,
            convivencia_perros = ?,
            descripcion = ?,
            estado = ?,
            tags = ?,
            multimedia = ?,
            fecha_alta_coordinacion = ?,
            fecha_adopcion = ?
        WHERE id = ?
    `

    db.query(
        sql,
        [
            nombre,
            edad,
            tamaño,
            convivencia_perros,
            descripcion,
            estado,
            JSON.stringify(parsedTags),
            JSON.stringify(parsedMultimedia),
            fecha_alta_coordinacion,
            fecha_adopcion,
            id
        ],
        (err) => {
            if (err) {
                return res.status(500).json({ error: err })
            }

            res.json({
                message: 'Animal actualizado correctamente ✏️'
            })
        }
    )
})


// ==========================
// 🗑 DELETE ANIMAL
// ==========================
app.delete('/animales/:id', (req, res) => {
    const animalId = Number(req.params.id)

    if (!Number.isInteger(animalId) || animalId <= 0) {
        return res.status(400).json({
            code: 'ID_ANIMAL_INVALIDO',
            message: 'El identificador del animal no es válido.'
        })
    }

    // Primero verificamos que el animal exista.
    const verificarAnimalSql = `
        SELECT id, nombre
        FROM animales
        WHERE id = ?
        LIMIT 1
    `

    db.query(verificarAnimalSql, [animalId], (animalError, animales) => {
        if (animalError) {
            console.error('Error al verificar el animal:', animalError)

            return res.status(500).json({
                code: 'ERROR_VERIFICAR_ANIMAL',
                message: 'No se pudo verificar la información del animal.'
            })
        }

        if (animales.length === 0) {
            return res.status(404).json({
                code: 'ANIMAL_NO_ENCONTRADO',
                message: 'El animal no fue encontrado.'
            })
        }

        const animal = animales[0]

        // Verificamos si está vinculado a una solicitud externa.
        const verificarSolicitudSql = `
            SELECT
                id AS solicitud_id,
                folio
            FROM solicitudes_incorporacion
            WHERE animal_id = ?
            LIMIT 1
        `

        db.query(
            verificarSolicitudSql,
            [animalId],
            (solicitudError, solicitudes) => {
                if (solicitudError) {
                    console.error(
                        'Error al verificar la solicitud vinculada:',
                        solicitudError
                    )

                    return res.status(500).json({
                        code: 'ERROR_VERIFICAR_SOLICITUD',
                        message:
                            'No se pudo verificar si el animal está vinculado a una solicitud.'
                    })
                }

                const eliminarAnimal = () => {
    const eliminarAnimalSql = `
        DELETE FROM animales
        WHERE id = ?
    `

    db.query(
        eliminarAnimalSql,
        [animalId],
        (eliminarError, resultado) => {
            if (eliminarError) {
                console.error(
                    'Error al eliminar el animal:',
                    eliminarError
                )

                return res.status(500).json({
                    code: 'ERROR_ELIMINAR_ANIMAL',
                    message: 'No se pudo eliminar el animal.'
                })
            }

            return res.json({
                message: 'Animal eliminado correctamente 🗑️',
                animal_id: animalId,
                nombre: animal.nombre,
                solicitud_desvinculada: solicitudes.length > 0
            })
        }
    )
}

if (solicitudes.length > 0) {
    const desvincularSql = `
        UPDATE solicitudes_incorporacion
SET
    animal_id = NULL,
    estado_solicitud = 'historial',
    fecha_registro_animal = NULL
WHERE animal_id = ?
    `

    db.query(
        desvincularSql,
        [animalId],
        (updateError) => {
            if (updateError) {
                console.error(
                    'Error al desvincular la solicitud:',
                    updateError
                )

                return res.status(500).json({
                    code: 'ERROR_DESVINCULAR_SOLICITUD',
                    message:
                        'No se pudo desvincular la solicitud del animal.'
                })
            }

            eliminarAnimal()
        }
    )
} else {
    eliminarAnimal()
}
            }
        )
    })
})

// ==========================
// 👤 GET SOLICITANTES
// ==========================
app.get("/solicitantes", (req, res) => {
  const sql = `
    SELECT *
    FROM solicitantes
    ORDER BY fecha_registro DESC
  `

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err })
    }

    res.json(results)
  })
})

// ==========================
// 🔎 BUSCAR SOLICITANTES
// ==========================
app.get("/solicitantes/buscar", (req, res) => {
  const { q = "" } = req.query

  const sql = `
    SELECT *
    FROM solicitantes
    WHERE nombre LIKE ? OR responsable LIKE ? OR telefono LIKE ? OR correo LIKE ?
    ORDER BY nombre ASC
    LIMIT 10
  `

  const search = `%${q}%`

  db.query(sql, [search, search, search, search], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err })
    }

    res.json(results)
  })
})

// ==========================
// ➕ CREAR SOLICITANTE
// ==========================
app.post("/solicitantes", (req, res) => {
  const {
    tipo_solicitante,
    nombre,
    responsable,
    telefono,
    correo,
    ubicacion,
    comprobante_domicilio_url,
    ine_url,
    observaciones,
  } = req.body

  const sql = `
    INSERT INTO solicitantes
    (
      tipo_solicitante,
      nombre,
      responsable,
      telefono,
      correo,
      ubicacion,
      comprobante_domicilio_url,
      ine_url,
      observaciones
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  db.query(
    sql,
    [
      tipo_solicitante,
      nombre,
      responsable || null,
      telefono || null,
      correo || null,
      ubicacion,
      comprobante_domicilio_url || null,
      ine_url || null,
      observaciones || null,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err })
      }

      res.json({
        message: "Solicitante creado correctamente",
        id: result.insertId,
      })
    }
  )
})

// ==========================
// 📋 GET SOLICITUDES
// ==========================
app.get("/solicitudes", (req, res) => {
  const sql = `
    SELECT 
      s.*,
      sol.tipo_solicitante,
      sol.nombre AS solicitante_nombre,
      sol.responsable AS solicitante_responsable,
      sol.telefono AS solicitante_telefono,
      sol.correo AS solicitante_correo
    FROM solicitudes_incorporacion s
    INNER JOIN solicitantes sol ON s.solicitante_id = sol.id
    ORDER BY s.fecha_solicitud DESC
  `

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err })
    }

    const data = results.map((solicitud) => ({
      ...solicitud,
      multimedia: parseJsonField(solicitud.multimedia, []),
    }))

    res.json(data)
  })
})

// ==========================
// 📋 GET SOLICITUD POR ID
// ==========================
app.get("/solicitudes/:id", (req, res) => {
  const { id } = req.params

  const sql = `
    SELECT 
      s.*,
      sol.tipo_solicitante,
      sol.nombre AS solicitante_nombre,
      sol.responsable AS solicitante_responsable,
      sol.telefono AS solicitante_telefono,
      sol.correo AS solicitante_correo,
      sol.ubicacion AS solicitante_ubicacion,
      sol.comprobante_domicilio_url,
      sol.ine_url
    FROM solicitudes_incorporacion s
    INNER JOIN solicitantes sol ON s.solicitante_id = sol.id
    WHERE s.id = ?
  `

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err })
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Solicitud no encontrada",
      })
    }

    const solicitud = results[0]

    solicitud.multimedia = parseJsonField(
      solicitud.multimedia,
      [],
    )

    res.json(solicitud)
  })
})

// ==========================
// ♻️ RESTAURAR SOLICITUD
// ==========================
app.put("/solicitudes/:id/restaurar", (req, res) => {
  const { id } = req.params

  const sql = `
    UPDATE solicitudes_incorporacion
    SET
      estado_solicitud = 'aprobada',
      animal_id = NULL,
      veces_restaurada = veces_restaurada + 1
    WHERE id = ?
      AND estado_solicitud = 'historial'
  `

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err)

      return res.status(500).json({
        message: "No se pudo restaurar la solicitud.",
      })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "La solicitud no existe o no está en historial.",
      })
    }

    res.json({
      message: "Solicitud restaurada correctamente.",
    })
  })
})

// ==========================
// ➕ CREAR SOLICITUD
// ==========================
app.post("/solicitudes", (req, res) => {
  const {
    solicitante_id,
    nombre_animal,
    tipo_animal,
    sexo,
    edad_aproximada,
    tamano,
    esterilizado,
    descripcion,
    lugar_estancia,
    multimedia,
    cartilla_vacunacion_url,
  } = req.body

  const folio = generarFolioSolicitud()

  const parsedMultimedia = Array.isArray(multimedia)
    ? multimedia
    : []

  const sql = `
    INSERT INTO solicitudes_incorporacion
    (
      folio,
      solicitante_id,
      nombre_animal,
      tipo_animal,
      sexo,
      edad_aproximada,
      tamano,
      esterilizado,
      descripcion,
      lugar_estancia,
      multimedia,
      cartilla_vacunacion_url
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  db.query(
    sql,
    [
      folio,
      solicitante_id,
      nombre_animal || null,
      tipo_animal,
      sexo || "desconocido",
      edad_aproximada || null,
      tamano,
      esterilizado || "no_se_sabe",
      descripcion || null,
      lugar_estancia,
      JSON.stringify(parsedMultimedia),
      cartilla_vacunacion_url || null,
    ],
    (err, result) => {
      if (err) {
        console.error("Error creando solicitud:", err)

        return res.status(500).json({
          error: "No se pudo crear la solicitud",
        })
      }

      res.json({
        message: "Solicitud enviada correctamente",
        id: result.insertId,
        folio,
      })
    },
  )
})

// ==========================
// 🟡 ACTUALIZAR ESTADO SOLICITUD
// ==========================
app.put(
  "/solicitudes/:id/estado",
  verificarTokenAdmin,
  (req, res) => {
    const { id } = req.params

    const {
      estado_solicitud,
      observaciones_admin,
      comentario_resolucion,
    } = req.body

    const estadosValidos = [
      "pendiente",
      "en_revision",
      "aprobada",
      "registrada",
      "rechazada",
    ]

    if (!estadosValidos.includes(estado_solicitud)) {
      return res.status(400).json({
        error: "Estado de solicitud no válido",
      })
    }

    if (
      estado_solicitud === "rechazada" &&
      !comentario_resolucion?.trim()
    ) {
      return res.status(400).json({
        error:
          "Debes escribir el motivo del rechazo antes de rechazar la solicitud",
      })
    }

    const sql = `
      UPDATE solicitudes_incorporacion
      SET
        estado_solicitud = ?,
        observaciones_admin = ?,
        comentario_resolucion = ?,
        fecha_revision = CASE
          WHEN ? IN ('aprobada', 'rechazada', 'en_revision')
            THEN CURRENT_TIMESTAMP
          ELSE fecha_revision
        END
      WHERE id = ?
    `

    db.query(
      sql,
      [
        estado_solicitud,
        observaciones_admin || null,
        comentario_resolucion || null,
        estado_solicitud,
        id,
      ],
      (err, result) => {
        if (err) {
          console.error("Error actualizando solicitud:", err)

          return res.status(500).json({
            error: "No se pudo actualizar la solicitud",
          })
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            error: "Solicitud no encontrada",
          })
        }

        // Si no fue rechazada, termina normalmente.
        if (estado_solicitud !== "rechazada") {
          return res.json({
            message:
              "Estado de solicitud actualizado correctamente",
            estado_solicitud,
          })
        }

        // Buscar los datos necesarios para enviar el correo.
        const buscarSolicitudSql = `
          SELECT
            id,
            folio,
            nombre_solicitante,
            correo_solicitante,
            nombre_animal,
            comentario_resolucion
          FROM solicitudes_incorporacion
          WHERE id = ?
          LIMIT 1
        `

        db.query(
          buscarSolicitudSql,
          [id],
          async (buscarError, resultados) => {
            if (buscarError) {
              console.error(
                "La solicitud fue rechazada, pero no se pudieron consultar los datos para el correo:",
                buscarError,
              )

              return res.json({
                message:
                  "Solicitud rechazada correctamente, pero no se pudo preparar el correo",
                estado_solicitud,
                correo_enviado: false,
              })
            }

            if (resultados.length === 0) {
              return res.json({
                message:
                  "Solicitud rechazada correctamente, pero no se encontraron los datos del solicitante",
                estado_solicitud,
                correo_enviado: false,
              })
            }

            const solicitud = resultados[0]

            if (!solicitud.correo_solicitante) {
              return res.json({
                message:
                  "Solicitud rechazada correctamente, pero no tiene un correo registrado",
                estado_solicitud,
                correo_enviado: false,
              })
            }

            try {
              await enviarCorreoRechazo({
                destinatario: solicitud.correo_solicitante,
                nombreSolicitante:
                  solicitud.nombre_solicitante ||
                  "solicitante",
                folio: solicitud.folio,
                nombreAnimal:
                  solicitud.nombre_animal || "Animal",
                motivo:
                  solicitud.comentario_resolucion ||
                  comentario_resolucion,
              })

              return res.json({
                message:
                  "Solicitud rechazada y correo enviado correctamente",
                estado_solicitud,
                correo_enviado: true,
              })
            } catch (correoError) {
              console.error(
                "La solicitud fue rechazada, pero el correo no pudo enviarse:",
                correoError,
              )

              return res.json({
                message:
                  "Solicitud rechazada correctamente, pero el correo no pudo enviarse",
                estado_solicitud,
                correo_enviado: false,
              })
            }
          },
        )
      },
    )
  },
)

// ==========================
// VINCULAR SOLICITUD CON ANIMAL REGISTRADO
// ==========================

app.patch(
  "/solicitudes/:id/registrar",
  verificarTokenAdmin,
  (req, res) => {
    const solicitudId = Number(req.params.id)
const animalId = Number(req.body.animal_id);

if (!Number.isInteger(animalId) || animalId <= 0) {
  return res.status(400).json({
    error: "animal_id inválido",
  });
}
    if (!Number.isInteger(solicitudId) || solicitudId <= 0) {
      return res.status(400).json({
        error: "El identificador de la solicitud no es válido",
      })
    }

    if (!Number.isInteger(animalId) || animalId <= 0) {
      return res.status(400).json({
        error: "El identificador del animal no es válido",
      })
    }

    db.getConnection((connectionError, connection) => {
      if (connectionError) {
        console.error(
          "Error obteniendo conexión para registrar solicitud:",
          connectionError,
        )

        return res.status(500).json({
          error: "No se pudo iniciar el registro del animal",
        })
      }

      connection.beginTransaction((transactionError) => {
        if (transactionError) {
          connection.release()

          console.error(
            "Error iniciando transacción:",
            transactionError,
          )

          return res.status(500).json({
            error: "No se pudo iniciar la operación",
          })
        }

        const cancelarOperacion = (
          status,
          mensaje,
          errorOriginal = null,
        ) => {
          connection.rollback((rollbackError) => {
            connection.release()

            if (errorOriginal) {
              console.error(mensaje, errorOriginal)
            }

            if (rollbackError) {
              console.error(
                "Error revirtiendo la transacción:",
                rollbackError,
              )
            }

            return res.status(status).json({
              error: mensaje,
            })
          })
        }

        const buscarSolicitudSql = `
          SELECT
            id,
            estado_solicitud,
            animal_id
          FROM solicitudes_incorporacion
          WHERE id = ?
          LIMIT 1
          FOR UPDATE
        `

        connection.query(
          buscarSolicitudSql,
          [solicitudId],
          (solicitudError, solicitudResults) => {
            if (solicitudError) {
              return cancelarOperacion(
                500,
                "No se pudo verificar la solicitud",
                solicitudError,
              )
            }

            if (solicitudResults.length === 0) {
              return cancelarOperacion(
                404,
                "Solicitud no encontrada",
              )
            }

            const solicitud = solicitudResults[0]

            if (solicitud.estado_solicitud === "registrada") {
              return cancelarOperacion(
                409,
                "La solicitud ya fue registrada anteriormente",
              )
            }

            if (solicitud.estado_solicitud !== "aprobada") {
              return cancelarOperacion(
                409,
                "La solicitud debe estar aprobada antes de registrar el animal",
              )
            }

            if (
              solicitud.animal_id !== null &&
              Number(solicitud.animal_id) !== animalId
            ) {
              return cancelarOperacion(
                409,
                "La solicitud ya está vinculada con otro animal",
              )
            }

            const buscarAnimalSql = `
              SELECT
                id,
                origen,
                solicitud_origen_id
              FROM animales
              WHERE id = ?
              LIMIT 1
              FOR UPDATE
            `

            connection.query(
              buscarAnimalSql,
              [animalId],
              (animalError, animalResults) => {
                if (animalError) {
                  return cancelarOperacion(
                    500,
                    "No se pudo verificar el animal registrado",
                    animalError,
                  )
                }

                if (animalResults.length === 0) {
                  return cancelarOperacion(
                    404,
                    "El animal indicado no existe",
                  )
                }

                const animal = animalResults[0]

                if (
                  animal.solicitud_origen_id !== null &&
                  Number(animal.solicitud_origen_id) !== solicitudId
                ) {
                  return cancelarOperacion(
                    409,
                    "El animal ya está vinculado con otra solicitud",
                  )
                }

                const actualizarAnimalSql = `
                  UPDATE animales
                  SET
                    origen = 'solicitud_externa',
                    solicitud_origen_id = ?
                  WHERE id = ?
                `

                connection.query(
                  actualizarAnimalSql,
                  [solicitudId, animalId],
                  (actualizarAnimalError, animalResult) => {
                    if (actualizarAnimalError) {
                      return cancelarOperacion(
                        500,
                        "No se pudo clasificar el animal como externo",
                        actualizarAnimalError,
                      )
                    }

                    if (animalResult.affectedRows === 0) {
                      return cancelarOperacion(
                        404,
                        "No se encontró el animal que se desea vincular",
                      )
                    }

                    const actualizarSolicitudSql = `
  UPDATE solicitudes_incorporacion
  SET
    animal_id = ?,
    estado_solicitud = 'registrada',
    fue_registrada = 1,
    fecha_registro_animal = CURRENT_TIMESTAMP,
    fecha_revision = COALESCE(
      fecha_revision,
      CURRENT_TIMESTAMP
    )
  WHERE id = ?
    AND estado_solicitud = 'aprobada'
`

                    connection.query(
                      actualizarSolicitudSql,
                      [animalId, solicitudId],
                      (actualizarSolicitudError, result) => {
                        if (actualizarSolicitudError) {
                          return cancelarOperacion(
                            500,
                            "No se pudo vincular el animal con la solicitud",
                            actualizarSolicitudError,
                          )
                        }

                        if (result.affectedRows === 0) {
                          return cancelarOperacion(
                            409,
                            "La solicitud ya no se encuentra disponible para registrar",
                          )
                        }

                        connection.commit((commitError) => {
                          if (commitError) {
                            return cancelarOperacion(
                              500,
                              "No se pudieron guardar los cambios",
                              commitError,
                            )
                          }

                          connection.release()

                          return res.json({
                            message:
                              "Animal vinculado y clasificado como externo correctamente",
                            solicitud_id: solicitudId,
                            animal_id: animalId,
                            origen: "solicitud_externa",
                            estado_solicitud: "registrada",
                          })
                        })
                      },
                    )
                  },
                )
              },
            )
          },
        )
      })
    })
  },
)

function parseJsonField(valor, respaldo = []) {
  if (
    typeof valor === "object" &&
    valor !== null &&
    !Buffer.isBuffer(valor)
  ) {
    return valor
  }

  if (Buffer.isBuffer(valor)) {
    valor = valor.toString("utf8")
  }

  if (typeof valor !== "string") {
    return respaldo
  }

  try {
    return JSON.parse(valor)
  } catch (error) {
    console.error(
      "No se pudo convertir un campo JSON:",
      valor,
      error,
    )

    return respaldo
  }
}

// ==========================
// ELIMINAR SOLICITUD (SOLO SI ESTÁ RECHAZADA)
// ==========================
app.delete("/solicitudes/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    `DELETE FROM solicitudes_incorporacion
     WHERE id = ? AND estado_solicitud = 'rechazada'`,
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al eliminar la solicitud." });
      }

      if (result.affectedRows === 0) {
        return res.status(400).json({
          error: "Solo se pueden eliminar solicitudes rechazadas.",
        });
      }

      res.json({ message: "Solicitud eliminada correctamente." });
    }
  );
});
// ==========================
// 🏠 GET CONFIGURACIÓN LANDING
// ==========================


app.get("/landing", (req, res) => {
  console.log("✅ GET /landing NUEVO EJECUTADO")
  const configuracionSql = `
    SELECT *
    FROM configuracion_landing
    WHERE id = 1
    LIMIT 1
  `

  const destacadosSql = `
    SELECT
      lad.id,
      lad.animal_id,
      lad.imagen_sin_fondo_url,
      lad.orden,
      a.nombre,
      a.edad,
      a.tamaño,
      a.estado
    FROM landing_animales_destacados lad
    INNER JOIN animales a ON lad.animal_id = a.id
    ORDER BY lad.orden ASC, lad.id ASC
  `

  db.query(configuracionSql, (configError, configResults) => {
    if (configError) {
      console.error(
        "Error obteniendo configuración del landing:",
        configError,
      )

      return res.status(500).json({
        error: "No se pudo obtener la configuración del landing",
      })
    }

    if (configResults.length === 0) {
      return res.status(404).json({
        error: "No existe configuración del landing",
      })
    }

    const configuracion = configResults[0]
    db.query(destacadosSql, (destacadosError, destacadosResults) => {
      if (destacadosError) {
        console.error(
          "Error obteniendo animales destacados:",
          destacadosError,
        )

        return res.status(500).json({
          error: "No se pudieron obtener los animales destacados",
        })
      }
      console.log("Hero obtenido de MySQL:", configuracion.hero)

      res.json({
        id: configuracion.id,

        hero: parseJsonField(
          configuracion.hero,
          {},
        ),

        proposito: parseJsonField(
          configuracion.proposito,
          [],
        ),

        proceso_adopcion: parseJsonField(
          configuracion.proceso_adopcion,
          [],
        ),

        concientizacion: parseJsonField(
          configuracion.concientizacion,
          [],
        ),

        footer: parseJsonField(
          configuracion.footer,
          {},
        ),

        fecha_actualizacion:
          configuracion.fecha_actualizacion,

        animales_destacados: destacadosResults,
      })
    })
  })
})


// ==========================
// ✏️ ACTUALIZAR CONTENIDO LANDING
// ==========================

app.put(
  "/landing",
  verificarTokenAdmin,
  (req, res) => {
    console.log("✅ PUT /landing recibido")
    console.log("Contenido recibido:", req.body)

    const {
      hero,
      proposito,
      proceso_adopcion,
      concientizacion,
      footer,
    } = req.body

    if (
      !hero ||
      !Array.isArray(proposito) ||
      !Array.isArray(proceso_adopcion) ||
      !Array.isArray(concientizacion) ||
      !footer
    ) {
      return res.status(400).json({
        error: "Los datos del landing están incompletos.",
      })
    }

    const valores = [
      JSON.stringify(hero),
      JSON.stringify(proposito),
      JSON.stringify(proceso_adopcion),
      JSON.stringify(concientizacion),
      JSON.stringify(footer),
    ]

    const sqlActualizar = `
      UPDATE configuracion_landing
      SET
        hero = ?,
        proposito = ?,
        proceso_adopcion = ?,
        concientizacion = ?,
        footer = ?
      WHERE id = 1
    `

    db.query(
      sqlActualizar,
      valores,
      (errorActualizar, resultado) => {
        if (errorActualizar) {
          console.error(
            "ERROR SQL ACTUALIZANDO LANDING:",
            errorActualizar,
          )

          return res.status(500).json({
            error:
              errorActualizar.sqlMessage ||
              errorActualizar.message ||
              "No se pudo actualizar el landing.",
          })
        }

        console.log(
          "Resultado UPDATE landing:",
          resultado,
        )

        if (resultado.affectedRows > 0) {
          return res.json({
            message: "Landing actualizado correctamente.",
          })
        }

        const sqlInsertar = `
          INSERT INTO configuracion_landing (
            id,
            hero,
            proposito,
            proceso_adopcion,
            concientizacion,
            footer
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `

        db.query(
          sqlInsertar,
          [1, ...valores],
          (errorInsertar) => {
            if (errorInsertar) {
              console.error(
                "ERROR SQL INSERTANDO LANDING:",
                errorInsertar,
              )

              return res.status(500).json({
                error:
                  errorInsertar.sqlMessage ||
                  errorInsertar.message ||
                  "No se pudo crear el contenido del landing.",
              })
            }

            return res.status(201).json({
              message: "Landing creado correctamente.",
            })
          },
        )
      },
    )
  },
)






























// ==========================
// 🐾 AGREGAR ANIMAL DESTACADO
// ==========================

app.post(
  "/landing/destacados",
  verificarTokenAdmin,
  (req, res) => {
  const {
    animal_id,
    imagen_sin_fondo_url,
    orden,
  } = req.body

  const animalId = Number(animal_id)
  const ordenDestacado = Number(orden)

  if (
    !Number.isInteger(animalId) ||
    animalId <= 0
  ) {
    return res.status(400).json({
      error: "El animal seleccionado no es válido",
    })
  }

  if (
    typeof imagen_sin_fondo_url !== "string" ||
    !imagen_sin_fondo_url.trim()
  ) {
    return res.status(400).json({
      error: "La imagen sin fondo es obligatoria",
    })
  }

  const buscarAnimalSql = `
    SELECT id, nombre, estado
    FROM animales
    WHERE id = ?
    LIMIT 1
  `

  db.query(
    buscarAnimalSql,
    [animalId],
    (animalError, animalResults) => {
      if (animalError) {
        console.error(
          "Error verificando animal destacado:",
          animalError,
        )

        return res.status(500).json({
          error: "No se pudo verificar el animal",
        })
      }

      if (animalResults.length === 0) {
        return res.status(404).json({
          error: "El animal seleccionado no existe",
        })
      }

      const sql = `
        INSERT INTO landing_animales_destacados
        (
          animal_id,
          imagen_sin_fondo_url,
          orden
        )
        VALUES (?, ?, ?)
      `

      db.query(
        sql,
        [
          animalId,
          imagen_sin_fondo_url.trim(),
          Number.isInteger(ordenDestacado) &&
          ordenDestacado > 0
            ? ordenDestacado
            : 1,
        ],
        (err, result) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              return res.status(409).json({
                error:
                  "Este animal ya está seleccionado como destacado",
              })
            }

            console.error(
              "Error agregando animal destacado:",
              err,
            )

            return res.status(500).json({
              error: "No se pudo agregar el animal destacado",
            })
          }

          res.json({
            message:
              "Animal destacado agregado correctamente",
            id: result.insertId,
          })
        },
      )
    },
  )
},)


// ==========================
// ✏️ ACTUALIZAR ANIMAL DESTACADO
// ==========================

app.put(
  "/landing/destacados/:id",
  verificarTokenAdmin,
  (req, res) => {
      const destacadoId = Number(req.params.id)

  const {
    imagen_sin_fondo_url,
    orden,
  } = req.body

  if (
    !Number.isInteger(destacadoId) ||
    destacadoId <= 0
  ) {
    return res.status(400).json({
      error: "El destacado indicado no es válido",
    })
  }

  if (
    typeof imagen_sin_fondo_url !== "string" ||
    !imagen_sin_fondo_url.trim()
  ) {
    return res.status(400).json({
      error: "La imagen sin fondo es obligatoria",
    })
  }

  const ordenDestacado = Number(orden)

  const sql = `
    UPDATE landing_animales_destacados
    SET
      imagen_sin_fondo_url = ?,
      orden = ?
    WHERE id = ?
  `

  db.query(
    sql,
    [
      imagen_sin_fondo_url.trim(),
      Number.isInteger(ordenDestacado) &&
      ordenDestacado > 0
        ? ordenDestacado
        : 1,
      destacadoId,
    ],
    (err, result) => {
      if (err) {
        console.error(
          "Error actualizando animal destacado:",
          err,
        )

        return res.status(500).json({
          error:
            "No se pudo actualizar el animal destacado",
        })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: "Animal destacado no encontrado",
        })
      }

      res.json({
        message:
          "Animal destacado actualizado correctamente",
      })
    },
  )
},)


// ==========================
// 🗑 QUITAR ANIMAL DESTACADO
// ==========================

app.delete(
  "/landing/destacados/:id",
  verificarTokenAdmin,
  (req, res) => {
    const destacadoId = Number(req.params.id)

  if (
    !Number.isInteger(destacadoId) ||
    destacadoId <= 0
  ) {
    return res.status(400).json({
      error: "El destacado indicado no es válido",
    })
  }

  const sql = `
    DELETE FROM landing_animales_destacados
    WHERE id = ?
  `

  db.query(
    sql,
    [destacadoId],
    (err, result) => {
      if (err) {
        console.error(
          "Error eliminando animal destacado:",
          err,
        )

        return res.status(500).json({
          error:
            "No se pudo quitar el animal destacado",
        })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: "Animal destacado no encontrado",
        })
      }

      res.json({
        message:
          "Animal destacado eliminado correctamente",
      })
    },
  )
},)


// ==========================
// CREAR SOLICITUD DE ADOPCIÓN
// ==========================

app.post("/solicitudes-adopcion", (req, res) => {
  const {
    animal_id,
    nombre_completo,
    telefono,
  } = req.body;

  if (
    !animal_id ||
    !nombre_completo ||
    !telefono
  ) {
    return res.status(400).json({
      error: "Todos los campos son obligatorios.",
    });
  }

  const sql = `
    INSERT INTO solicitudes_adopcion
    (
      animal_id,
      nombre_completo,
      telefono
    )
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [
      animal_id,
      nombre_completo,
      telefono,
    ],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          error:
            "No se pudo registrar la solicitud.",
        });
      }

      res.status(201).json({
        message:
          "Solicitud enviada correctamente.",
        id: result.insertId,
      });
    }
  );
});

// ==========================
// OBTENER SOLICITUDES DE ADOPCIÓN
// ==========================

app.get(
  "/solicitudes-adopcion",
  verificarTokenAdmin,
  (req, res) => {

    const sql = `
      SELECT
        sa.*,
        a.nombre AS nombre_animal,
        a.multimedia
      FROM solicitudes_adopcion sa
      INNER JOIN animales a
        ON sa.animal_id = a.id
      ORDER BY sa.fecha_solicitud DESC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          error:
            "No se pudieron obtener las solicitudes.",
        });
      }

      console.log(results[0]);
res.json(results);
    });
  }
);

// ==========================
// OBTENER SOLICITUD DE ADOPCIÓN
// ==========================

app.get(
  "/solicitudes-adopcion/:id",
  verificarTokenAdmin,
  (req, res) => {

    const { id } = req.params;

    const sql = `
      SELECT
        sa.*,
        a.nombre AS nombre_animal,
        a.multimedia
      FROM solicitudes_adopcion sa
      INNER JOIN animales a
        ON sa.animal_id = a.id
      WHERE sa.id = ?
    `;

    db.query(sql, [id], (err, results) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          error:
            "No se pudo obtener la solicitud.",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          error: "Solicitud no encontrada.",
        });
      }

      res.json(results[0]);

    });
  }
);

// ==========================
// ACTUALIZAR ESTADO
// ==========================

app.patch(
  "/solicitudes-adopcion/:id",
  verificarTokenAdmin,
  (req, res) => {

    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = [
      "nueva",
      "contactado",
      "finalizada",
    ];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        error: "Estado no válido.",
      });
    }

    const sql = `
      UPDATE solicitudes_adopcion
      SET estado = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [estado, id],
      (err) => {

        if (err) {
          console.error(err);

          return res.status(500).json({
            error:
              "No se pudo actualizar el estado.",
          });
        }

        res.json({
          message:
            "Estado actualizado correctamente.",
        });

      }
    );
  }
);

// ==========================
// ELIMINAR SOLICITUD DE ADOPCIÓN
// ==========================

app.delete(
  "/solicitudes-adopcion/:id",
  verificarTokenAdmin,
  (req, res) => {

    const { id } = req.params;

    const sql = `
      DELETE FROM solicitudes_adopcion
      WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          error: "No se pudo eliminar la solicitud.",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: "Solicitud no encontrada.",
        });
      }

      res.json({
        message: "Solicitud eliminada correctamente.",
      });

    });

  }
);

// ==========================
// 🚀 SERVER
// ==========================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`)
})