import { observable } from "mobx";

const TIMEOUT = 10000;

interface ResultLoading {
    readonly type: 'loading',
}

interface ResultReady<T> {
    readonly type: 'ready',
    readonly value: T
};

interface ResultError {
    readonly type: 'error',
}

export type Result<T> = ResultLoading | ResultReady<T> | ResultError;

interface Response<T> {
    readonly requestId: number,
    readonly result: Result<T>,
}

class RequestController<T> {
    private getValue: () => Promise<T>;
    private nextRequestId: number;

    constructor(getValue: () => Promise<T>) {
        this.getValue = getValue;
        this.nextRequestId = 1;
    }

    private getNextRequestId(): number {
        const requestId = this.nextRequestId;
        this.nextRequestId++;
        return requestId;
    }

    public send(): Promise<Response<T>> {
        const requestId = this.getNextRequestId();

        return new Promise((resolve) => {
            setTimeout(() => {
                const result: Result<T> = {
                    type: 'error'
                };

                const response: Response<T> = {
                    requestId,
                    result
                };

                resolve(response);
            }, TIMEOUT);

            setTimeout(async () => {
                try {
                    const value = await this.getValue();

                    const response: Response<T> = {
                        requestId,
                        result: {
                            type: 'ready',
                            value
                        }
                    };
    
                    resolve(response);
                } catch (err) {
                    console.error(err);

                    const response: Response<T> = {
                        requestId,
                        result: {
                            type: 'error'
                        }
                    };
    
                    resolve(response);
                }

            }, 0);
        })
    }

    public getEmpty(): Response<T> {
        const requestId = this.getNextRequestId();

        const result: Result<T> = {
            type: 'loading',
        };

        return {
            requestId,
            result
        };
    }
}

class ResourceInit<T> {
    private readonly requestController: RequestController<T>;
    @observable.ref private value: Response<T>;

    public constructor(getValue: () => Promise<T>) {
        this.requestController = new RequestController(getValue);
        this.value = this.requestController.getEmpty();

        setTimeout(async (): Promise<void> => {
            const response = await this.requestController.send();
            this.saveResponse(response);
        }, 0);
    }

    public get(): Result<T> {
        return this.value.result;
    }

    private saveResponse(newResponse: Response<T>) {
        if (this.value.requestId > newResponse.requestId) {
            return;
        }

        if (this.value.result.type === 'loading') {
            this.value = newResponse;
            return;
        }

        if (newResponse.result.type === 'ready') {
            this.value = newResponse;
            return;
        }

        console.error('Ignore response', {
            prevResponse: this.value,
            nextResponse: newResponse
        });
    }

    async clear(): Promise<void> {
        this.value = this.requestController.getEmpty();

        const response = await this.requestController.send();
        this.saveResponse(response);
    }

    async refreshAndWait(): Promise<void> {
        const response = await this.requestController.send();
        this.saveResponse(response);
    }
}

type ResourceState<T> = {
    type: 'not-init',
    getValue: () => Promise<T>,
} | {
    type: 'init',
    resource: ResourceInit<T>,
};

export class Resource<T> {
    private stateInner: ResourceState<T>;

    constructor(getValue: () => Promise<T>) {
        this.stateInner = {
            type: 'not-init',
            getValue
        };
    }

    private get state(): ResourceInit<T> {
        if (this.stateInner.type === 'not-init') {
            const resource = new ResourceInit(this.stateInner.getValue);
            this.stateInner = {
                type: 'init',
                resource
            };
            return resource;
        } else {
            return this.stateInner.resource;
        }
    }

    get(): Result<T> {
        return this.state.get();
    }

    async clearAndWait(): Promise<void> {
        await this.state.clear();
    }

    clear() {
        this.clearAndWait().catch((error) => {
            console.error("Resource clear:", error);
        });
    }

    async refreshAndWait(): Promise<void> {
        await this.state.refreshAndWait();
    }

    refresh() {
        this.refreshAndWait().catch((error) => {
            console.error("Resource refresh:", error);
        });
    }
}
