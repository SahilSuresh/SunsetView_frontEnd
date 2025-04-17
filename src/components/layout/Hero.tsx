import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="bg-gradient-to-r from-orange-300 to-orange-500 py-12 sm:py-16 md:py-20">
            <div className="container mx-auto flex flex-col gap-4 max-w-7xl px-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl text-white font-bold leading-tight">
                    Your Next Adventure Awaits
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white/90">
                    Find Your Perfect Stay at the Best Price...
                </p>
                <div className="mt-6">
                    <button className="bg-white text-orange-600 px-6 py-3 rounded-full font-bold text-lg hover:bg-orange-50 transition-colors shadow-md">
                        <Link to="/">Explore Hotels</Link>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Hero;