const express = require('express');

module.exports = (productManager) => { // Recibir productManager como parámetro
    const router = express.Router();

    // Ruta para home.handlebars (lista estática de productos)
    router.get('/', async (req, res) => {
        try {
            const products = await productManager.getProducts();
            res.render('home', { products });
        } catch (error) {
            res.status(500).send('Error al cargar productos');
        }
    });

    // Ruta para realTimeProducts.handlebars (lista con WebSockets)
    router.get('/realtimeproducts', (req, res) => {
        res.render('realTimeProducts');
    });

    return router;
};