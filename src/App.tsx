import { LayoutProvider } from "./layout/context/layoutcontext";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "./styles/layout/layout.scss";
import "./styles/demo/Demos.scss";
import { useRoutes } from "react-router-dom";
import MainRoutes from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "react-oidc-context";
import { userManager } from "./config/authConfig";

function App() {
	const Routes = useRoutes(MainRoutes);
	const queryClient = new QueryClient();

	return (
		<AuthProvider
			userManager={userManager}
			onSigninCallback={() => {
				window.history.replaceState({}, document.title, window.location.pathname);
			}}
		>
			<QueryClientProvider client={queryClient}>
				<PrimeReactProvider>
					<LayoutProvider>{Routes}</LayoutProvider>
				</PrimeReactProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</AuthProvider>
	);
}

export default App;
