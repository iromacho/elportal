const express = require('express');
const pool = require('./db');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

// Rutas aquí

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));




const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;


// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'launchers')));
app.use(express.static(path.join(__dirname, 'm')));
app.use(express.static(path.join(__dirname, 'logos')));

// Middleware para procesar formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inicio.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/nos', (req, res) => {
    res.sendFile(path.join(__dirname, 'm', 'nos.html'));
});

app.get('/ser', (req, res) => {
    res.sendFile(path.join(__dirname, 'm', 'ser.html'));
});

app.get('/launcher', (req, res) => {
    res.sendFile(path.join(__dirname, 'launchers', 'launcher.html'));
});

app.get('/imgminec', (req, res) => {
    res.sendFile(path.join(__dirname, 'logos', 'minecraft.png'));
});
app.get('/geometry', (req, res) => {
    res.sendFile(path.join(__dirname, 'launchers', 'geometry.html'));
});
app.get('/geom-logo', (req, res) => {
    res.sendFile(path.join(__dirname, 'logos', 'geom.png'));
});
app.get('/hopping', (req, res) => {
    res.sendFile(path.join(__dirname, 'launchers', 'hopping.html'));
});
app.get('/hoop-img', (req, res) => {
    res.sendFile(path.join(__dirname, 'logos', 'hoop.png'));
});
app.get('/mario', (req, res) => {
    res.sendFile(path.join(__dirname, 'launchers', 'mario.html'));
});
app.get('/mario-img', (req, res) => {
    res.sendFile(path.join(__dirname, 'logos', 'mario.png'));
});

// Ruta POST para guardar usuarios en usuarios.txt
app.post('/registro', (req, res) => {
    const { nombre, email } = req.body;

    const linea = `Nombre: ${nombre}, Email: ${email}\n`;

    fs.appendFile('usuarios.txt', linea, (err) => {
        if (err) {
            console.error('Error al guardar el usuario:', err);
            return res.status(500).send('Error al guardar el usuario');
        }
        console.log('Usuario guardado');
        res.send('Registro exitoso');
    });
});

app.post('/login', (req, res) => {
    const { email } = req.body;

    // Leer archivo usuarios.txt para ver si el email existe
    fs.readFile('usuarios.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer usuarios:', err);
            return res.status(500).send('Error en el servidor');
        }

        // Comprobar si el email está registrado
        const existe = data.includes(email);

        if (existe) {
            res.send('<h2>Login correcto</h2><a href="/index">Ir al inicio</a>');       //--> esto hay que cambiarlo por Ir al inicio <--\\
        } else {
            res.send('<h2>Email no registrado</h2><a href="/signup">Volver al login</a>');
        }
    });
});


// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.post('/signup', async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    // Verificar que todos los campos estén presentes
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar en la base de datos
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contraseña) VALUES ($1, $2, $3) RETURNING *',
      [nombre, correo, hashedPassword]
    );

    res.status(201).json({
      message: "Usuario registrado con éxito",
      user: { id: result.rows[0].id, nombre: result.rows[0].nombre }
    });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // Código de error para correo duplicado
      res.status(400).json({ error: "El correo ya está registrado" });
    } else {
      res.status(500).json({ error: "Error del servidor" });
    }
  }
});



//hola

app.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    // Verificar que todos los campos estén presentes
    if (!correo || !contraseña) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Buscar al usuario en la base de datos
    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const usuario = result.rows[0];

    // Comparar la contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!contraseñaValida) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: { id: usuario.id, nombre: usuario.nombre }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});


