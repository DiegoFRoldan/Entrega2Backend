const express = require('express');
const CartManager = require('../managers/CartManager');

const router = express.Router();
const cartManager = new CartManager('./carts.json');

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(parseInt(cid));
        res.json(cart.products);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.addProductToCart(parseInt(cid), parseInt(pid));
        res.json(updatedCart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;