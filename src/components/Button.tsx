import { useCallback } from "react";
import styled from "styled-components";

type OwnProps = {
    title: string;
    onClick: () => void;
    disabled?: boolean;
}

export const ButtonComponent = (props: OwnProps) => {

    const { title, onClick, disabled } = props

    const handleClick = useCallback(() => {
        if (!disabled && onClick) {
            onClick();
        }
    }, [onClick, disabled]);

    return (
        <Button
            onClick={handleClick}
            disabled={disabled}
        >
            {title}
        </Button>
    );
};

const Button = styled.button`
  background: aqua;
  font-size: 20px;
  width: 150px;
  height: 50px;
  text-align: center;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  border: none;
  border-radius: 4px;
`;
