import { Link } from "react-router-dom";
import { useState } from "react";
import PolicyModals, { PolicyType } from "../policy-contents/PolicyType";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [activePolicy, setActivePolicy] = useState<PolicyType>(null);
    
    const handlePolicyClick = (policyType: PolicyType) => (e: React.MouseEvent) => {
        e.preventDefault();
        setActivePolicy(policyType);
    };
    
    const handleClosePolicy = () => {
        setActivePolicy(null);
    };
    
    return (
        <>
            <footer className="bg-gradient-to-r from-orange-300 to-orange-500 py-8 sm:py-10 px-4 shadow-inner">
                <div className="container mx-auto flex flex-col gap-8 max-w-7xl">
                    {/* Main footer content */}
                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-4 justify-between items-center">
                        <div className="flex flex-col items-center sm:items-start gap-2">
                            <span className="text-2xl sm:text-3xl text-white font-bold tracking-tight">
                                SunsetView.com
                            </span>
                            <p className="text-white/90 text-sm max-w-xs text-center sm:text-left">
                                Find your perfect getaway with stunning sunset views and unforgettable experiences.
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8 sm:gap-12">
                            <div className="flex flex-col gap-3 items-center sm:items-start">
                                <h3 className="text-white font-bold text-lg">Explore</h3>
                                <div className="flex flex-col sm:flex-col gap-3 text-center sm:text-left">
                                    <Link to="/hotels" className="text-white/90 hover:text-white transition-colors text-sm">
                                        All Hotels
                                    </Link>
                                    <Link to="/featured" className="text-white/90 hover:text-white transition-colors text-sm">
                                        Featured Stays
                                    </Link>
                                    <Link to="/deals" className="text-white/90 hover:text-white transition-colors text-sm">
                                        Special Deals
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-3 items-center sm:items-start">
                                <h3 className="text-white font-bold text-lg">Company</h3>
                                <div className="flex flex-col sm:flex-col gap-3 text-center sm:text-left">
                                    <Link to="/about" className="text-white/90 hover:text-white transition-colors text-sm">
                                        About Us
                                    </Link>
                                    <Link to="/contact" className="text-white/90 hover:text-white transition-colors text-sm">
                                        Contact
                                    </Link>
                                    <Link to="/careers" className="text-white/90 hover:text-white transition-colors text-sm">
                                        Careers
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social icons */}
                    <div className="flex justify-center gap-6 py-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-colors border border-white/30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                            </svg>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-colors border border-white/30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                            </svg>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-colors border border-white/30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                    </div>

                    {/* Legal and copyright */}
                    <div className="border-t border-white/30 pt-6 mt-2">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
                                <a 
                                    href="#" 
                                    onClick={handlePolicyClick('privacy')}
                                    className="text-white/80 hover:text-white text-sm cursor-pointer"
                                >
                                    Privacy Policy
                                </a>
                                <a 
                                    href="#" 
                                    onClick={handlePolicyClick('terms')}
                                    className="text-white/80 hover:text-white text-sm cursor-pointer"
                                >
                                    Terms of Service
                                </a>
                                <a 
                                    href="#" 
                                    onClick={handlePolicyClick('cookies')}
                                    className="text-white/80 hover:text-white text-sm cursor-pointer"
                                >
                                    Cookie Policy
                                </a>
                            </div>
                            
                            <p className="text-white/80 text-sm">
                                © {currentYear} SunsetView.com. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
            
            {/* Policy Modals */}
            <PolicyModals activePolicy={activePolicy} onClose={handleClosePolicy} />
        </>
    );
};

export default Footer;