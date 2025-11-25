const fs = require('fs').promises;
const path = require('path');

class CartManager {
    constructor(filePath) {
        this.filePath = path.resolve(filePath);
        this.carts = [];
        this.nextId = 1;
        this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.nextId = Math.max(...this.carts.map(c => c.id)) + 1;
            }
        } catch (error) {
            this.carts = [];
        }
    }

    async saveCarts() {
        await fs.writeFile(this.filePath, JSON.stringify(this.carts, null, 2));
    }

    async getCarts() {
        return this.carts;
    }

    async getCartById(id) {
        const cart = this.carts.find(c => c.id === id);
        if (!cart) throw new Error('Carrito no encontrado');
        return cart;
    }

    async createCart() {
        const newCart = {
            id: this.nextId++,
            products: []
        };
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async addProductToCart(cid, pid) {
        const cart = await this.getCartById(cid);
        const productIndex = cart.products.findIndex(p => p.product === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }
        await this.saveCarts();
        return cart;
    }
}

module.exports = CartManager;