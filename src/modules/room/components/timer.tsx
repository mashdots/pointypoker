import React, { useEffect, useRef } from 'react';
import { DateTime } from 'luxon';

type Props = {
  startTime?: number;
  endTime?: number | null;
};

type DurationObject = {
  minutes: number;
  seconds: number;
}

enum TIME {
  MINUTE = 'min',
  MINUTES = 'mins',
  SECOND = 'second',
  SECONDS = 'seconds',
  SECOND_SHORT = 'sec',
}

const buildDurationString = (duration: DurationObject) => {
  const { minutes, seconds } = duration;
  const secondsString = seconds === 1 ? TIME.SECOND : TIME.SECONDS;
  const minuteString = minutes === 1 ? TIME.MINUTE : TIME.MINUTES;
  const parsedSeconds = parseInt(seconds.toString(), 10);

  if (minutes === 0) {
    return `${ parsedSeconds } ${ secondsString }`;
  }

  return `${ minutes } ${ minuteString } ${ parsedSeconds } ${ TIME.SECOND_SHORT }`;
};

const Timer = ({ startTime, endTime = null }: Props) => {
  const [ time, setTime ] = React.useState('');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (startTime) {
      clearInterval(intervalRef.current as number);

      intervalRef.current = setInterval(() => {
        const start = DateTime.fromMillis(startTime);
        const end = endTime ? DateTime.fromMillis(endTime) : DateTime.now();
        const durationObj = end.diff(start).shiftTo('minutes', 'seconds').toObject();
        const durationString = buildDurationString(durationObj as DurationObject);

        setTime(durationString);
      }, 1000);
    } else {
      setTime('Add a title to start the timer');
    }

    return () => {
      clearInterval(intervalRef.current as number);
    };
  }, [ startTime, endTime ]);

  return <div>{time}</div>;
};

export default Timer;
