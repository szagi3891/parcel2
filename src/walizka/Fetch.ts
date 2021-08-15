import { createGuard } from "src/lib/createGuard";
import { fetchGeneral } from "src/lib/fetch";
import { Resource } from "src/lib/Resource";
import * as t from 'io-ts';

const ListItemIO = t.interface({
    id: t.string,
    name: t.string,
});

type ListItemType = t.TypeOf<typeof ListItemIO>;

const ListIO = t.array(ListItemIO);

const isList = createGuard(ListIO);

export class Fetch {

    readonly listSport: Resource<Array<ListItemType>>;

    constructor() {
        this.listSport = new Resource(async (): Promise<Array<ListItemType>> => {

            const result = await fetchGeneral('GET', {
                url: '/api/sports',
                timeout: 'default'
            });

            if (result.status === 200 && result.body.type === 'json') {
                if (isList(result.body.json)) {
                    return result.body.json;
                }
            }

            console.error('Błędne dane', result);
            return [];
        });
    }
}