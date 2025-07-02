import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

interface HoldToStartProps {
	onStart: () => void;
}

const HoldToStart: React.FC<HoldToStartProps> = ({ onStart }) => {
	const [isHolding, setIsHolding] = useState(false);
	const [progress, setProgress] = useState(0);
	const [isCompleted, setIsCompleted] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	const HOLD_DURATION = 2500; // 2.5 seconds
	const PROGRESS_INTERVAL = 50; // Update every 50ms

	const startHolding = () => {
		if (isCompleted) return;

		setIsHolding(true);
		setProgress(0);

		intervalRef.current = setInterval(() => {
			setProgress((prev) => {
				const newProgress = prev + (PROGRESS_INTERVAL / HOLD_DURATION) * 100;
				if (newProgress >= 100) {
					clearInterval(intervalRef.current!);
					setIsCompleted(true);
					timeoutRef.current = setTimeout(() => {
						onStart();
					}, 300);
					return 100;
				}
				return newProgress;
			});
		}, PROGRESS_INTERVAL);
	};

	const stopHolding = () => {
		if (isCompleted) return;

		setIsHolding(false);
		setProgress(0);
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
	};

	useEffect(() => {
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	return (
		<div className="flex flex-col items-center space-y-6">
			<div className="relative">
				<motion.button
					className={`
            relative w-32 h-32 rounded-full border-4 transition-all duration-200
            ${
				isCompleted
					? "bg-green-600 border-green-400 shadow-green-400/50"
					: isHolding
					? "bg-purple-600 border-purple-400 shadow-purple-400/50"
					: "bg-slate-700 border-slate-500 hover:bg-slate-600"
			}
            shadow-lg active:scale-95 select-none
          `}
					onMouseDown={startHolding}
					onMouseUp={stopHolding}
					onMouseLeave={stopHolding}
					onTouchStart={startHolding}
					onTouchEnd={stopHolding}
					disabled={isCompleted}
					whileHover={{ scale: isCompleted ? 1 : 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<div className="flex flex-col items-center justify-center h-full">
						<Shield className={`w-8 h-8 mb-2 ${isCompleted ? "text-green-100" : "text-white"}`} />
						<span className={`text-sm font-medium ${isCompleted ? "text-green-100" : "text-white"}`}>
							{isCompleted ? (
								"Verified!"
							) : isHolding ? (
								<span className=" text-gray-400">Progress: {Math.round(progress)}%</span>
							) : (
								"Hold to Start"
							)}
						</span>
					</div>

					{/* Progress ring */}
					<svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
						<circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
						<circle
							cx="50"
							cy="50"
							r="48"
							fill="none"
							stroke={isCompleted ? "#10B981" : "#8B5CF6"}
							strokeWidth="3"
							strokeLinecap="round"
							strokeDasharray={`${2 * Math.PI * 48}`}
							strokeDashoffset={`${2 * Math.PI * 48 * (1 - progress / 100)}`}
							className="transition-all duration-75 ease-out"
						/>
					</svg>
				</motion.button>
			</div>
		</div>
	);
};

export default HoldToStart;
