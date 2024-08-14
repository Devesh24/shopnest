import Image from 'next/image'

const Footer = () => {
  return (
    <footer className='bg-blue-950 text-white md:overflow-hidden'>
        <div className='wrapper flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 text-center'>
            <p className='p-regular-14 flex justify-center'>Copyright © ShopNest 2024. All rights reserved</p>
            <Image src={"/assets/images/payment-method.svg"} alt='payment-methods' width={400} height={60} />
        </div>
    </footer>
  )
}

export default Footer