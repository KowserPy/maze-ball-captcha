import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const SuccessScreen = () => {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			className="text-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50"
		>
			{/* Success Icon */}
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
				className="mb-6"
			>
				<ShieldCheck className="w-30 h-30 text-green-400 mx-auto" />
			</motion.div>
			<div className="flex items-center justify-center mb-2">
				<span className="text-green-400 font-semibold">Verification Complete</span>
			</div>
			<div className="text-xs text-gray-300 break-all font-mono bg-slate-800/50 p-2 rounded">
				<p>Now you are eligible for Quiz!</p>
			</div>
		</motion.div>
	);
};

export default SuccessScreen;
