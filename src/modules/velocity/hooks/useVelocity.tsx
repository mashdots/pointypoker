import { useEffect, useMemo, useState } from 'react';
import { JiraIssueSearchPayload, JiraSprint } from '@modules/integrations/jira/types';
import { useJira } from '@modules/integrations';
import useStore from '@utils/store';

interface AssociatedTicketData {
  ticketId: string;
  pointValue: number;
}

interface VelocityChartData {
  label: string;
  chartValues: number[];
  associatedTicketData: AssociatedTicketData[];
}

const useVelocity = (maxSprints = 5) => {
  const { defaultBoard } = useStore(({ preferences }) => ({
    defaultBoard: preferences?.jiraPreferences?.defaultBoard,
  }));
  const { getIssuesForSprints, getPointFieldFromBoardId, getSprintsForBoard } = useJira();
  const [pointField, setPointField] = useState<string | null>(null);
  const [sprintQuantity, setSprintQuantity] = useState<number>(0);
  const [sprints, setSprints] = useState<JiraSprint[]>([]);
  const [tickets, setTickets] = useState<JiraIssueSearchPayload[]>([]);

  useEffect(() => {
    if (!defaultBoard?.id) return;

    if (!pointField) {
      const getPointField = async () => {
        const field = await getPointFieldFromBoardId(defaultBoard.id);

        if (field) {
          setPointField(field.id);
        }
      };

      getPointField();
    }

    if (!sprintQuantity) {
      const fetchSprints = async () => {
        try {
          const fetchedSprints = await getSprintsForBoard(defaultBoard.id, {
            state: 'closed',
          });
          setSprintQuantity(fetchedSprints.total || 0);
        } catch (error) {
          console.error('Error fetching sprints:', error);
        }
      };

      fetchSprints();
    }

    if (sprintQuantity && sprints.length !== maxSprints) {
      const fetchSprints = async () => {
        try {
          const fetchedSprints = await getSprintsForBoard(defaultBoard.id, {
            state: 'closed',
            maxResults: maxSprints,
            startAt: sprintQuantity - maxSprints,
          } );
          console.log('Fetched Sprints:', fetchedSprints);
          setSprints(fetchedSprints.values as JiraSprint[]);
        } catch (error) {
          console.error('Error fetching sprints:', error);
        }
      };

      fetchSprints();
    }

    // Change to update tickets when sprints change
    if (sprints.length && !tickets.length) {
      const fetchTickets = async () => {
        const sprintIds = sprints.map(sprint => sprint.id);
        try {
          const fetchedTickets = await getIssuesForSprints(defaultBoard.id, sprintIds);
          setTickets(fetchedTickets.issues);
        } catch (error) {
          console.error('Error fetching tickets:', error);
        }
      };

      fetchTickets();
    }
  }, [defaultBoard?.id, sprintQuantity, sprints.length, maxSprints]);

  const sprintField = useMemo(() => {
    if (!sprints.length || !tickets.length) return null;
    const firstTicket = tickets[0];

    const sprintField = Object.keys(firstTicket.fields)
      .find(
        (fieldName) => sprints.some(
          (sprint) => {
            const fieldData = firstTicket.fields[fieldName];
            // Sprint data is an array of objects.
            if (!Array.isArray(fieldData)) return false;

            return fieldData.some(sprintData => sprintData.id === sprint.id && sprintData.name === sprint.name );
          },
        ),
      );

    return sprintField ? sprintField : null;

  }, [sprints, tickets]);

  const compiledSprintData = useMemo(() => {
    const sprintData = [];

    if (!sprints.length || !tickets.length || !pointField || !sprintField) return sprintData;

    /**
     * 1. Gather tickets for each sprint.
     * 2. Determine commitment for each sprint by what tickets were moved to the
     *    sprint before it started.
     * 3. Determine if any tickets were added after the sprint started.
     * 4. Determine what tickets were completed during the sprint.
     * 5. Determine what tickets were not completed by the end of the sprint.
     *
     * Later:
     * 6. Calculate total points completed for each sprint.
     * 7. Calculate total points committed for each sprint.
     * 7. Calculate points that fell to the next sprint.
     */

    sprints.forEach((sprint) => {
      const sprintTickets = tickets.filter(({ fields }: { fields: JiraIssueSearchPayload['fields'] }) => {
        const sprintData: Array<{ id: number, name: string }> = fields[sprintField];

        return sprintData?.some(data => data.id === sprint.id);
      });

      const totalPoints = sprintTickets.reduce((sum, ticket) => {
        const pointValue = ticket.fields[pointField];
        return sum + (typeof pointValue === 'number' ? pointValue : 0);
      }, 0);

      sprintData.push({
        label: sprint.name,
        chartValues: [totalPoints],
        associatedTicketData: sprintTickets.map(ticket => ({
          ticketId: ticket.id,
          pointValue: ticket.fields[pointField] || 0,
        })),
      });
    });

    return sprintData;
  }, [sprints, tickets, pointField, sprintField]);


  return {
    sprints,
    sprintQuantity,
    tickets,
    compiledSprintData,
  };
};

export default useVelocity;
