import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';

const PublicRoute = (): React.JSX.Element => {
  const { isAuthenticated } = useAuth();

  //si ya esta autenticado redirigir a la pagina de inicio, si no, mostrar la pagina de inicio de sesion
  return isAuthenticated ? <Navigate replace to='/home' /> : <Navigate replace to='/login' />;
};

export default PublicRoute;
