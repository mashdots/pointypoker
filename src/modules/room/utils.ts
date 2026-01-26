import { URLRecord } from 'whatwg-url';

import {
  PointOptions,
  Ticket,
  Vote,
} from '@yappy/types';
import { PointScheme } from '@yappy/types/estimation';

export enum PointingSchemes {
  tshirt = 'T-Shirt',
  fibonacci = 'Fibonacci',
  sequential = 'Sequential',
}

const TSHIRT_OPTIONS = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
];

const Exclusions = [
  '?',
  '∞',
  '☕',
];

type CalculationResult = {
  warning?: string;
  severity?: 'error' | 'warning';
};

type AverageResult = CalculationResult & {
  average: number;
};

type SuggestedResult = CalculationResult & {
  suggestedPoints: number | string;
};

type SchemaOptions = Omit<PointScheme, 'scheme'>;

const buildFibonacciUpTo = (max: number): number[] => {
  const sequence = [0, 1];
  let nextValue = 1;

  while (nextValue <= max) {
    sequence.push(nextValue);
    const len = sequence.length;
    nextValue = sequence[ len - 1 ] + sequence[ len - 2 ];
  }

  return [...new Set(sequence)];
};

const getPointOptions = (type?: string, options?: SchemaOptions): PointOptions => {
  const {
    max = 13,
    includeHalfPoints = false,
    halfPointMax,
  } = options || {};
  let pointOptions: PointOptions[ 'sequence' ] = [];

  switch (type) {
    case PointingSchemes.tshirt:
      pointOptions = TSHIRT_OPTIONS;
      break;
    case PointingSchemes.sequential:
      pointOptions = Array.from(Array(max), (e, i) => i);
      break;
    case PointingSchemes.fibonacci:
    default:
      pointOptions = buildFibonacciUpTo(max);
      break;
  }

  if (type === PointingSchemes.sequential && includeHalfPoints) {
    const halfPoints = pointOptions
      .filter((point) => typeof point === 'number' && point < (halfPointMax || max))
      .map((point) => (point as number) + 0.5);

    pointOptions = [...pointOptions, ...halfPoints].sort((a, b) => (a as number) - (b as number));
  }

  return {
    exclusions: Exclusions,
    sequence: pointOptions,
  };
};

const calculateAverage = (currentTicket?: Ticket | null): AverageResult => {
  if (!currentTicket) {
    return {
      average: 0,
      warning: '',
    };
  }
  const { votes: voteData, pointOptions } = currentTicket;

  // No averaging of t-shirt sizes!
  if (pointOptions === PointingSchemes.tshirt) {
    return {
      average: 0,
      warning: 'T-Shirt sizes cannot be averaged.',
    };
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
    severity,
    warning,
  };
};

const calculateSuggestedPoints = (currentTicket?: Ticket | null): SuggestedResult => {
  if (!currentTicket) {
    return {
      suggestedPoints: 0,
      warning: '',
    };
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

  if (pointOptions === PointingSchemes.tshirt) {
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

const isVoteCast = (vote?: Vote): boolean => ![
  null,
  undefined,
  '',
// eslint-disable-next-line @typescript-eslint/no-explicit-any
].includes(vote as any);


export {
  calculateAverage,
  calculateSuggestedPoints,
  getPointOptions,
  getTicketNumberFromUrl,
  isVoteCast,
};

export { PointingSchemes as PointingTypes };

