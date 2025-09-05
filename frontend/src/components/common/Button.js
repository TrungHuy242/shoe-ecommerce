import styled from 'styled-components';

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.lightBrown};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

export default Button;