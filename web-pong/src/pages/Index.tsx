import Typewriter from "../components/Typewriter";

export default function Index() {
    return (
        <>
            <div className="font-pressStart w-screen h-screen bg-black flex justify-center items-center text-white flex-col">
                <Typewriter
                    text="Welcome to Web Pong!"
                    speed={150}
                    className="text-3xl text-center"
                />

                <div className="mt-16 flex flex-col space-y-4 text-center">
                    <div className="text-white hover:text-blue-400 cursor-pointer">
                        Play Single Player
                    </div>
                    <div className="text-white hover:text-blue-400 cursor-pointer">
                        Play Local Multiplayer
                    </div>
                </div>
            </div>
        </>
    );
}