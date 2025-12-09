import { PostHogProvider } from 'posthog-js/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import posthog from 'posthog-js';

import { JIRA_REDIRECT_PATH } from '@routes/jiraRedirect';

import {
  JiraRedirect,
  Privacy,
  Root,
  Switcher,
} from './routes';

import './index.css';


posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2025-05-24',
  ui_host: 'https://us.i.posthog.com',
});


const router = createBrowserRouter([
  {
    children: [
      {
        element: <Switcher />,
        path: '',
      },
      {
        element: <Switcher />,
        path: '/:roomName',
      },
      {
        element: <JiraRedirect />,
        path: JIRA_REDIRECT_PATH,
      },
      {
        element: <Privacy />,
        path: '/privacy',
      },
    ],
    element: <Root />,
    path: '/',
  },
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PostHogProvider client={posthog} >
      <RouterProvider router={router} />
    </PostHogProvider>
  </React.StrictMode>,
);
