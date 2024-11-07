import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { LandingImage } from "./_components/landingimage";

const LandingPage = () => {
  return ( 
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
        <Heading />
        <LandingImage />
      </div>
      <div className="border-b border-gray-200">
        <Footer />
      </div>
    </div>
   );
}
 
export default LandingPage;
