"use client"

import { Button } from '../ui/button'
import { calculateDiscount } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// THIS COMPONENT IS USED BOTH IN PRODUCTS PAGE AND CART PAGE
// setCartItems, cartItems, setTotalAmount, setCartTotalPrice props are only passed from the cart page
const ProductCard = ({product, userId, cart, setCart, setCartItems, cartItems=null, setTotalAmount=0, setCartTotalPrice=0}) => {
    
    const [inCart, setInCart] = useState(false) // product is in cart or not
    const [inCartProductCount, setInCartProductCount] = useState(0) // count of the product in cart

    useEffect(()=> {
        // find the current product in the cart
        const productInCart = cart ? cart.find(item => item.productId === product._id) : null;

        if(productInCart) // if present
        {
            setInCart(true)
            setInCartProductCount(productInCart.count)
        }
    },[cart])

    const router = useRouter()

    // function to handle 'add to cart' or 'remove from cart' button click
    const handleAddDelete = () => {
        //if user is not logged in and tries to add to cart, redirect to sign in page
        if(!userId) 
        {
            router.push('/sign-in')
            return;
        }

        if(!inCart) //when user presses add to cart button
        {
            setCart(prev => [...prev, {
                productId: product._id,
                count : 1
            }])

            if(cartItems) // if we are on cart page
            {
                // update the cart items details
                setCartItems(prev => [...prev, product]) 
                setTotalAmount(prev => prev + calculateDiscount(product.origPrice, product.discountInPercent))
                setCartTotalPrice(prev => prev + product.origPrice)
            }

            setInCartProductCount(1);
            setInCart(true)
        }
        else //when user presses remove from cart button
        {
            const newCart = cart.filter(item => item.productId !== product._id)
            setCart(newCart)

            if(cartItems) // if we are on cart page
            {
                // update the cart items details
                const newCartItems = cartItems.filter(item => item._id !== product._id)
                setCartItems(newCartItems)
                setTotalAmount(prev => prev - calculateDiscount(product.origPrice, product.discountInPercent)*inCartProductCount)
                setCartTotalPrice(prev => prev - product.origPrice*inCartProductCount)
            }

            setInCartProductCount(0)
            setInCart(false)
        }
    }

    // function to handle '+' or '-' button click
    const handleIncreaseDecrease = (operation) => {
        //if user is not logged in and tries to increase or decrease product count, redirect to sign in page
        if(!userId)
        {
            router.push('/sign-in')
            return;
        }
        
        if(operation === "add") //add product (user clicks + button)
        {
            // increase the count of product in the cart
            const newCart = [...cart]
            const productInCart = newCart ? newCart.find(item => item.productId === product._id) : null;
            if(productInCart)
            {
                productInCart.count = inCartProductCount+1;
                setInCartProductCount(prev => prev+1);
                setCart(newCart)
            }

            if(cartItems) // if we are on cart page
            {
                // update the cart items details
                setTotalAmount(prev => prev + calculateDiscount(product.origPrice, product.discountInPercent))
                setCartTotalPrice(prev => prev + product.origPrice)
            }
        }
        else //decrese product
        {
            // decrease the count of product in the cart
            const newCart = [...cart]
            const productInCart = newCart ? newCart.find(item => item.productId === product._id) : null;
            if(productInCart)
            {
                if(productInCart.count == 1) //if only one is present, delete the product from the cart
                {
                    handleAddDelete()
                }
                else
                {
                    productInCart.count = inCartProductCount-1;
                    setInCartProductCount(prev => prev-1);
                    setCart(newCart)

                    if(cartItems) // if we are on cart page
                    {
                        // update the cart items details
                        setTotalAmount(prev => prev - calculateDiscount(product.origPrice, product.discountInPercent))
                        setCartTotalPrice(prev => prev - product.origPrice)
                    }
                }
            }
        }
    }
    
  return (
    <div className={`${cartItems ? 'w-[48%] lg:w-full' : 'w-[48%]'} h-fit lg:min-h-[35vh] flex flex-col lg:flex-row gap-3 lg:mt-2 hover:shadow-xl transition-shadow duration-500 p-2 border rounded-lg`}>
        <div className='lg:w-[40%] h-[20vh] md:h-[25vh] lg:h-auto bg-cover' style={{backgroundImage: `url(${product.imageUrl})`}} />

        <div className='lg:w-[60%] flex justify-between flex-col p-2 h-[35vh] md:h-[30vh] lg:h-auto'>
            <div>
                <Link href={`/products/${product._id}`}>
                    <p className='text-sm md:text-base lg:text-lg font-extrabold line-clamp-2 hover:underline'>{product.title}</p>
                </Link>
                <p className='text-xs md:text-sm lg:text-base line-clamp-3 text-gray-600'>{product.details}</p>
            </div>
            <div>
                <div className='flex flex-col md:flex-row md:items-center md:gap-3 ps-1'>
                    <div className='flex items-center gap-3'>
                        <p className='md:text-lg text-blue-700 font-bold'>₹ {calculateDiscount(product.origPrice, product.discountInPercent)}</p>
                        <p className='text-sm md:text-base line-through text-gray-600'>{product.origPrice}</p>
                    </div>

                    <p className='text-green-700 text-xs md:text-sm font-bold'>{product.discountInPercent}% Off</p>
                </div>
                <div className='flex flex-col md:flex-row text-center md:items-center gap-2 justify-between mt-2 pe-2'>
                    <Button onClick={handleAddDelete}>{inCart ? "Remove" : "Add To Cart"}</Button>

                    <div className={`${inCart ? 'flex': 'hidden'} justify-between items-center gap-2`}>
                        <Button size="sm" onClick={()=>handleIncreaseDecrease("subtract")} className="bg-gray-200 text-black font-extrabold text-lg hover:bg-gray-300">-</Button>

                        <p className='w-[15%] text-center'>{inCartProductCount}</p>
                        
                        <Button size="sm" onClick={()=>handleIncreaseDecrease("add")} className="bg-gray-200 text-black font-extrabold text-lg hover:bg-gray-300">+</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProductCard