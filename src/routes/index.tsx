import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import Loadable from '../layout/Loadable';
import Cartera from "../views/pages/cartera/page.tsx";

//private routes
const Dashboard = Loadable(lazy(() => import('../views/home')));
const FormLayout = Loadable(lazy(() => import('../views/uikit/formlayout/page')));

const FormDescuento = Loadable(lazy(() => import('../views/pages/descuento/page')));
const TablaFacturas = Loadable(lazy(() => import('../views/pages/facturas/page')));
const EmptyPage = Loadable(lazy(() => import('../views/pages/empty/page')));

//public routes


//404
const ErrorPage = Loadable(lazy(() => import('../views/pages/notfound/page')));

const MainRoutes : RouteObject[] =  [
  //*PUBLIC ROUTES
  // {
  //   element: <PublicRoute />,
  //   children: [
  //     {
  //       path: '/login',
  //       element: <Login />,
  //     },
  //   ],
  // },

  //*PRIVATE ROUTES
  {
    element: <AppLayout />,
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
        path: '/descuento',
        element: <FormDescuento />,
      },
      {
        path: '/facturas',
        element: <TablaFacturas />,
      },
      {
        path: '/cartera',
        element: <Cartera/>,
      },
      {
        path: '/uikit',
        children: [
          {
            path: 'formlayout',
            element: <FormLayout />,
          },
        ],
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
