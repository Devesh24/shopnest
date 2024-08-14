"use server"

import { connectToDatabase } from "../database"
import Product from "../database/models/product.model"
import { handleError } from "../utils"

// To add a new product into the database
export const createProduct = async (product) => {
    try {
        await connectToDatabase()

        const newProduct = await Product.create(product)
        if(!newProduct) throw new Error("Product Insertion failed");
        return JSON.parse(JSON.stringify(newProduct))
    } catch (error) {
        handleError(error)
    }
}

// To get all products based on the search query
export const getAllProducts = async (query) => {
    try {
        await connectToDatabase()

        // condition to match title with the search query
        const condition = query ? { title: { $regex: query, $options: 'i' } } : {}

        const products = await Product.find(condition)
        return JSON.parse(JSON.stringify(products))
    } catch (error) {
        handleError(error)
    }
}

// To get all products inside the user cart
export const getCartProducts = async (cart) => {
    try {
        await connectToDatabase()

        // create an array of productIds from the cartData
        const productIds = cart.map(item => item.productId);
        
        // fetching all the products which matches the productIds
        const products = await Product.find({ _id: { $in: productIds } })
        return JSON.parse(JSON.stringify(products))
    } catch (error) {
        handleError(error)
    }
}