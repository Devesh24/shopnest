"use client"

import { getCartProducts } from "@/lib/actions/product.actions"
import { getUserCart, updateUserCart } from "@/lib/actions/user.actions"
import { useEffect, useRef, useState } from "react"
import ProductCard from "./ProductCard"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { calculateDiscount } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { matchCoupen } from "@/lib/actions/coupen.actions"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"

// CART COMPONENT
const Cart = ({userId, setCartCount}) => {

    const { isSignedIn } = useUser(); // clerk hook, to check if user is signed in or not

    const [cart, setCart] = useState([]) // to store the cart details (only productId and count of each product)
    const [cartItems, setCartItems] = useState([]) // to store the complete product details of the cart items
    const [cartLen, setCartLen] = useState(0) // size of the cart
    const [cartTotalPrice, setCartTotalPrice] = useState(0) // total cart price without discounts
    const [totalAmount, setTotalAmount] = useState(0) // total cart amount with discounts (excluding coupen discount)
    const [coupenDiscount, setCoupenDiscount] = useState(0) // coupen discount
    const [coupenCode, setCoupenCode] = useState("") // coupen code entered by user
    const [coupenDetails, setCoupenDetails] = useState({}) // coupen details fetched from db based on entered coupen code
    const [coupenFound, setCoupenFound] = useState(null) // is coupen valid or not

    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetching the user cart
                const cartData = await getUserCart(userId)
                setCart(cartData.cart)
                setCartLen(cartData.count)
                
                // fetching the complete product details of the cart
                const items = await getCartProducts(cartData.cart)
                setCartItems(items)
                
                // calculating different entities
                let totalPrice = 0, totalAmt = 0
                for(let i=0; i<items.length; i++)
                {
                    const elem = cartData.cart.find(item => item.productId===items[i]._id)
                    totalPrice += items[i].origPrice * elem.count
                    totalAmt += calculateDiscount(items[i].origPrice, items[i].discountInPercent) * elem.count
                }
                setCartTotalPrice(totalPrice)
                setTotalAmount(totalAmt)
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    },[])

    //to stop this useffect from running on initial render, becuase it sets the cart values to []
    const hasPageBeenRendered = useRef(false) 
    useEffect(() => {
        // if user is logged in and there is a change in cart value, update the user cart in the database
        if(isSignedIn && hasPageBeenRendered.current)
        {
            const updateUser = async () => {
                const updatedUser = await updateUserCart(userId, cart)
            }
            updateUser()
            setCartCount(cart.length) //to send to navbar for count update on cart icon
        }
        hasPageBeenRendered.current = true
    },[cart])

    // to handle the click of apply coupen or remove coupen button click
    const handleCoupenSubmit = async () => {
        if(coupenFound !== true) //add coupen and check if valid or not
        {
            try {
                const data = await matchCoupen(coupenCode)
                if(data.found)
                {
                    setCoupenFound(true)
                    setCoupenDetails(data.data)
                    if(data.data.discountType === "flat")
                    {
                        setCoupenDiscount(data.data.discount)
                    }
                    else
                    {
                        setCoupenDiscount(Math.floor(totalAmount*data.data.discount/100))
                    }
                }
                else
                {
                    setCoupenFound(false)
                    setCoupenCode("")
                }
            } catch (error) {
                console.log(error);
            }
        }
        else //remove coupen
        {
            setCoupenFound(null)
            setCoupenCode("")
            setCoupenDiscount(0)
        }
    }

    useEffect(() => {
        // update the coupen discount (in case of percent discounts) if the total amount changes
        if(coupenFound && coupenDetails.type !== "flat")
        {
            setCoupenDiscount(Math.floor(totalAmount*coupenDetails.discount/100))
        }
    },[totalAmount])

  return (
    <div className="wrapper flex flex-col lg:flex-row items-center lg:items-start lg:justify-between">
        {
            cartItems.length == 0 // if cart is empty
            ? 
            <div className="w-full text-center my-12">
                <h2 className="p-bold-24 text-blue-950">OOPS!!</h2>
                <h2 className="p-bold-24 text-blue-950 mb-2">YOUR CART IS EMPTY</h2>
                <Link href={"/"} className="text-sm md:text-base font-bold text-blue-700 hover:underline">Shop Now</Link>
            </div> 
            :
            <>
                <div className="flex justify-center flex-wrap gap-1 lg:gap-6 my-10 lg:w-[55%] xl:w-[60%]">
                    {
                        cartItems.map((item) => (
                            <ProductCard key={item._id} product={item} userId={userId} cart={cart} setCart={setCart} setCartItems={setCartItems} cartItems={cartItems} setTotalAmount={setTotalAmount} setCartTotalPrice={setCartTotalPrice} />
                        ))
                    }
                </div>

                <div className="w-full md:w-[70%] lg:w-[42%] xl:w-[35%] lg:mt-12 flex flex-col gap-3 md:gap-6">
                    <div className="border-2 border-gray-600 rounded-lg w-full flex-center flex-col gap-2 md:gap-3 p-4 h-fit">
                        <h2 className="p-bold-20 md:p-bold-24 text-blue-950">PRICE DETAILS</h2>
                        <Separator className="mb-1 md:mb-2" />
                        <div className="px-3 flex-between w-full md:text-lg">
                            <p>Price ({cartLen} Items)</p>
                            <p className="text-gray-700">₹ {cartTotalPrice}</p>
                        </div>
                        <div className="px-3 flex-between w-full md:text-lg">
                            <p>Product Discount</p>
                            <p className="text-green-700">- ₹ {cartTotalPrice-totalAmount}</p>
                        </div>
                        <div className="px-3 flex-between w-full md:text-lg">
                            <p>Coupen Discount</p>
                            <p className="text-green-700">- ₹ {coupenDiscount}</p>
                        </div>
                        <div className="px-3 flex-between w-full md:text-lg">
                            <p>Delivery Charges</p>
                            <p className="text-blue-700">Free</p>
                        </div>
                        <Separator className="mt-1" />
                        <div className="px-3 flex-between w-full md:text-lg font-bold">
                            <p>Total Amount</p>
                            <p>₹ {totalAmount-coupenDiscount}</p>
                        </div>
                        <Separator className="mb-1" />
                        <div className="px-3 flex-between w-full font-bold tracking-wide md:mb-2 text-sm md:text-base">
                            <p className="text-green-700">You will save ₹ {cartTotalPrice-totalAmount+coupenDiscount} on this order.</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 md:gap-2">
                        <p className={`${coupenFound==true ? 'block' : 'hidden'} text-green-700 ps-3 text-sm md:text-base`}>Congrats!! <span className="font-bold">{coupenCode}</span> Applied</p>
                        <p className={`${coupenFound==false ? 'block' : 'hidden'} text-red-700 ps-3 text-sm md:text-base`}>Invalid Coupen Code!</p>
                        <div className="flex-center gap-4 w-full">
                            <Input className="input-field border-gray-600" value={coupenCode} onChange={(e)=>setCoupenCode(e.target.value)} placeholder="Have a Coupen Code?" disabled={coupenFound ? true : false} />
                            <Button className="md:text-lg p-6" onClick={handleCoupenSubmit}>{coupenFound ? "REMOVE" : "APPLY"}</Button>
                        </div>
                    </div>
                    
                    <Button className="bg-orange-500 text-lg md:text-2xl h-[8vh] md:h-[10vh] font-bold hover:bg-orange-600 mb-12">PLACE ORDER</Button>
                </div>
            </>
        }
    </div>
  )
}

export default Cart