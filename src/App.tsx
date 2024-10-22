import { LayoutProvider } from './layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import './styles/layout/layout.scss';
import './styles/demo/Demos.scss';
import { useRoutes } from "react-router-dom";
import MainRoutes from "./routes";

function App() {
  const Routes = useRoutes(MainRoutes);

	return (
		<PrimeReactProvider>
			<LayoutProvider>
        {Routes}
      </LayoutProvider>
		</PrimeReactProvider>
	);
}

export default App;
