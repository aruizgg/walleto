import styled from 'styled-components';

const TextButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

function ComponentTextButton({ src, alt, onClick, ...props }) {
    return (
      <TextButton onClick={onClick} {...props} title={alt}/>
    );
  }
  
  export default ComponentTextButton;