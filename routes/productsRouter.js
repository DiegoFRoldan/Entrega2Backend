const express = require('express');
const ProductManager = require('../managers/ProductManager');

module.exports = (io) => { // Recibir io como parámetro
    const router = express.Router();
    const productManager = new ProductManager('./products.json');

    router.get('/', async (req, res) => {
        try {
            const products = await productManager.getProducts();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/:pid', async (req, res) => {
        try {
            const { pid } = req.params;
            const product = await productManager.getProductById(parseInt(pid));
            res.json(product);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

    router.post('/', async (req, res) => {
        try {
            const newProduct = await productManager.addProduct(req.body);
            // Emitir actualización a todos los clientes conectados
            const products = await productManager.getProducts();
            io.emit('updateProducts', products);
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.put('/:pid', async (req, res) => {
        try {
            const { pid } = req.params;
            const updatedProduct = await productManager.updateProduct(parseInt(pid), req.body);
            res.json(updatedProduct);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

    router.delete('/:pid', async (req, res) => {
        try {
            const { pid } = req.params;
            await productManager.deleteProduct(parseInt(pid));
            // Emitir actualización a todos los clientes conectados
            const products = await productManager.getProducts();
            io.emit('updateProducts', products);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

    return router;
};