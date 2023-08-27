import {useState, useCallback, ChangeEvent} from "react";
import styled from "styled-components";
import {ButtonComponent} from "./Button";

export type OwnProps = {
    currentName: string;
    onSubmit: (value: string) => void;
}

export const InputComponent = (props: OwnProps) => {
    const {currentName, onSubmit} = props
    const [timestamp, setTimestamp] = useState<number>(0)
    const [text, setText] = useState<string>(currentName);

    const handleSubmit = useCallback(() => {
        onSubmit(text);
    }, [text, onSubmit]);

    const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
        if (timestamp + 300 <= Date.now()){
            console.log(e.target.value)
            setTimestamp(() => Date.now())
        }
    }, [timestamp, setText])



    return (
        <>
            <div>
                Edit name
            </div>
            <Input
                type="text"
                value={text}
                onChange={onChangeName}
            />
            <ButtonComponent title={'Confirm'} onClick={handleSubmit} disabled={text === currentName || !text}/>
        </>
    );
};

const Input = styled.input`
  border-radius: 15px;
  background: white;
  padding: 5px 10px;
  margin: 20px 0;
  width: 100%;
`;
