"use server"

import { connectToDatabase } from "../database"
import Coupen from "../database/models/coupen.model"
import { handleError } from "../utils"

// To check if the applied coupen is valid or not
export const matchCoupen = async (coupen) => {
    try {
        await connectToDatabase()
        const coupenDetails = await Coupen.findOne({code: coupen})
        
        if(!coupenDetails) {
            return JSON.parse(JSON.stringify({
                found: 0,
                data: {}
            }))
        }
        else {
            return JSON.parse(JSON.stringify({
                found: 1,
                data: coupenDetails
            }))
        }
    } catch (error) {
        handleError(error)
    }
}