import Image from "next/image";

export const LandingImage = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex items-center">
                <div className="relative w-[400px] h-[400px]">
                    <img src="/landing.jpg" alt="" />
                </div>
            </div>
        </div>
    );
}