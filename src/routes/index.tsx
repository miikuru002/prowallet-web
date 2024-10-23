import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import Loadable from '../layout/Loadable';

//private routes
const Dashboard = Loadable(lazy(() => import('../views/home')));
const Button = Loadable(lazy(() => import('../views/uikit/button/page')));
const File = Loadable(lazy(() => import('../views/uikit/file/page')));
const FormLayout = Loadable(lazy(() => import('../views/uikit/formlayout/page')));
const Input = Loadable(lazy(() => import('../views/uikit/input/page')));
const InvalidState = Loadable(lazy(() => import('../views/uikit/invalidstate/page')));
const List = Loadable(lazy(() => import('../views/uikit/list/page')));
const Media = Loadable(lazy(() => import('../views/uikit/media/page')));
const Menu = Loadable(lazy(() => import('../views/uikit/menu/page')));
const Message = Loadable(lazy(() => import('../views/uikit/message/page')));
const Misc = Loadable(lazy(() => import('../views/uikit/misc/page')));
const Overlay = Loadable(lazy(() => import('../views/uikit/overlay/page')));
const Panel = Loadable(lazy(() => import('../views/uikit/panel/page')));
const Table = Loadable(lazy(() => import('../views/uikit/table/page')));

const FormDescuento = Loadable(lazy(() => import('../views/pages/descuento/page')));
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
        path: '/uikit',
        children: [
          {
            path: 'button',
            element: <Button />,
          },
          {
            path: 'file',
            element: <File />,
          },
          {
            path: 'formlayout',
            element: <FormLayout />,
          },
          {
            path: 'input',
            element: <Input />,
          },
          {
            path: 'invalidstate',
            element: <InvalidState />,
          },
          {
            path: 'list',
            element: <List />,
          },
          {
            path: 'media',
            element: <Media />,
          },
          {
            path: 'menu',
            element: <Menu />,
          },
          {
            path: 'message',
            element: <Message />,
          },
          {
            path: 'misc',
            element: <Misc />,
          },
          {
            path: 'overlay',
            element: <Overlay />,
          },
          {
            path: 'panel',
            element: <Panel />,
          },
          {
            path: 'table',
            element: <Table />,
          },
          {
            path: '*',
            element: <ErrorPage />,
          },
        ],
      },
    ],
  },

  //*404
  {
    path: '*',
    element: <ErrorPage />,
  },
];

export default MainRoutes;
