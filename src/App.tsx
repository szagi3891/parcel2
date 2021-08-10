import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";


class State {
    @observable counter: number = 1;

    up = () => {
        this.counter++;
    }

    down = () => {
        this.counter--;
    }
}

export const App = observer(() => {

    const [state] = React.useState(() => new State());

    return (
        <div>
            current = {state.counter}
            <button onClick={state.up}>Up ..dddd</button>
            <button onClick={state.down}>Down .. ---dadas dasdasda</button>
        </div>
    )

});
