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

// Llama a la función con datos de ejemplo
insertarUsuario('Carlos', 'carlos@example.com');
