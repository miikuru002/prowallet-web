import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import Loadable from '../layout/Loadable';
import Cartera from "../views/pages/cartera/page.tsx";
import PrivateRoute from '../layout/PrivateRoute.tsx';
import PublicRoute from '../layout/PublicRoute.tsx';

//private routes
const Dashboard = Loadable(lazy(() => import('../views/home')));
const TablaFacturas = Loadable(lazy(() => import('../views/pages/facturas/page')));
const EmptyPage = Loadable(lazy(() => import('../views/pages/empty/page')));

//public routes
const LoginPage = Loadable(lazy(() => import('../views/pages/auth/login/page')));

//404
const ErrorPage = Loadable(lazy(() => import('../views/pages/notfound/page')));

const MainRoutes : RouteObject[] =  [
  //*PUBLIC ROUTES
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },

  //*PRIVATE ROUTES
  {
    element: <PrivateRoute />,
    children: [
      {
        index: true,
        element: <Navigate to='/home' />,
      },
      {
        path: '/home',
        element: <Dashboard />,
      },
      {
        path: '/carteras',
        element: <Cartera/>,
      },
      {
        path: 'facturas',
        element: <TablaFacturas />,
      },
      {
        path: '/pages',
        children: [
          {
            path: 'empty',
            element: <EmptyPage />,
          },
        ]
      }
    ],
  },

  //*404
  {
    path: '*',
    element: <ErrorPage />,
  },
];

export default MainRoutes;
