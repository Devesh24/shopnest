import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Tailwind utility function to merge classnames
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Utility function to handle error on server side
export const handleError = (error) => {
  console.error(error)
  throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
}

// Utility function to calculate price after discount
export const calculateDiscount = (price, discountPercent) => {
    const discount = price * discountPercent / 100;
    return Math.floor(price - discount);
}