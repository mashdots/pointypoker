import styled from 'styled-components';

const InformationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0.5rem 0;
  padding: 1rem;

  border-radius: 0.5rem;

  > p {
    margin: 0;
    font-size: 0.8rem;
  }
`;

export default InformationWrapper;
