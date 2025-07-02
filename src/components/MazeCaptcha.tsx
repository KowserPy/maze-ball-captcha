import React, { useState } from "react";
import { motion } from "framer-motion";
import MazeGame from "./MazeGame";
import SuccessScreen from "./SuccessScreen";
import { useTelegram } from "./TelegramProvider";
import { Shield } from "lucide-react";

interface CaptchaState {
	isCompleted: boolean;
	token: string | null;
}

const MazeCaptcha: React.FC = () => {
	const { isReady } = useTelegram();
	const [captchaState, setCaptchaState] = useState<CaptchaState>({
		isCompleted: false,
		token: null,
	});
	const [gameKey] = useState(0);

	const handleMazeComplete = async (solutionPath: string) => {
		try {
			console.log("Maze completed:", { solutionPath });

			// For demo purposes, just mark as completed
			setCaptchaState({
				isCompleted: true,
				token: "demo-token-" + Date.now(),
			});
		} catch (error) {
			console.error("Failed to validate CAPTCHA:", error);
		}
	};

	if (!isReady) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-white text-xl">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="w-full max-w-md mx-auto"
			>
				{!captchaState.isCompleted ? (
					<>
						{/* Header */}
						<motion.div
							className="text-center mb-8"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
						>
							<div className="flex items-center justify-center mb-4">
								<Shield className="w-10 h-10 text-purple-400 mr-2" />
								<h1 className="text-3xl font-bold text-white">Access Verification</h1>
							</div>
							<p className="text-gray-300 text-sm">Solve to verify you're human</p>
						</motion.div>

						{/* Game Container */}
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ delay: 0.3 }}
							className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
						>
							<MazeGame key={gameKey} onComplete={handleMazeComplete} />
						</motion.div>
					</>
				) : (
					<SuccessScreen />
				)}
			</motion.div>
		</div>
	);
};

export default MazeCaptcha;
