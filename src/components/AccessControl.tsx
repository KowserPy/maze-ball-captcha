import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Shield } from "lucide-react";
import { useTelegram } from "./TelegramProvider";

interface AccessControlProps {
	children: React.ReactNode;
}

const AccessControl: React.FC<AccessControlProps> = ({ children }) => {
	const { isReady, isInTelegram, isMobile, user } = useTelegram();

	if (!isReady) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
				<div className="text-white text-xl">Loading...</div>
			</div>
		);
	}

	// Block access if not in Telegram
	if (!isInTelegram || !isMobile) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="max-w-md mx-auto text-center"
				>
					<div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8">
						<Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
						<h1 className="text-2xl font-bold text-white mb-4">Access Restricted</h1>
						<p className="text-gray-300 mb-4">
							Please access this app using your mobile phone through Telegram mini app.
						</p>
					</div>
				</motion.div>
			</div>
		);
	}

	// Block access if user is a bot or invalid
	if (!user || user.is_bot) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="max-w-md mx-auto text-center"
				>
					<div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8">
						<AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
						<h1 className="text-2xl font-bold text-white mb-4">Invalid User</h1>
						<p className="text-gray-300 mb-4">
							Bot accounts and invalid users are not allowed to access this application.
						</p>
						<p className="text-sm text-gray-400">Please use a valid Telegram user account.</p>
					</div>
				</motion.div>
			</div>
		);
	}

	// All checks passed - render the children
	return <>{children}</>;
};

export default AccessControl;
