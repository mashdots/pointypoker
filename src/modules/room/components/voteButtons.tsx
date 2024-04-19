import React from 'react';
import styled from 'styled-components';


const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
  margin-top: 16px;
  justify-content: space-between;
`;

const VoteButtons = () => {
  return (
    <Wrapper>
      <button>1</button>
      <button>2</button>
      <button>3</button>
      <button>5</button>
      <button>8</button>
      <button>?</button>
      <button>∞</button>
    </Wrapper>
  );
};

export default VoteButtons;
