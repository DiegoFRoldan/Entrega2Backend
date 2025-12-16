const express = require('express');
const { engine } = require('express-handlebars');
const { Server } = require('socket.io');
const http = require('http');
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');
const viewsRouter = require('./routes/viewsRouter');
const ProductManager = require('./managers/ProductManager');

const app = express();
const PORT = 8080;

// Configurar Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middlewares
app.use(express.json());
app.use(express.static('.')); // Servir archivos estáticos (incluyendo socket.io.js)

// Crear servidor HTTP y Socket.IO
const server = http.createServer(app);
const io = new Server(server);

// Instancia de ProductManager para acceder a productos en WebSockets
const productManager = new ProductManager('./products.json');

// Configurar WebSockets
io.on('connection', async (socket) => {
    console.log('Cliente conectado:', socket.id);
    
    // Enviar la lista inicial de productos al conectar
    const products = await productManager.getProducts();
    socket.emit('updateProducts', products);
    
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// Rutas
app.use('/api/products', productsRouter(io)); // Pasar io al router
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter(productManager)); // Pasar productManager al router de vistas

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});