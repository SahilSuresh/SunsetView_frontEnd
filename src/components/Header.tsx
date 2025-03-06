import { Link }  from "react-router-dom";

const Header = () => { 
    return (
        <div className="bg-orange-600 py-6 px-6">
            <div className="container mx-auto flex justify-between max-w-7xl">
                <span className="text-3xl text-white font-bold ">
                    <Link to="/">SunsetView.com</Link>
                </span>
                <span className="flex space-x-2">
                    <Link to="/sign-in" className="flex bg-white items-center text-orange-400 px-4 font-bold hover:bg-orange-400 hover:text-white rounded-[20px]">
                    Sign In
                    </Link>
                </span>
            </div>
        </div>
    );
}

export default Header;