import styled from 'styled-components';

const LoaderStyled = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.beige};
  border-top: 4px solid ${({ theme }) => theme.colors.lightBrown};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Loader = () => <LoaderStyled />;

export default Loader;