import React from 'react';
import styled from 'styled-components';
const BlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
`;
const Block = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
  min-height: 350px;
  display: flex;
`;
const ImageSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-right: 20px;
`;
const DescriptionSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const BlockTitle = styled.h3`
  color: white;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;
  const ImageFrame = styled.div`
  width: 75%;
  height: 300px;
  border-radius: 10px;
  padding: 5px;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255,
255, 0.5);
  overflow: hidden;
`;
const ImagePreview = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
} `;
const DescriptionText = styled.p`
  color: white;
  font-size: 14px;
  line-height: 1.6;
  overflow-y: auto;
  max-height: 150px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;
// Predefined block data
const blockData = [
  {
    imageUrl:'',
    websiteUrl: 'https://example.com/1',
    title: 'Block 1',
    description: 'This is the description for Block 1. You can add any text here that you want to display.'
  }, 
  {
    imageUrl: 'https://i.pinimg.com/originals/90/a2/e8/90a2e8ab45f87625612120c269485bdc.jpg',
    websiteUrl: 'https://example.com/2',
    title: 'Block 2',
    description: 'Here\'s the description for Block 2. Feel free to add multiple sentences or paragraphs.'
}, 
 {
    imageUrl: 'https://example.com/image3.jpg',
    websiteUrl: 'https://example.com/3',
    title: 'Block 3',
    description: 'Block 3 description goes here. You can provide detailed.'
},
{
    imageUrl: 'https://example.com/image4.jpg',
    websiteUrl: 'https://example.com/4',
    title: 'Block 4',
    description: 'Description for Block 4. Use this space to give context'
},
{
    imageUrl: 'https://example.com/image5.jpg',
    websiteUrl: 'https://example.com/5',
    title: 'Block 5',
    description: 'Block 5 description. You can include relevant details,' 
},
{ 
    imageUrl: 'https://example.com/image6.jpg',
    websiteUrl: 'https://example.com/6',
    title: 'Block 6',
    description: 'And finally, the description for Block 6. Make sure each' 
},
  // ... (other blocks)
];
const BlockView = () => {
  const handleImageClick = (websiteUrl) => {
    window.open(websiteUrl, '_blank');
  };
  return (
    <BlockContainer>
      {blockData.map((block, index) => (
        <Block key={index}>
          <ImageSection>
            <BlockTitle>{block.title}</BlockTitle>
            <ImageFrame>
              <ImagePreview
                style={{ backgroundImage: `url(${block.imageUrl})` }}
                onClick={() => handleImageClick(block.websiteUrl)}
              />
            </ImageFrame>
          </ImageSection>
          <DescriptionSection>
            <BlockTitle>Description</BlockTitle>
            <DescriptionText>{block.description}</DescriptionText>
          </DescriptionSection>
</Block> ))}
    </BlockContainer>
  );
};
export default BlockView;