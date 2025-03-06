const Footer = () => {
    return (
        <footer className="bg-orange-600 py-10">
            <div className="container mx-auto flex flex-col sm:flex-row gap-3 justify-between items-center max-w-7xl">
                <span className="text-3xl text-white font-bold tracking-tight">
                    SunsetView.com
                </span>
                <span className="text-white font-bold tracking-tight flex gap-4">
                    <p className="cursor-pointer hover:underline hover:decoration-3">Privacy Policy</p>
                    <p className="cursor-pointer hover:underline hover:decoration-3">Terms of Service</p>
                </span>
            </div>
            <div>
                <p className="text-white font-bold text-center pt-10">Copyright © 2025</p>
            </div>
        </footer>
    )
}

export default Footer;