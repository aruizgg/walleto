import styled from 'styled-components';

const ActionButton = styled.button`
    background-color:rgb(134, 201, 255);
    color: white;             
    padding: 10px 12px;        
    border: none;               
    border-radius: 200px;        
    font-size: 16px;            
    cursor: pointer;            
    transition: background-color 0.3s ease;  
    margin: 5px; 
    
    &:hover {
      background-color: rgb(168, 216, 255);
    }
`;

const IconoAccion = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

function ComponentActionButton({ src, alt, onClick, ...props }) {
  return (
    <ActionButton onClick={onClick} {...props} title={alt}>
      <IconoAccion src={src} />
    </ActionButton>
  );
}

export default ComponentActionButton;
