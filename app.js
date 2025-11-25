// app.js

const express = require('express');
const bodyParser = require('body-parser');

const ProductManager = require('./managers/ProductManager');
const CartManager = require('./managers/CartManager');

const productManager = new ProductManager('./products.json');
const cartManager = new CartManager('./carts.json');

const app = express();
app.use(bodyParser.json());

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static('.'));

// Ignorar solicitudes a favicon.ico para evitar 404
app.get('/favicon.ico', (req, res) => res.status(204).end());

const productsRouter = express.Router();
const cartsRouter = express.Router();

// Rutas para productos
productsRouter.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

productsRouter.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

productsRouter.post('/', async (req, res) => {
  try {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
    const newProduct = await productManager.addProduct({ title, description, code, price, status, stock, category, thumbnails });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

productsRouter.put('/:pid', async (req, res) => {
  try {
    const updates = req.body;
    const updatedProduct = await productManager.updateProduct(req.params.pid, updates);
    res.json(updatedProduct);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  try {
    await productManager.deleteProduct(req.params.pid);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Rutas para carritos
cartsRouter.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear carrito' });
  }
});

cartsRouter.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    res.json(updatedCart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Montar routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Iniciar servidor
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});