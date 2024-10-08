"use client"

import { getAllProducts } from "@/lib/actions/product.actions"
import { useEffect, useRef, useState } from "react"
import ProductCard from "./ProductCard"
import { getUserCart, updateUserCart } from "@/lib/actions/user.actions"
import Search from "./Search"
import { useUser } from "@clerk/nextjs"

const Products = ({setCartCount}) => {
    const [query, setQuery] = useState("") //search query
    const { isSignedIn, user } = useUser(); // clerk hook, to check if user is signed in or not
    
    const [userId, setUserId] = useState("") //id of the logged in user
    const [cart, setCart] = useState([]) //cart details

    useEffect(() => {
        // if user is logged in, fetch the user cart using clerk id
        if(isSignedIn && user)
        {
            const fetchData = async () => {
                try {
                    const data = await getUserCart(user.id)
                    setCart(data.cart)
                    setUserId(data.userId)
                } catch (error) {
                    console.log(error);
                }
            }
            fetchData()
        }
    },[user])
    
    const [productData, setProductData] = useState([]) //store data of all products based on search query
    useEffect(() => {
        // fetch data of all products based on search query
        const fetchData = async () => {
            try {
                const data = await getAllProducts(query)
                setProductData(data)
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    },[query])

    //to stop this useffect from running on initial render, becuase it sets the cart values to []
    const hasPageBeenRendered = useRef(false) 
    useEffect(() => {
        // if user is logged in and there is a change in cart value, update the user cart in the database
        if(isSignedIn && hasPageBeenRendered.current)
        {
            const updateUser = async () => {
                try {
                    const updatedUser = await updateUserCart(userId, cart)
                } catch (error) {
                    console.log(error);
                }
            }
            updateUser()
            setCartCount(cart.length) //to send to navbar for count update on cart icon
        }
        hasPageBeenRendered.current = true
    },[cart])

  return (
    <div className="wrapper my-10 flex-between flex-col gap-6">
        <Search placeholder={"Search Products..."} setQuery={setQuery} />
        <div className='flex justify-center flex-wrap gap-1 lg:gap-6'>
            {
                productData.length === 0 ? <h2 className="p-bold-24 text-blue-950 my-6">NO PRODUCTS FOUND</h2> :
                productData.map((product) => (
                    <ProductCard key={product._id} product={product} userId={userId} cart={cart} setCart={setCart} />
                ))
            }
        </div>
    </div>
  )
}

export default Products