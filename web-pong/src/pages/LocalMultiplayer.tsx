import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const H = 500;
const W = 800;
const P_W = 20;
const P_H = 200;
const P1_X = 10;
const P2_X = W - P_W - 10;

export default function LocalMultiplayer() {
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    const [gameState, setGameState] = useState<'setup' | 'playing' | 'gameOver'>('setup');
    const [isPaused, setIsPaused] = useState(false);

    const [player1Name, setPlayer1Name] = useState('Player 1');
    const [player2Name, setPlayer2Name] = useState('Player 2');

    const [p1Points, setP1Points] = useState(0);
    const [p2Points, setP2Points] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);
    const [maxScore, setMaxScore] = useState(5);

    const game = useRef({
        p1_y: H / 2 - P_H / 2,
        p2_y: H / 2 - P_H / 2,
        ball_x: W / 2 - 10,
        ball_y: H / 2 - 10,
        ball_x_orientation: 0,
        ball_y_orientation: 0,
        p1_key: null as number | null,
        p2_key: null as number | null,
        p1_points: 0,
        p2_points: 0,
    });

    useEffect(() => {
        if (gameState !== 'playing' || isPaused || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctxRef.current = ctx;

        let animationFrameId: number;

        const initBall = () => {
            game.current.ball_x = W / 2 - 10;
            game.current.ball_y = H / 2 - 10;
            game.current.ball_x_orientation = Math.random() > 0.5 ? 1 : -1;
            game.current.ball_y_orientation = Math.random() > 0.5 ? 1 : -1;
        };

        const resetGame = () => {
            setP1Points(0);
            setP2Points(0);
            game.current.p1_points = 0;
            game.current.p2_points = 0;
            game.current.p1_y = H / 2 - P_H / 2;
            game.current.p2_y = H / 2 - P_H / 2;
            initBall();
        };

        const drawRect = (x: number, y: number, w: number, h: number, color = "#fff") => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
        };

        const writePoints = () => {
            ctx.font = "50px 'Press Start 2P', monospace";
            ctx.fillStyle = "#fff";
            ctx.fillText(String(game.current.p1_points), W / 4, 50);
            ctx.fillText(String(game.current.p2_points), 3 * (W / 4), 50);
        };

        const draw = () => {
            drawRect(0, 0, W, H, "#000");
            drawRect(P1_X, game.current.p1_y, P_W, P_H);
            drawRect(P2_X, game.current.p2_y, P_W, P_H);
            drawRect(W / 2 - 2.5, 0, 5, H);
            drawRect(game.current.ball_x, game.current.ball_y, 10, 10);
            writePoints();
        };

        const loop = () => {
            if (game.current.p1_key === 87 && game.current.p1_y > 0) game.current.p1_y -= 8;
            if (game.current.p1_key === 83 && game.current.p1_y + P_H < H) game.current.p1_y += 8;
            if (game.current.p2_key === 38 && game.current.p2_y > 0) game.current.p2_y -= 8;
            if (game.current.p2_key === 40 && game.current.p2_y + P_H < H) game.current.p2_y += 8;

            game.current.ball_x += 6 * game.current.ball_x_orientation;
            game.current.ball_y += 6 * game.current.ball_y_orientation;

            if (game.current.ball_y + 10 >= H || game.current.ball_y <= 0) {
                game.current.ball_y_orientation *= -1;
            }

            const ball = game.current;
            if (ball.ball_x < P1_X + P_W && ball.ball_x + 10 > P1_X && ball.ball_y < ball.p1_y + P_H && ball.ball_y + 10 > ball.p1_y) {
                ball.ball_x_orientation = 1;
            } else if (ball.ball_x < P2_X + P_W && ball.ball_x + 10 > P2_X && ball.ball_y < ball.p2_y + P_H && ball.ball_y + 10 > ball.p2_y) {
                ball.ball_x_orientation = -1;
            }

            if (game.current.ball_x + 10 > W) {
                setP1Points(prev => {
                    const newScore = prev + 1;
                    game.current.p1_points = newScore;
                    return newScore;
                });
                initBall();
            } else if (game.current.ball_x < 0) {
                setP2Points(prev => {
                    const newScore = prev + 1;
                    game.current.p2_points = newScore;
                    return newScore;
                });
                initBall();
            }

            draw();
            animationFrameId = requestAnimationFrame(loop);
        };

        const handleKeyDown = (ev: KeyboardEvent) => {
            if (ev.keyCode === 87 || ev.keyCode === 83) game.current.p1_key = ev.keyCode;
            if (ev.keyCode === 38 || ev.keyCode === 40) game.current.p2_key = ev.keyCode;
        };
        const handleKeyUp = (ev: KeyboardEvent) => {
            if (ev.keyCode === 87 || ev.keyCode === 83) game.current.p1_key = null;
            if (ev.keyCode === 38 || ev.keyCode === 40) game.current.p2_key = null;
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        if (!isPaused) {
            resetGame();
            animationFrameId = requestAnimationFrame(loop);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };

    }, [gameState, isPaused]);

    useEffect(() => {
        if (p1Points === 0 && p2Points === 0) return;

        if (p1Points >= maxScore) {
            setWinner(player1Name);
            setGameState('gameOver');
        } else if (p2Points >= maxScore) {
            setWinner(player2Name);
            setGameState('gameOver');
        }
    }, [p1Points, p2Points, maxScore, player1Name, player2Name]);

    const handleStartGame = () => {
        setIsPaused(false);
        setP1Points(0);
        setP2Points(0);
        setWinner(null);
        setGameState('playing');
    };

    const handlePlayAgain = () => {
        setIsPaused(false);
        setGameState('setup');
    };

    const drawPauseScreen = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "white";
        ctx.font = "50px 'Press Start 2P', monospace";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", W / 2, H / 2);
    };

    const handlePause = () => {
        const newPausedState = !isPaused;
        setIsPaused(newPausedState);

        if (newPausedState && ctxRef.current) {
            drawPauseScreen(ctxRef.current);
        }
    };

    return (
        <div className="font-pressStart w-screen h-screen bg-black flex justify-center items-center text-white flex-col">
            {gameState === 'setup' && (
                <div className="flex flex-col items-center gap-8 text-xl">
                    <h1 className="text-4xl">Web Pong Setup</h1>
                    <div className="flex flex-col sm:flex-row gap-8 w-full">
                        <input type="text" value={player1Name} onChange={(e) => setPlayer1Name(e.target.value)} className="bg-gray-800 text-white p-2 border-2 border-white text-center flex-1" />
                        <input type="text" value={player2Name} onChange={(e) => setPlayer2Name(e.target.value)} className="bg-gray-800 text-white p-2 border-2 border-white text-center flex-1" />
                    </div>
                    <div className='flex flex-col items-center gap-2'>
                        <label>Max Score: {maxScore}</label>
                        <input type="range" min="1" max="15" value={maxScore} onChange={(e) => setMaxScore(Number(e.target.value))} className='w-full' />
                    </div>
                    <button onClick={handleStartGame} className="text-2xl hover:text-green-400 transition-colors duration-200">Start Game</button>
                </div>
            )}

            {gameState === 'playing' && (
                <div className='flex flex-col items-center mb-4 gap-4'>
                    <div className='flex justify-around w-full' style={{ width: W }}>
                        <p className='text-xl'>{player1Name}</p>
                        <p className='text-xl'>{player2Name}</p>
                    </div>
                    <canvas ref={canvasRef} width={W} height={H} className="border-2 border-white" />
                    <div className='flex justify-around w-full' style={{ width: W }}>
                        <button onClick={handlePause} className="text-2xl hover:text-yellow-400 transition-colors duration-200">
                            {isPaused ? 'Resume' : 'Pause'}
                        </button>
                        <button onClick={() => navigate('/')} className="text-2xl hover:text-red-500 transition-colors duration-200">
                            Go Back
                        </button>
                    </div>
                </div>
            )}

            {gameState === 'gameOver' && (
                <div className='text-center flex flex-col gap-8'>
                    <h1 className="text-5xl text-yellow-400">Winner!</h1>
                    <p className="text-3xl">{winner}</p>
                    <button onClick={handlePlayAgain} className="text-2xl hover:text-green-400 transition-colors duration-200">Play Again</button>
                    <button onClick={() => navigate('/')} className="text-2xl hover:text-red-500 transition-colors duration-200">Home</button>
                </div>
            )}
        </div>
    );
}