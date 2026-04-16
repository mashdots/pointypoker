import { PostHogProvider } from 'posthog-js/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router';

import posthog from 'posthog-js';

import { ROUTE_PATHS } from '@routes/constants';
import {
  JiraRedirect,
  Privacy,
  Root,
  Switcher,
} from '@routes/index';

import './index.css';
import '@mantine/core/styles.css';

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2025-05-24',
  ui_host: 'https://us.i.posthog.com',
});


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<React.StrictMode>
  <PostHogProvider client={posthog} >
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Switcher />} />
          <Route path={ROUTE_PATHS.ROOM} element={<Switcher />} />
          <Route path={ROUTE_PATHS.PRIVACY} element={<Privacy />} />
          <Route path={ROUTE_PATHS.JIRA_REDIRECT} element={<JiraRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </PostHogProvider>
</React.StrictMode>);
