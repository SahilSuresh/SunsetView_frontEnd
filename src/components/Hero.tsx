import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-12 sm:py-16 md:py-4">
            <div className="container mx-auto flex flex-col gap-4 max-w-7xl px-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl text-white font-bold leading-tight">
                    Your Next Adventure Awaits
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-orange-100">
                    Find Your Perfect Stay at the Best Price...
                </p>
                <div className="mt-6">
                    <button className="bg-white text-orange-600 px-6 py-3 rounded-full font-bold text-lg hover:bg-orange-100 transition-colors shadow-md">
                        <Link to="/">Explore Hotels</Link>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Hero;