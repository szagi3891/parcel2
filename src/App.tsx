import styled from "@emotion/styled";
import { computed, observable } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { Walizka } from "./walizka/Walizka";

class State {
    @observable counter: number = 10;

    up = () => {
        this.counter++;
    }

    down = () => {
        this.counter--;
    }

    reset = () => {
        this.counter = 0;
    }
}

class KolorState {
    @observable reverse: boolean = false;

    toogle = () => {
        this.reverse = !this.reverse;
    }

    @computed get color(): string {
        return this.reverse ? 'yellow' : 'purple';
    }

    @computed get backgroundColor(): string {
        return this.reverse ? 'purple' : 'yellow';
    }
}

const Current = styled('div')`
    color: red;
    border: 1px solid black;
    background-color: blue;
`;

interface CorkiWrapperPropsType {
    children: React.ReactNode,
}

const CorkiWrapper = observer((props: CorkiWrapperPropsType) => {
    const [ state ] = React.useState(() => new KolorState());
    const { children } = props;

    return (
        <Corki color={state.color} backgroudColor={state.backgroundColor} onClick={state.toogle}>
            { children }
        </Corki>
    )
});

interface CorkiPropsType {
    color: string,
    backgroudColor: string,
}
const Corki = styled('div')<CorkiPropsType>`
    border: 1px solid black;
    margin: 20px 0;
    padding: 5px;
    color: ${props => props.color};
    background-color: ${props => props.backgroudColor};
    font-size: 20px;
`;

export const App = observer(() => {

    const [state] = React.useState(() => new State());

    const onClick = () => {
        // alert('Aaaaaa !');
    };

    return (
        <div>
            <Current onClick={onClick}>
                current = {state.counter}
            </Current>
            <CorkiWrapper>
                Dzieci - to Weronika i Basia kotek miau. Serduszko. 6 3
            </CorkiWrapper>

            <CorkiWrapper>
                Basia kotek.
            </CorkiWrapper>

            <div>
                <button onClick={state.up}>Up ..d</button>
            </div>
            <div>
                <button onClick={state.down}>Down ..</button>
            </div>
            <div>
                <button onClick={state.reset}>reset</button>
            </div>

            <Walizka />
        </div>
    )

});
