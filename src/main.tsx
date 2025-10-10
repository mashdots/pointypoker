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
import { PostHogProvider } from 'posthog-js/react';

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2025-05-24',
};


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
    <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={options}>
      <RouterProvider router={router} />
    </PostHogProvider>
  </React.StrictMode>,
);
