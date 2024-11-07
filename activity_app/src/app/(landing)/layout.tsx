import { Navbar } from "./_components/navbar";

const LandingLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return ( 
        <div className="h-full">
            <div className="border-b border-gray-200">
                <Navbar />
            </div>
            <main className="h-full pt-10">
                {children}
            </main>
        </div>
     );
}
 
export default LandingLayout;