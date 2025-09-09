import { useNavigate } from "react-router-dom";
import Typewriter from "../components/Typewriter";

export default function Index() {
    const navigate = useNavigate();

    return (
        <>
            <div className="font-pressStart w-screen h-screen bg-black flex justify-center items-center text-white flex-col">
                <Typewriter
                    text="Welcome to Web Pong!"
                    speed={150}
                    className="text-5xl text-center"
                />

                <div className="mt-16 flex flex-col space-y-4 text-center text-2xl">
                    <div className="text-white hover:text-blue-400 cursor-pointer"
                        onClick={() => navigate('/single-player')}>
                        Play Single Player
                    </div>
                    <div className="text-white hover:text-blue-400 cursor-pointer"
                        onClick={() => navigate('/local-multiplayer')}>
                        Play Local Multiplayer
                    </div>
                    <div className="text-white hover:text-blue-400 cursor-pointer"
                        onClick={() => navigate('/about')}>
                        About the site
                    </div>
                </div>
            </div >
        </>
    );
}