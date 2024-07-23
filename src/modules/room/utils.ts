import { URLRecord } from 'whatwg-url';

import { PointOptions, Ticket, Vote } from '../../types';

enum PointingTypes {
  tshirt = 'T-Shirt',
  fibonacci = 'Fibonacci',
}

type CalculationResult = {
  warning?: string;
  severity?: 'error' | 'warning';
}

type AverageResult = CalculationResult & {
  average: number;
}

type SuggestedResult = CalculationResult & {
  suggestedPoints: number | string;
}


const getPointOptions = (type?: string): PointOptions => {
  switch (type) {
  case PointingTypes.tshirt:
    return {
      sequence: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      exclusions: ['?'],
    };
  case PointingTypes.fibonacci:
  default:
    return {
      sequence: [0, 1, 2, 3, 5, 8, 13],
      exclusions: ['?', '∞', '☕'],
    };
  }
};

const calculateAverage = (currentTicket?: Ticket | null): AverageResult  => {
  if (!currentTicket) {
    return { average: 0, warning: '' };
  }
  const { votes: voteData, pointOptions } = currentTicket;

  // No averaging of t-shirt sizes!
  if (pointOptions === PointingTypes.tshirt) {
    return { average: 0, warning: 'T-Shirt sizes cannot be averaged.' };
  }

  const { exclusions } = getPointOptions(pointOptions);
  const votesArray: number[] = [];
  const excludedVotes = [];

  for (const vote of Object.values(voteData)) {
    if (exclusions.includes(vote)) {
      excludedVotes.push(vote);
    } else {
      votesArray.push(vote as number);
    }
  }

  const total = votesArray.reduce((acc, vote) => acc + (vote as number), 0);
  const average = votesArray.length > 0 ? total / votesArray.length : 0;
  let warning = '';
  let severity: CalculationResult['severity'];

  if (excludedVotes.length >= votesArray.length) {
    warning = 'Too many people didn\'t pick a number';
    severity = 'error';
  } else if (excludedVotes.length > 0) {
    warning = 'Some people didn\'t pick a number';
    severity = 'warning';
  }

  return {
    average: average % 1 === 0 ? average : parseFloat(average.toFixed(2)),
    warning,
    severity,
  };
};

const calculateSuggestedPoints = (currentTicket?: Ticket | null): SuggestedResult => {
  if (!currentTicket) {
    return { suggestedPoints: 0, warning: '' };
  }
  const { votes: voteData, pointOptions } = currentTicket;
  const { sequence, exclusions } = getPointOptions(pointOptions);

  const votesArray: Vote[] = [];
  const excludedVotes = [];
  const result: SuggestedResult = { suggestedPoints: 0 };
  let average: number;
  let roundUp;
  let roundDown;
  let middle;
  let mark;

  for (const vote of Object.values(voteData)) {
    if (exclusions.includes(vote)) {
      excludedVotes.push(vote);
    } else {
      votesArray.push(vote);
    }
  }

  if (pointOptions === PointingTypes.tshirt) {
    let total = 0;

    for (const vote of votesArray) {
      total += sequence.indexOf(vote as string);
    }

    average = votesArray.length > 0 ? total / votesArray.length : 0;
    roundUp = Math.ceil(average);
    roundDown = Math.floor(average);
    middle = Math.abs((roundUp - roundDown) / 2);
    mark = average - roundDown;
  } else {
    average = calculateAverage(currentTicket).average;
    roundUp = sequence.findIndex((point) => parseInt(point as string, 10) >= average);
    roundDown = roundUp - 1;
    middle = Math.abs((sequence[roundUp] as number) - (sequence[roundDown] as number)) / 2;
    mark = average - (sequence[roundDown] as number);
  }

  result.suggestedPoints = average !== 0 ? sequence[mark >= middle ? roundUp : roundDown] : 0;

  if (excludedVotes.length >= votesArray.length) {
    result.warning = 'Too many people didn\'t pick a number';
    result.severity = 'error';
  } else if (excludedVotes.length > 0) {
    result.warning = 'Some people didn\'t pick a number';
    result.severity = 'warning';
  }

  return result;
};

const getTicketNumberFromUrl = ({ host, path }: URLRecord): string => {
  const re = /[a-z]{2,6}-\d{1,6}/i;
  let parsed;

  if (Array.isArray(path)) {
    parsed = path.find((p) => re.test(p));
  } else if (path) {
    parsed = path.match(re)?.pop();
  }

  return parsed ?? host?.toString() ?? '';
};

const isVoteCast = (vote?: Vote): boolean => ![null, undefined, ''].includes(vote as any);

export {
  calculateAverage,
  calculateSuggestedPoints,
  getPointOptions,
  getTicketNumberFromUrl,
  isVoteCast,
};

export { PointingTypes };
