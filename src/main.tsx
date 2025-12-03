import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

import './index.css';
import {
  JiraRedirect,
  Privacy,
  Root,
  Switcher,
} from './routes';
import { JIRA_REDIRECT_PATH } from '@routes/jiraRedirect';


posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  ui_host: 'https://us.i.posthog.com',
  defaults: '2025-05-24',
});


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
    <PostHogProvider client={posthog} >
      <RouterProvider router={router} />
    </PostHogProvider>
  </React.StrictMode>,
);
