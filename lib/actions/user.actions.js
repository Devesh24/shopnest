"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "../database"
import User from "../database/models/user.model"
import { handleError } from "../utils"

// to create a new user into the database
export const createUser = async (user) => {
    try{
        await connectToDatabase()

        const newUser = await User.create(user)
        if(!newUser) throw new Error("User Insertion failed");
        return JSON.parse(JSON.stringify(newUser))
    }
    catch(err){
        handleError(err)
    }
}

// to update the user details, search user by clerkId
export const updateUser = async (clerkId, user) => {
    try {
        await connectToDatabase()
        const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
            new: true,
        });
    
        if (!updatedUser) throw new Error("User update failed");
        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        handleError(error)
    }
}

// to delete the user
export const deleteUser = async (clerkId) => {
    try {
        await connectToDatabase()
        const userToDelete = await User.findOne({ clerkId });

        if (!userToDelete) {
            throw new Error("User not found");
        }

        const deletedUser = await User.findByIdAndDelete(userToDelete._id);
        revalidatePath("/");

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (error) {
        handleError(error)
    }
}

// to get the details of the user cart using clerkId
export const getUserCart = async (clerkId) => {
    try {
        await connectToDatabase()
        const user = await User.findOne({clerkId})
        if(!user) {
            throw new Error("User not found!!")
        }
        return JSON.parse(JSON.stringify({
            cart: user.cart,
            count: user.cart.length,
            userId: user._id
        }))
    } catch (error) {
        handleError(error)
    }
}

// to update the user cart
export const updateUserCart = async (id, cart) => {
    try {
        await connectToDatabase()
        const user = await User.findById(id)
        if(!user) {
            throw new Error("User not found!!")
        }
        const newUser = {...user._doc, cart}
        const updatedUser = await User.findByIdAndUpdate(user._id, newUser, {
            new: true,
        });
    
        if (!updatedUser) throw new Error("User update failed");
        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        handleError(error)
    }
}
