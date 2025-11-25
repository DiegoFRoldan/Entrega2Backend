const express = require('express');
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});