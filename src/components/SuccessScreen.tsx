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
				<ShieldCheck className="w-16 h-16 text-green-400 mx-auto" />
			</motion.div>

			<motion.p
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="text-green-400 font-semibold mb-8"
			>
				You have successfully completed the verification
			</motion.p>
		</motion.div>
	);
};

export default SuccessScreen;
