import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import './index.css';
import {
  JiraRedirect,
  Privacy,
  Root,
  Switcher,
} from './routes';
import { JIRA_REDIRECT_PATH } from '@routes/jiraRedirect';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <Switcher />, // TODO: Redesign
      },
      {
        path: '/:roomName',
        element: <Switcher />, // TODO: Redesign
      },
      {
        path: JIRA_REDIRECT_PATH,
        element: <JiraRedirect />, // TODO: Redesign
      },
      {
        path: '/privacy',
        element: <Privacy />, // TODO: Redesign
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
