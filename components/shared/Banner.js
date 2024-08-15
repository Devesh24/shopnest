"use client"

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

// HOME PAGE BANNER
const Banner = () => {
  return (
    <div className='relative top-0 w-full h-[70vh] md:h-screen bg-cover bg-center text-white flex justify-center lg:justify-start items-center' style={{backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0)), linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/assets/images/home.jpg')"}}>
        <Carousel opts={{loop: true}} plugins={[Autoplay({ delay: 5000 })]} className="mt-20">
            <CarouselContent className="w-[90vw] md:w-[60vw] py-10">
                <CarouselItem className="flex-center flex-col">
                    <div className="border-s-8 ps-5 md:ps-10">
                        <p className="h1-bolder">SHOPNEST</p>
                        <p className="h2-bold tracking-wide md:tracking-widest">Nest Your Style</p>
                    </div>
                </CarouselItem>
                <CarouselItem className="flex-center flex-col">
                    <div className="border-s-8 ps-5 md:ps-10">
                        <p className="h1-bolder">SHOPNEST</p>
                        <p className="h2-bold tracking-widest">Discover, Shop, Smile</p>
                    </div>
                </CarouselItem>
                <CarouselItem className="flex-center flex-col">
                    <div className="border-s-8 ps-5 md:ps-10">
                        <p className="h1-bolder">SHOPNEST</p>
                        <p className="h2-bold tracking-widest">Where Deals Nest</p>
                    </div>
                </CarouselItem>
            </CarouselContent>
        </Carousel>
    </div>
  )
}

export default Banner