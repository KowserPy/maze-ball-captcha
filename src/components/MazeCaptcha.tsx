import React, { useState } from "react";
import MazeGameContainer from "./MazeGameContainer";
import WalletInputScreen from "./WalletInputScreen";
import { useTelegram } from "./TelegramProvider";

const MazeCaptcha: React.FC = () => {
	const { isReady } = useTelegram();
	const [walletAddress, setWalletAddress] = useState<string>("");
	const [showGame, setShowGame] = useState(false);

	const handleWalletContinue = (address: string) => {
		if (!address || address.length !== 42) {
			console.error("Invalid wallet address");
			return;
		}
		setWalletAddress(address);
		setShowGame(true);
	};

	const handleReset = () => {
		setWalletAddress("");
		setShowGame(false);
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
			{!showGame ? (
				<WalletInputScreen onContinue={handleWalletContinue} />
			) : (
				<MazeGameContainer walletAddress={walletAddress} onReset={handleReset} />
			)}
		</div>
	);
};

export default MazeCaptcha;
