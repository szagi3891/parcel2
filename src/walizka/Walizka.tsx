import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import React from "react";
import zielona_walizka from './rzeczy/zielona_walizka.jpeg';
import stroj from './rzeczy/stroj_kompielowy.webp';
import wiaderko1 from './rzeczy/wiaderko1.jpeg';
import wiaderko2 from './rzeczy/wiaderko2.jpeg';
import grabeczki from './rzeczy/grabeczki.jpeg';
import lopatka1 from './rzeczy/lopatka1.jpeg';
import lopatka2 from './rzeczy/lopatka2.jpeg';
import foremki from './rzeczy/foremki.jpeg';
import czapka from './rzeczy/czapka_z_daszkiem.jpeg';
import { ImageState, WalizkaState } from "./WalizkaState";

interface ImagePropsType {
    offsetLeft: number,
    offsetTop: number,
    zIndex?: number,
}

const Image = styled('img')<ImagePropsType>`
    position: relative;
    border: 1px solid black;
    padding: 1px;
    left: ${props => props.offsetLeft}px;
    top: ${props => props.offsetTop}px;
    ${props => props.zIndex === undefined ? '' : `z-index: ${props.zIndex};`}
    /* transition: left 1s, top 1s; */
`;

interface ImageWrapperPropsType {
    imageState: ImageState,
}

const ImageWrapper = observer((props: ImageWrapperPropsType) => {
    const { imageState } = props;

    return (
        <Image
            src={imageState.src}
            width={100}
            offsetLeft={imageState.offsetLeft}
            offsetTop={imageState.offsetTop}
            onMouseDown={imageState.onMouseDown}
            draggable={false}
            zIndex={10}
        />
    );
});

const WrapperAll = styled('div')`
    position: relative;
    background-color: #e0e0e0;
    border: 1px solid black;
`;

const ButtonResetAll = styled('button')`
    position: absolute;
    right: 10px;
    top: 10px;
    padding: 30px;
    font-size: 20px;
`;

interface ImagesListPropsType {
    wrapperState: WalizkaState,
}

const ImagesList = observer((props: ImagesListPropsType) => {
    const out = [];

    for (const imageState of props.wrapperState.allChilds) {
        out.push(
            <ImageWrapper
                key={imageState.src}
                imageState={imageState}
            />
        )
    }

    return (
        <div>
            { out }
        </div>
    );
});

export const Walizka = observer(() => {
    const [ wrapperState ] = React.useState(() => {
        const lista = [stroj, wiaderko1, wiaderko2, grabeczki, lopatka1, lopatka2, foremki, czapka];
        return new WalizkaState(lista);
    });

    return (
        <WrapperAll onMouseMove={wrapperState.onMouseMove} onMouseUp={wrapperState.onMouseUp}>
            <div>left = {wrapperState.offsetLeft}</div>
            <div>top = {wrapperState.offsetTop}</div>
            <br/><br/>
            <ButtonResetAll onClick={wrapperState.resetAll}>Rozpakuj wszystko</ButtonResetAll>
            <br/><br/>
            <ImagesList wrapperState={wrapperState} />

            <br/><br/>
            <Image src={zielona_walizka} width={500} offsetLeft={0} offsetTop={0} />
        </WrapperAll>
    );
});
