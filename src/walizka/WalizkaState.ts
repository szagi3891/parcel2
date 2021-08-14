import { action, computed, observable } from "mobx";
import ding_src from 'url:./ding.mp3';


export class WalizkaState {
    @observable offsetLeft = 0;
    @observable offsetTop = 0;

    @observable.ref currentHolding: ImageState | null = null;

    readonly allChilds: Array<ImageState>;

    constructor(list: Array<string>) {
        this.allChilds = list.map((src) => new ImageState(this, src));
    }

    @action onMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
        this.offsetLeft = e.clientX;
        this.offsetTop = e.clientY;

        if (this.currentHolding !== null) {
            this.currentHolding.eventMove(this.offsetLeft, this.offsetTop);
        }
    }

    onMouseUp = () => {
        if (this.currentHolding !== null) {
            this.currentHolding.eventEnd();
            this.currentHolding = null;
        }
    }

    onMouseDown = (current: ImageState) => {
        if (this.currentHolding !== null) {
            this.currentHolding.eventEnd();
            this.currentHolding = null;
        }

        this.currentHolding = current;
    }

    resetAll = () => {
        for (const child of this.allChilds) {
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


export class ImageState {
    @observable staticOffsetLeft: number = 0;
    @observable staticOffsetTop: number = 0;

    @observable drag: null | MouseDragType = null;

    constructor(private readonly parent: WalizkaState, readonly src: string) {
    }

    @action onMouseDown = () => {
        this.parent.onMouseDown(this);

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
        if (this.drag !== null) {
                
            this.staticOffsetLeft = this.offsetLeft;
            this.staticOffsetTop = this.offsetTop;
            this.drag = null;

            const audio = new Audio(ding_src);
            audio.play();
        }
    }

    @action reset = () => {
        this.staticOffsetLeft = 0;
        this.staticOffsetTop = 0;
        this.drag = null;
    }
}
