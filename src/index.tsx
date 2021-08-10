import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { render } from "react-dom";

class State {
    @observable counter: number = 1;

    up = () => {
        this.counter++;
    }

    down = () => {
        this.counter--;
    }
}

const App = observer(() => {

    const [state] = React.useState(() => new State());

    return (
        <div>
            current = {state.counter}
            <button onClick={state.up}>Up ..dddd</button>
            <button onClick={state.down}>Down .. ---dadas dasdasda</button>
        </div>
    )

});

render(
    <div>
        <h1>Hello World</h1>
        <App />
    </div>
, document.getElementById("root"));

//@ts-expect-error
if (module.hot) {
    //@ts-expect-error
    module.hot.accept();
}