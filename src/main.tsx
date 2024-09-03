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
        element: <Switcher />,
      },
      {
        path: '/:roomName',
        element: <Switcher />,
      },
      {
        path: JIRA_REDIRECT_PATH,
        element: <JiraRedirect />,
      },
      {
        path: '/privacy',
        element: <Privacy />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
