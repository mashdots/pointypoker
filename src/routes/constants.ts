enum ROUTE_PATHS {
  ROOM = '/:roomName',
  PRIVACY = '/privacy',
  JIRA_REDIRECT = '/jira-redirect',
}

const RESERVED_PATHS = [ROUTE_PATHS.PRIVACY, ROUTE_PATHS.JIRA_REDIRECT];

export {
  ROUTE_PATHS,
  RESERVED_PATHS,
};
