import { ReactNode } from 'react';

import AuthProvider from './AuthProvider';
import DataProvider from './DataProvider';
import FirebaseProvider from './FirebaseProvider';
import JiraProvider from './JiraProvider';

const ServicesProvider = ({ children }: { children: ReactNode }) => (
  <FirebaseProvider>
    <DataProvider>
      <AuthProvider>
        <JiraProvider>
          {children}
        </JiraProvider>
      </AuthProvider>
    </DataProvider>
  </FirebaseProvider>
);

export default ServicesProvider;
