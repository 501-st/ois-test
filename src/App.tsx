import {Tile} from "./components/Tile";
import {ButtonComponent} from "./components/Button";
import {getFetchPhotosUrl} from "./utils";
import {Photo} from "./types";
import {useCallback, useEffect, useMemo, useState} from "react";
import axios from "axios";
import styled from "styled-components";
import {Modal} from "./components/Modal";

export type TileModalInfo = {
    id: number;
    name: string;
    index: number;
}

const fakeArray: number[] = []
for (let i = 0; i < 10; i++) {
    fakeArray.push(i)
}

export default function App() {
    const [tiles, setTiles] = useState<Photo[] | null>(null);
    const [page, setPage] = useState<number>(0)
    const [isError, setIsError] = useState<boolean>(false)
    const [isLocalStorageEmpty, setIsLocalStorageEmpty] = useState<boolean>(false)
    const [isShowModal, setIsShowModal] = useState<boolean>(false)
    const [tileInfo, setTileInfo] = useState<TileModalInfo | null>(null)

    useEffect(() => {
        const controller = new AbortController();
        const cachedData = localStorage.getItem(String(page))

        if (cachedData) {
            setTiles(JSON.parse(cachedData));
        } else {
            axios.get(getFetchPhotosUrl(page), {signal: controller.signal})
                .then(response => {
                    localStorage.setItem(String(page), JSON.stringify(response.data));
                    setIsLocalStorageEmpty(false)
                    setTiles(response.data);
                }).catch((e) => {
                if (e.message !== 'canceled') {
                    setIsError(true)
                }
            })
        }

        return () => {
            controller.abort()
        };
    }, [page, setTiles, setIsError]);

    const updateTiles = useCallback(() => {
        const cachedData = localStorage.getItem(String(page))
        if (cachedData) {
            setTiles(JSON.parse(cachedData));
            setIsLocalStorageEmpty(false)
        }
    }, [page, setTiles])

    const onClickPrevious = useCallback(() => {
        setPage(page - 1);
    }, [setPage, page])

    const onClickNext = useCallback(() => {
        setPage(page + 1);
    }, [setPage, page])

    const onClearCache = useCallback(() => {
        localStorage.clear()
        setIsLocalStorageEmpty(true)
    }, [setIsLocalStorageEmpty])

    const buttonContent = useMemo(() => (
        <ButtonContainer>
            <ButtonComponent title={'Previous'} onClick={onClickPrevious} disabled={page < 1}/>
            <ButtonComponent title={'Next'} onClick={onClickNext} disabled={page > 3}/>
            <ButtonComponent title={'Clear cache'} onClick={onClearCache} disabled={isLocalStorageEmpty}/>
        </ButtonContainer>
    ), [onClickPrevious, onClickNext, page, onClearCache, isLocalStorageEmpty])

    const errorContent = useMemo(() => (
        <ErrorContainer>
            <p>
                Sorry, something went wrong.
            </p>
            <p>
                Please try to load later.
            </p>
        </ErrorContainer>
    ), [])

    const onTileClick = useCallback((id: number, name: string, index: number) => {
        setTileInfo({id, name, index})
        setIsShowModal(true)
    }, [])

    return (
        <Wrapper>
            {!isError && buttonContent}
            {isError ? errorContent :
                <TileContainer>
                    {tiles ? tiles?.map((tile, index) => (
                        <Container key={tile.id} onClick={() => onTileClick(tile.id, tile.title, index)}>
                            <Tile title={tile.title} thumbnailUrl={tile.thumbnailUrl}/>
                        </Container>
                    )) : fakeArray.map((number) => (
                        <Container key={number}>
                            <Tile title={'Loading'}/>
                        </Container>
                    ))}
                </TileContainer>}
            {isError && <ButtonComponent title={'Reload page'} onClick={() => window.location.reload()}/>}
            {isShowModal && tileInfo &&
                <Modal tileInfo={tileInfo} page={page} hideModal={() => setIsShowModal(false)}
                       updateTiles={updateTiles}/>}
        </Wrapper>
    );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  position: relative;
`;

const TileContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 320px;
  flex-wrap: wrap;
  margin: 20px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  column-gap: 20px;
`;

const ErrorContainer = styled.div`
  margin-bottom: 20px;
`;

const Container = styled.div`
  position: relative;
  cursor: pointer;
`;
