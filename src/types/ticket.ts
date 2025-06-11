type Vote = string | number;

type Sprint = {
  id: number;
  name: string;
  originBoardId: number;
}

type Parent = Omit<ImportedTicket, 'parent' | 'sprint'>;

type IssueIcon = {
  id: string; // Equivalent to an ImportedTicket type
  contentType: 'png' | 'svg';
  data: string;
}

interface TicketBase {
  [key: string]: any;
  id: string;                 // Unique internal identifier
  name: string;               // Display name from input or data source
  addedBy: string;            // User who added the ticket
}

interface ImportedTicket extends TicketBase {
  key: string;                // External identifier
  url: string;
  type: string;               // Type of ticket. We can infer the icon from this value if it exists.
  pointedInRemote?: boolean;  // Whether the ticket has been pointed in the remote system
  parent?: Parent;
  sprint?: Sprint;
}

type QueuedTicket = (TicketBase | ImportedTicket) & {
  queuedAt: number;
}

type ActiveTicket = (TicketBase | ImportedTicket | QueuedTicket) & {
  startedAt: number;          // Time ticket was started
  votes: {
    [ key: string ]: Vote;
  }
}

type CompletedTicket = ActiveTicket & {
  completedAt: number;
  averagePoints: number;
  suggestedPoints: number;
  overridePoints?: number;
}

export type {
  ActiveTicket,
  QueuedTicket,
  CompletedTicket,
  IssueIcon,
  Vote,
};
