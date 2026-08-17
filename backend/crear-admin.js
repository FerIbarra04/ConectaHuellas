require("dotenv").config()

const bcrypt = require("bcryptjs")
const db = require("./db")

const crearAdmin = async () => {
  try {
    const username = process.env.ADMIN_USERNAME
    const password = process.env.ADMIN_PASSWORD

    if (!username || !password) {
      console.error(
        "Faltan ADMIN_USERNAME o ADMIN_PASSWORD en el archivo .env",
      )
      process.exit(1)
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const sql = `
      INSERT INTO usuarios_admin
      (username, password_hash)
      VALUES (?, ?)
    `

    db.query(
      sql,
      [username, passwordHash],
      (error, result) => {
        if (error) {
          if (error.code === "ER_DUP_ENTRY") {
            console.error(
              "Ya existe un administrador con ese nombre de usuario.",
            )
          } else {
            console.error(
              "Error creando administrador:",
              error,
            )
          }

          process.exit(1)
        }

        console.log("✅ Administrador creado correctamente")
        console.log(`ID: ${result.insertId}`)
        console.log(`Usuario: ${username}`)

        process.exit(0)
      },
    )
  } catch (error) {
    console.error(
      "Error inesperado creando administrador:",
      error,
    )

    process.exit(1)
  }
}

crearAdmin()