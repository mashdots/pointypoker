import React, { useEffect, useState } from 'react';
import { LinkIcon, Wrapper, VisibilityControl } from './components';

type Props = {
  flex?: number;
  width?: string;
  content?: string | null;
  url?: string;
}

let timeoutOne: number;
let timeoutTwo: number;

const Subtitles = ({
  flex,
  width,
  content,
  url,
}: Props) => {
  const [ displayedContent, setDisplayedContent ] = useState<string | null>(null);
  const [ isVisible, setIsVisible ] = useState(false);

  /**
   * Over-engineered logic to make the icon animate in and out
  */
  useEffect(() => {
    if (content && content !== displayedContent) {
      clearTimeout(timeoutOne);
      setIsVisible(false);

      timeoutOne = setTimeout(() => {
        setDisplayedContent(content ?? '');
      }, 200);
    }

    timeoutTwo = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => {
      clearTimeout(timeoutOne);
      clearTimeout(timeoutTwo);
    };
  }, [ content ]);

  const finalContent = url ? (
    <a href={url} target="_blank" rel="noreferrer"><LinkIcon />{displayedContent}</a>
  ) : displayedContent;

  return (
    <Wrapper flex={flex} width={width}>
      <VisibilityControl isVisible={isVisible}>
        {finalContent}
      </VisibilityControl>
    </Wrapper>
  );
};

export default Subtitles;
