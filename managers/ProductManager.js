const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor(filePath) {
        this.filePath = path.resolve(filePath);
        this.products = [];
        this.nextId = 1;
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                this.nextId = Math.max(...this.products.map(p => p.id)) + 1;
            }
        } catch (error) {
            this.products = [];
        }
    }

    async saveProducts() {
        await fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2));
    }

    async getProducts() {
        return this.products;
    }

    async getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) throw new Error('Producto no encontrado');
        return product;
    }

    async addProduct(productData) {
        const { title, description, code, price, status = true, stock, category, thumbnails = [] } = productData;
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Todos los campos obligatorios deben estar presentes');
        }
        const newProduct = {
            id: this.nextId++,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        };
        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct;
    }

    async updateProduct(id, updates) {
        const productIndex = this.products.findIndex(p => p.id === id);
        if (productIndex === -1) throw new Error('Producto no encontrado');
        const updatedProduct = { ...this.products[productIndex], ...updates, id }; // No cambiar el ID
        this.products[productIndex] = updatedProduct;
        await this.saveProducts();
        return updatedProduct;
    }

    async deleteProduct(id) {
        const productIndex = this.products.findIndex(p => p.id === id);
        if (productIndex === -1) throw new Error('Producto no encontrado');
        this.products.splice(productIndex, 1);
        await this.saveProducts();
    }
}

module.exports = ProductManager;