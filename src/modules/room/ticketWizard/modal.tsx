import { SizeProps } from '@modules/modal';
import React, { useEffect, useMemo, useState } from 'react';

type Props = {
  setModalSize: (sizeConfig?: SizeProps) => void
};

/**
 * Create a ticket list import view that takes a list of tickets, displaying various properties of each ticket.
 *  - List is re-arrangeable by drag and drop
 *  - Individual tickets can be unselected
 *  - List can be filtered by parent or type
 *  - Icons are fetched and parsed into stringified blobs for storage
 *  - Controls are provided to import the list into the queue
 *  - If active current ticket, give option to move currentTicket to history and start with first from import, or add to queue at a specific position
 *
 * Wizard behaviors:
 * 1. Show text input for creating new ticket, with buttons to create or import
 *   a. Entering text will either:
 *     i. Create a new ticket with the entered text as the name
 *     ii. Search for a ticket with the entered text as the key given Jira is connected
 *     iii. Search for a ticket with the entered text as the name given Jira is connected
 *     iv. If the ticket is a parent, expand to show ticket list import view from above with children.
 *   b. Clicking the create button will create a new ticket based on the above
 *   c. Creating the ticket will override whatever is in currentTicket, moving the previous to history (either as skipped if no votes shown, or with vote data)
 * 2. Clicking import will change to the import view, with options to import by sprint
*    a. Importing by sprint will show a list of sprints, with the ability to import all tickets from a sprint
*    b. Selecting a sprint will show a list of tickets from that sprint in the import view
 */

const TicketWizardModal = ({ setModalSize }: Props) => {
  return (
    <div>
      <h1>Ticket Wizard</h1>
    </div>
  );
};

export default TicketWizardModal;
