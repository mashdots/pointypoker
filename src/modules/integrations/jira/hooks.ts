import { useEffect } from 'react';

import { MODAL_TYPES } from '@modules/modal';
import useStore from '@utils/store';

import { jiraPermissionScopes } from './utils';

const useJiraScopeCheck = () => {
  const {
    storedJiraPermissionsScope,
    revokeAccess,
    openReAuthenticationModal,
  } = useStore(({
    preferences,
    setPreference,
    setCurrentModal,
  }) => ({
    openReAuthenticationModal: () => setCurrentModal(MODAL_TYPES.JIRA_REAUTH),
    revokeAccess: () => {
      setPreference('jiraAccess', null);
    },
    storedJiraPermissionsScope: preferences.jiraAccess?.scope.split(' ').sort(),
  }));

  useEffect(() => {
    if (storedJiraPermissionsScope) {
      const requiredScopes = [...jiraPermissionScopes].sort();

      if (JSON.stringify(storedJiraPermissionsScope) !== JSON.stringify(requiredScopes)) {
        revokeAccess();
        openReAuthenticationModal();
      }
    }
  }, [
    storedJiraPermissionsScope,
    revokeAccess,
    openReAuthenticationModal,
  ]);
};

export default useJiraScopeCheck;
