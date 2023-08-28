import styled from "styled-components";

type OwnProps = {
    title: string;
    thumbnailUrl?: string
}

export const Tile = (props: OwnProps) => {
    const {thumbnailUrl, title} = props

    return (
        <>
            <Title>{title}</Title>
            {title === 'Loading' ? <FakeImage/> : <Image src={thumbnailUrl} alt={title}/>}
        </>
    );
};

const Title = styled.p`
  width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Image = styled.img`
  border-radius: 4px;
  pointer-events: none;
`;

const FakeImage = styled(Image)`
  width: 150px;
  height: 150px;
  background: gray;
`;
