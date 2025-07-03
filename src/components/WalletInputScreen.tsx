import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

interface WalletInputScreenProps {
	onContinue: (walletAddress: string) => void;
}

const WalletInputScreen: React.FC<WalletInputScreenProps> = ({ onContinue }) => {
	const [walletAddress, setWalletAddress] = useState("");
	const [walletError, setWalletError] = useState("");

	const validateWalletAddress = (address: string) => {
		if (!address) {
			setWalletError("");
			return false;
		}
		if (address.length !== 42) {
			setWalletError("Wallet address must be exactly 42 characters");
			return false;
		}
		if (!address.startsWith("0x")) {
			setWalletError("Wallet address must start with 0x");
			return false;
		}
		setWalletError("");
		return true;
	};

	const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setWalletAddress(value);
		validateWalletAddress(value);
	};

	const handleContinue = () => {
		if (validateWalletAddress(walletAddress)) {
			onContinue(walletAddress);
		}
	};

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto">
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 0.3 }}
				className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
			>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">Wallet Address *</label>
						<input
							type="text"
							value={walletAddress}
							onChange={handleWalletChange}
							placeholder="0x1234567890123456789012345678901234567890"
							className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors text-sm font-mono"
							maxLength={42}
						/>
					</div>

					{walletError && (
						<div className="flex items-center text-red-400 text-xs">
							<AlertCircle className="w-3 h-3 mr-1" />
							{walletError}
						</div>
					)}

					{walletAddress && !walletError && walletAddress.length === 42 && (
						<div className="flex items-center text-green-400 text-xs">
							<CheckCircle className="w-3 h-3 mr-1" />
							Valid wallet address
						</div>
					)}

					{walletAddress && walletAddress.length < 42 && !walletError && (
						<div className="text-gray-400 text-xs">{walletAddress.length}/42 characters</div>
					)}
				</div>

				<div className="mt-6">
					<button
						onClick={handleContinue}
						disabled={!walletAddress || !!walletError || walletAddress.length !== 42}
						className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
					>
						Continue
						<ArrowRight className="w-4 h-4 ml-2" />
					</button>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default WalletInputScreen;
