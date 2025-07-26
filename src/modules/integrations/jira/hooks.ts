import { useEffect } from 'react';
import useStore from '@utils/store';
import { jiraPermissionScopes } from './utils';
import { MODAL_TYPES } from '@modules/modal';

const useJiraScopeCheck = () => {
  const { storedJiraPermissionsScope, revokeAccess, openReAuthenticationModal } = useStore(({ preferences, setPreferences, setCurrentModal }) => ({
    storedJiraPermissionsScope: preferences.jiraAccess?.scope.split(' ').sort(),
    revokeAccess: () => {
      setPreferences('jiraAccess', null);
      setPreferences('jiraResources', null);
    },
    openReAuthenticationModal: () => setCurrentModal(MODAL_TYPES.JIRA_REAUTH),
  }));

  useEffect(() => {
    if (storedJiraPermissionsScope) {
      const requiredScopes = [...jiraPermissionScopes].sort();

      if (JSON.stringify(storedJiraPermissionsScope) !== JSON.stringify(requiredScopes)) {
        revokeAccess();
        openReAuthenticationModal();
      }
    }
  }, [ storedJiraPermissionsScope, revokeAccess, openReAuthenticationModal ]);
};

export default useJiraScopeCheck;
