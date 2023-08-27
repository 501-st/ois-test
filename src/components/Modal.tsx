import React, {useCallback} from 'react';
import styled from "styled-components";
import {TileModalInfo} from "../App";
import {InputComponent} from "./InputComponent";
import axios from "axios";
import {getFetchPhotosUrl} from "../utils";

type OwnProps = {
    hideModal: () => void;
    updateTiles: () => void;
    page: number;
    tileInfo: TileModalInfo
}

export const Modal = (props: OwnProps) => {
    const {hideModal, page, tileInfo, updateTiles} = props

    const onChangeName = useCallback((newName: string) => {
        if (!localStorage.getItem(String(page))){
            axios.get(getFetchPhotosUrl(page))
                .then(response => {
                    response.data[tileInfo.index].title = newName;
                    localStorage.setItem(String(page), JSON.stringify(response.data));
                    updateTiles();
                    hideModal();
                })
        } else {
            const tilesOnCurrentPage = JSON.parse(localStorage.getItem(String(page)) || '');
            tilesOnCurrentPage[tileInfo.index].title = newName;
            localStorage.setItem(String(page), JSON.stringify(tilesOnCurrentPage));
            updateTiles();
            hideModal();
        }
    }, [page, tileInfo, hideModal, updateTiles])

    return (
        <ModalWrapper onClick={hideModal}>
            <Container onClick={e => e.stopPropagation()}>
                <InputComponent currentName={tileInfo.name} onSubmit={onChangeName}/>
            </Container>
        </ModalWrapper>
    );
};

const ModalWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 15px;
  padding: 20px;
  background: white;
  width: 400px;
`;