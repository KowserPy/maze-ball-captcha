import MazeCaptcha from "../components/MazeCaptcha";
import TelegramProvider from "../components/TelegramProvider";
import AccessControl from "../components/AccessControl";

const Index = () => {
	return (
		<TelegramProvider>
			<AccessControl>
				<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
					<MazeCaptcha />
				</div>
			</AccessControl>
		</TelegramProvider>
	);
};

export default Index;
