import { PointOptions, Ticket, Vote } from '../../types';

enum PointingTypes {
  fibonacci = 'Fibonacci',
  tshirt = 'T-Shirt',
  sequential = 'Sequential',
  limitedFibonacci = 'Limited Fibonacci',
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
  case PointingTypes.fibonacci:
    return {
      sequence: [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?', '∞', '☕'],
      exclusions: ['?', '∞', '☕'],
    };
  case PointingTypes.tshirt:
    return {
      sequence: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?'],
      exclusions: ['?'],
    };
  case PointingTypes.sequential:
    return {
      sequence: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '?'],
      exclusions: ['?'],
    };
  case PointingTypes.limitedFibonacci:
  default:
    return {
      sequence: [ 1, 2, 3, 5, 8, '?', '∞', '☕'],
      exclusions: ['?', '∞', '☕'],
    };
  }
};

const calculateAverage = (currentTicket?: Ticket): AverageResult  => {
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

const calculateSuggestedPoints = (currentTicket?: Ticket): SuggestedResult => {
  if (!currentTicket) {
    return { suggestedPoints: 0, warning: '' };
  }
  const { votes: voteData, pointOptions } = currentTicket;
  const { sequence, exclusions } = getPointOptions(pointOptions);

  const votesArray: Vote[] = [];
  const excludedVotes = [];
  const result: SuggestedResult = { suggestedPoints: 0 };
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

    const average = votesArray.length > 0 ? total / votesArray.length : 0;
    roundUp = Math.ceil(average);
    roundDown = Math.floor(average);
    middle = Math.abs((roundUp - roundDown) / 2);
    mark = average - roundDown;
  } else {
    const average = calculateAverage(currentTicket).average as number;
    roundUp = sequence.findIndex((point) => parseInt(point as string, 10) >= average);
    roundDown = roundUp - 1;
    middle = Math.abs((sequence[roundUp] as number) - (sequence[roundDown] as number)) / 2;
    mark = average - (sequence[roundDown] as number);
  }

  result.suggestedPoints = sequence[ mark >= middle ? roundUp : roundDown ];

  if (excludedVotes.length >= votesArray.length) {
    result.warning = 'Too many people didn\'t pick a number';
    result.severity = 'error';
  } else if (excludedVotes.length > 0) {
    result.warning = 'Some people didn\'t pick a number';
    result.severity = 'warning';
  }

  return result;
};

export {
  calculateAverage,
  calculateSuggestedPoints,
  getPointOptions,
};
export { PointingTypes };
