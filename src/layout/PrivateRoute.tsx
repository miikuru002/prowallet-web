import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';
import AppLayout from './AppLayout';

const PrivateRoute = (): React.JSX.Element => {
  const auth = useAuth();

  switch (auth.activeNavigator) {
    case 'signinSilent':
      return <>Signing you in silently...</>;
    case 'signoutRedirect':
      return <>Signing you out...</>;
  }

  if (auth.isLoading) {
    return <>Loading...</>;
  }

  return auth.isAuthenticated ? (
    //si el usuario esta autenticado, muestra el layout principal
    <AppLayout />
  ) : (
    //sino lo redirige a /login con un parametro de redireccion para que luego de iniciar sesion lo redirija a la pagina que intento acceder
    <Navigate replace to="/login" />
  );
};

export default PrivateRoute;
