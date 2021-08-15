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
import foremeczki_do_piaseczku from './rzeczy/foremeczki_do_piaseczku.jpeg';
import flamingobluzka from './rzeczy/flamingobluzka.jpeg';
import spodenki from './rzeczy/spodenki.webp';
import parasoleczka from './rzeczy/parasoleczka.jpeg';

import { ImageState, WalizkaState } from "./WalizkaState";

const lista = [stroj, wiaderko1, wiaderko2, grabeczki, lopatka1, lopatka2, foremki, czapka, foremeczki_do_piaseczku, flamingobluzka, spodenki, parasoleczka];
interface ImagePropsType {
    zIndex?: number,
}

const Image = styled('img')<ImagePropsType>`
    position: absolute;
    background-color: blue;
    border: 1px solid black;
    padding: 1px;
    ${props => props.zIndex === undefined ? '' : `z-index: ${props.zIndex};`}
`;

const ImageWalizka = styled('img')`
    border: 1px solid black;
    padding: 1px;
`;

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

interface ImageWrapperPropsType {
    imageState: ImageState,
}

const ImageWrapper = observer((props: ImageWrapperPropsType) => {
    const { imageState } = props;

    return (
        <Image
            key={imageState.src}
            src={imageState.src}
            width={100}
            onMouseDown={imageState.onMouseDown}
            draggable={false}
            zIndex={10}
            style={{
                left: `${imageState.offsetLeft}px`,
                top:  `${imageState.offsetTop}px`
            }}
        />
    );
});

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

interface LeftTopPropsType {
    wrapperState: WalizkaState,
}

const LeftTop = observer((props: LeftTopPropsType) => {
    const { wrapperState } = props;

    return (
        <>
            <div>left = {wrapperState.offsetLeft}</div>
            <div>top = {wrapperState.offsetTop}</div>
        </>
    )
});

export const Walizka = observer(() => {
    const [ wrapperState ] = React.useState(() => {
        return new WalizkaState(lista);
    });

    return (
        <WrapperAll onMouseMove={wrapperState.onMouseMove} onMouseUp={wrapperState.onMouseUp}>
            <LeftTop wrapperState={wrapperState} />
            <br/><br/>
            <ButtonResetAll onClick={wrapperState.resetAll}>Rozpakuj wszystko</ButtonResetAll>
            <br/><br/>

            <br/><br/>
            <ImageWalizka src={zielona_walizka} width={500} />
            <ImagesList wrapperState={wrapperState} />
        </WrapperAll>
    );
});
