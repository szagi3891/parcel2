import styled from "@emotion/styled";
import { action, computed, observable } from "mobx";
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
`;

class WrapperState {
    @observable offsetLeft = 0;
    @observable offsetTop = 0;

    private readonly childs: Array<State>;

    constructor() {
        this.childs = [];
    }

    @action onMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
        this.offsetLeft = e.clientX;
        this.offsetTop = e.clientY;

        for (const child of this.childs) {
            child.eventMove(this.offsetLeft, this.offsetTop);
        }
    }

    onMouseUp = () => {
        for (const child of this.childs) {
            child.eventEnd();
        }
    }

    subscribe = (state: State) => {
        this.childs.push(state);
    }

    resetAll = () => {
        for (const child of this.childs) {
            child.reset();
        }
    }
}


interface MouseDragType {
    startLeft: number,
    startTop: number,
    left: number,
    top: number,
}


class State {
    @observable staticOffsetLeft: number = 0;
    @observable staticOffsetTop: number = 0;

    @observable drag: null | MouseDragType = null;

    constructor(private readonly parent: WrapperState) {
        parent.subscribe(this);
    }

    @action onMouseDown = (/*e: React.MouseEvent<HTMLImageElement>*/) => {
        this.drag = {
            startLeft: this.parent.offsetLeft,
            startTop: this.parent.offsetTop,
            left: this.parent.offsetLeft,
            top: this.parent.offsetTop,
        };
    }

    @action eventMove = (left: number, top: number) => {
        if (this.drag === null) {
            return;
        }

        this.drag.left = left;
        this.drag.top = top;
    }

    @computed get offsetLeft(): number {
        if (this.drag === null) {
            return this.staticOffsetLeft;
        }

        return this.staticOffsetLeft + (this.drag.left - this.drag.startLeft);
    }

    @computed get offsetTop(): number {
        if (this.drag === null) {
            return this.staticOffsetTop;
        }

        return this.staticOffsetTop + (this.drag.top - this.drag.startTop);
    }
    
    eventEnd = () => {
        this.staticOffsetLeft = this.offsetLeft;
        this.staticOffsetTop = this.offsetTop;
        this.drag = null;
    }

    @action reset = () => {
        this.staticOffsetLeft = 0;
        this.staticOffsetTop = 0;
        this.drag = null;
    }
}

interface ImageWrapperPropsType {
    parent: WrapperState,
    src: string,
}

const ImageWrapper = observer((props: ImageWrapperPropsType) => {
    const { parent, src } = props;
    const [ state ] = React.useState(() => new State(parent));

    return (
        <Image
            src={src}
            width={100}
            offsetLeft={state.offsetLeft}
            offsetTop={state.offsetTop}
            onMouseDown={state.onMouseDown}
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



export const Walizka = observer(() => {

    const [ wrapperState ] = React.useState(() => new WrapperState());

    // const lista = [stroj, wiaderko1, wiaderko2, grabeczki, lopatka1, lopatka2, foremki];

    return (
        <WrapperAll onMouseMove={wrapperState.onMouseMove} onMouseUp={wrapperState.onMouseUp}>
            <div>left = {wrapperState.offsetLeft}</div>
            <div>top = {wrapperState.offsetTop}</div>
            <br/><br/>
            <ButtonResetAll onClick={wrapperState.resetAll}>Rozpakuj wszystko</ButtonResetAll>
            <br/><br/>
            <ImageWrapper parent={wrapperState} src={stroj} />
            <ImageWrapper parent={wrapperState} src={wiaderko1} />
            <ImageWrapper parent={wrapperState} src={wiaderko2} />
            <ImageWrapper parent={wrapperState} src={grabeczki} />
            <ImageWrapper parent={wrapperState} src={lopatka1} />
            <ImageWrapper parent={wrapperState} src={lopatka2} />
            <ImageWrapper parent={wrapperState} src={foremki} />
            <ImageWrapper parent={wrapperState} src={czapka} />

            <br/><br/>
            <Image src={zielona_walizka} width={500} offsetLeft={0} offsetTop={0} />
        </WrapperAll>
    );
})