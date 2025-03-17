import type User from './user';
import type { Participant, PointOptions, Ticket, Room, Vote, RoomUpdateObject } from './room';

type Enumerate<N extends number, Acc extends number[] = []> = Acc[ 'length' ] extends N
  ? Acc[ number ]
  : Enumerate<N, [ ...Acc, Acc[ 'length' ] ]>

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export {
  User,
  Participant,
  PointOptions,
  Ticket,
  Room,
  RoomUpdateObject,
  Vote,
};
