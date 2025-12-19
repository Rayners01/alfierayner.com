"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Press_Start_2P } from 'next/font/google';

const press_start_2P = Press_Start_2P({ subsets: ['latin'], weight: "400" });

const TOTAL_STEPS = 1500;
const KILI_HEIGHT = 5895;
const ANIMATION_SPEED = 15;
const PATH_WAYPOINTS = [
    { atStep: 0, x: 19, y: 99 }, { atStep: 50, x: 16.52, y: 95 }, { atStep: 100, x: 11.01, y: 93 }, { atStep: 150, x: 8.37, y: 89 },
    { atStep: 200, x: 11.01, y: 86 }, { atStep: 250, x: 8.5, y: 79 }, { atStep: 300, x: 8.6, y: 74 }, { atStep: 350, x: 15.42, y: 71 },
    { atStep: 400, x: 20.93, y: 69.45 }, { atStep: 450, x: 19.27, y: 63.42 }, { atStep: 500, x: 18.72, y: 58.95 }, { atStep: 550, x: 21.59, y: 56.03 },
    { atStep: 600, x: 24.34, y: 53.11 }, { atStep: 650, x: 26.65, y: 51.17 }, { atStep: 700, x: 28.52, y: 49.61 }, { atStep: 750, x: 31.61, y: 46.31 },
    { atStep: 800, x: 33.81, y: 45.14 }, { atStep: 850, x: 37, y: 43.39 }, { atStep: 900, x: 39.54, y: 41.83 }, { atStep: 950, x: 42.62, y: 39.89 },
    { atStep: 1000, x: 45.26, y: 38.14 }, { atStep: 1050, x: 47.14, y: 36.58 }, { atStep: 1100, x: 50, y: 35.42 }, { atStep: 1150, x: 53.19, y: 35.03 },
    { atStep: 1200, x: 55.84, y: 34.25 }, { atStep: 1250, x: 58.37, y: 32.3 }, { atStep: 1300, x: 57.38, y: 28.42 }, { atStep: 1350, x: 55.18, y: 27.44 },
    { atStep: 1400, x: 52.97, y: 25.89 }, { atStep: 1450, x: 51.65, y: 24.14 }, { atStep: 1500, x: 51.87, y: 23.55 }
];

export default function MountainTracker() {
    const getKiliHour = () => parseInt(new Intl.DateTimeFormat('en-GB', {
            hour: 'numeric',
            hourCycle: 'h23',
            timeZone: 'Africa/Dar_es_Salaam'
        }).format(new Date()));

    const [displaySteps, setDisplaySteps] = useState(0);
    const [hour, setHour] = useState<number>(getKiliHour());
    const [showDebug, setShowDebug] = useState(false);
    const [showHUD, setShowHUD] = useState(true);
    
    const hikerRef = useRef<HTMLImageElement>(null);
    const visualStepRef = useRef(0);
    const targetStepRef = useRef(0);
    const animFrameId = useRef<number | null>(null);

    const imgIndex = ((hour + 18) % 24) || 24;
    const progressPercent = Math.min((displaySteps / TOTAL_STEPS) * 100, 100);
    const currentAltitude = Math.floor((displaySteps / TOTAL_STEPS) * KILI_HEIGHT);

    const renderHiker = (step: number) => {
        if (!hikerRef.current) return;
        let start = PATH_WAYPOINTS[0];
        let end = PATH_WAYPOINTS[PATH_WAYPOINTS.length - 1];

        for (let i = 0; i < PATH_WAYPOINTS.length - 1; i++) {
            if (step >= PATH_WAYPOINTS[i].atStep && step <= PATH_WAYPOINTS[i+1].atStep) {
                start = PATH_WAYPOINTS[i];
                end = PATH_WAYPOINTS[i+1];
                break;
            }
        }

        const range = end.atStep - start.atStep;
        const progress = range === 0 ? 0 : (step - start.atStep) / range;
        const x = start.x + (end.x - start.x) * progress;
        const y = start.y + (end.y - start.y) * progress;

        hikerRef.current.style.left = `${x}%`;
        hikerRef.current.style.top = `${y}%`;
        hikerRef.current.src = `/assets/kili/hiker_${end.x <= start.x ? 'left' : 'right'}.png`;
    };

    const animate = () => {
        const diff = targetStepRef.current - visualStepRef.current;
        if (Math.abs(diff) <= ANIMATION_SPEED) {
            visualStepRef.current = targetStepRef.current;
            renderHiker(visualStepRef.current);
            animFrameId.current = null;
        } else {
            visualStepRef.current += Math.sign(diff) * ANIMATION_SPEED;
            renderHiker(visualStepRef.current);
            animFrameId.current = requestAnimationFrame(animate);
        }
    };

    const updateTarget = (val: number) => {
        const parsedVal = Math.max(0, val);
        targetStepRef.current = parsedVal;
        setDisplaySteps(parsedVal);
        if (animFrameId.current === null) animFrameId.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        setHour(getKiliHour());
        
        const fetchDonation = async () => {
            const res = await fetch('/api/donation-total').catch(() => null);
            const data = await res?.json();
            updateTarget(data?.total ?? 0);
        };
        fetchDonation();

        const clock = setInterval(() => {
            const currentKiliHour = getKiliHour();
            setHour((prev) => (prev !== currentKiliHour ? currentKiliHour : prev));
        }, 60000);
        
        return () => { 
            clearInterval(clock); 
            if (animFrameId.current) cancelAnimationFrame(animFrameId.current); 
        };
    }, []);

    return (
        <main className={`flex flex-col items-center justify-center min-h-screen bg-neutral-950 p-2 ${press_start_2P.className} text-white`}>
            <style jsx global>{`
                input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; height:1.5vmin; width:1.5vmin; min-width:10px; background:#facc15; border:1px solid #000; cursor:pointer; }
                input[type=range]::-moz-range-thumb { height:1.5vmin; width:1.5vmin; min-width:10px; background:#facc15; border:1px solid #000; cursor:pointer; }
            `}</style>

            <div className="relative w-full max-w-5xl aspect-video bg-neutral-800 border-[0.5vmin] border-neutral-200 overflow-hidden shadow-2xl">
                
                <div className="absolute top-[3%] left-1/2 -translate-x-1/2 z-20 w-[80%] max-w-[420px] pointer-events-none">
                    <button 
                        onClick={() => setShowHUD(!showHUD)} 
                        className="absolute right-full top-0 -mr-[0.1vmin] pointer-events-auto bg-black/30 border-[0.15vmin] border-white/20 h-[3.5vmin] w-[3.5vmin] min-h-[22px] min-w-[22px] flex items-center justify-center hover:bg-black/50 transition-colors"
                    >
                        {showHUD ? "<" : ">"}
                    </button>

                    {showHUD && (
                        <div className="w-full bg-black/30 border-[0.2vmin] border-white/20 p-[1.5vmin] pointer-events-auto">
                            <div className="flex justify-between mb-[1vmin] uppercase tracking-tighter text-[min(1.2vmin,12px)]">
                                <div className="flex flex-col gap-1">
                                    <span className="text-white/50 text-[0.7em]">Altitude</span>
                                    <span>
                                        {currentAltitude}m
                                        <span className="text-white/50 ml-1"> / 5895m</span>
                                    </span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-white/50 text-[0.7em]">Raised</span>
                                    <span className="text-yellow-400">£{displaySteps.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div className="h-[1vmin] min-h-[4px] bg-black/50 border-[0.1vmin] border-white/20 p-[0.2vmin] mb-[1vmin]">
                                <div className="h-full bg-green-500/80 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                            </div>

                            <div className="text-center">
                                <p className="text-green-300/80 leading-tight uppercase text-[min(1vmin,9px)]">
                                    Every £1 Raised = ~4m climbed
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <img key={`bg-${hour}`} src={`/assets/kili/bg_${imgIndex}.png`} className="absolute inset-0 w-full h-full object-cover" alt="" />
                <img ref={hikerRef} className="absolute z-[2] w-[4.5%] h-auto -translate-x-1/2 -translate-y-full" style={{ imageRendering: 'pixelated' }} alt="" />
                <img key={`trees-${hour}`} src={`/assets/kili/trees_${imgIndex}.png`} className="absolute inset-0 w-full h-full object-cover z-[3] pointer-events-none" alt="" />

                <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 z-30">
                    <a href="https://givestar.io/gs/alfie-rayner" target="_blank" rel="noopener noreferrer" 
                       className="block bg-yellow-200 border-[0.3vmin] border-black shadow-[0.4vmin_0.4vmin_0_0_#000] active:translate-y-[0.4vmin] active:shadow-none px-[2vmin] py-[1vmin] text-black uppercase text-[min(2vmin,16px)] text-center">
                        Donate!
                    </a>
                </div>

                <div className="absolute bottom-[3%] left-[3%] z-40 flex flex-col items-start gap-1">
                    {showDebug && (
                        <div className="bg-black/60 border-[0.2vmin] border-white/20 p-[1.5vmin] w-[22vmin] min-w-[130px] text-[min(1vmin,10px)] uppercase">
                            <div className="mb-3 flex flex-col gap-2">
                                <label className="text-white/50">Altitude</label>
                                <input type="range" min="0" max={TOTAL_STEPS} step="0.01" value={displaySteps} onChange={(e) => updateTarget(parseFloat(e.target.value))} className="w-full h-[0.6vmin] appearance-none bg-white/10 cursor-pointer" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-white/50">Time</label>
                                <input type="range" min="0" max="23" value={hour} onChange={(e) => setHour(parseInt(e.target.value))} className="w-full h-[0.6vmin] appearance-none bg-white/10 cursor-pointer" />
                            </div>
                        </div>
                    )}
                    <button onClick={() => setShowDebug(!showDebug)} className="bg-black/30 border-[0.15vmin] border-white/20 h-[3.5vmin] w-[3.5vmin] min-h-[22px] min-w-[22px] flex items-center justify-center hover:bg-black/50 transition-colors">
                        {showDebug ? "v" : "^"}
                    </button>
                </div>
            </div>
        </main>
    );
}