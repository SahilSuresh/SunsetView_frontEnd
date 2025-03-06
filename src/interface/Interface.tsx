import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

interface Props {
    children: React.ReactNode;
}

const Interface = ({children}: Props) => {
    
    
    return ( 
     // to align all the elements into a column using flex box and make sure app take whole screen   
    <div className="flex flex-col h-[100vh]">
        <Header />
        <Hero />
        <div className="container mx-auto py-10 flex-1 max-w-7xl">
            {children}
        </div>
        <div className="justify-end">
            <Footer />
        </div>
    </div>
    );
};
export default Interface;