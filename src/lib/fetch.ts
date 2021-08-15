import axios from "axios";
import { JsonDataType, jsonParse } from "./jsonParse";

const DEFAULT_TIMEOUT = 60 * 1000;

type ParamsGeneralType = {
    url: string,
    body?: unknown,
    extraHeaders?: Record<string, string>
    backendToken?: string,
    timeout: number | 'default',
};

export interface FetchGeneralRawResponseType {
    status: number,
    body: string
}

type MethodType = 'GET' | 'HEAD' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export const fetchGeneralRaw = async (method: MethodType, params: ParamsGeneralType): Promise<FetchGeneralRawResponseType> => {
    const { url, body: bodyParam, extraHeaders, timeout } = params;

    const resp = await axios.request({
        method: method,
        url: url,
        data: bodyParam === undefined ? undefined : JSON.stringify(bodyParam),
        // headers: getHeaders(backendToken, extraHeaders),
        headers: extraHeaders,
        transformResponse: [],
        validateStatus: () => true,
        timeout: timeout === 'default' ? DEFAULT_TIMEOUT : timeout * 1000,
    });

    const respData = resp.data;

    if (typeof respData !== 'string') {
        console.error(respData);
        throw Error('String expected');
    }

    return {
        status: resp.status,
        body: respData
    };
};

export interface FetchGeneralResponseType {
    status: number,
    body: JsonDataType
}
 
export const fetchGeneral = async (method: MethodType, params: ParamsGeneralType): Promise<FetchGeneralResponseType> => {
    const response = await fetchGeneralRaw(method, params);
    const bodyJson = jsonParse(response.body);
    return {
        status: response.status,
        body: bodyJson
    };
};


