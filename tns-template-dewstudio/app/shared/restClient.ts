import {
    HttpRequestOptions,
    HttpResponse,
    request,
} from "@nativescript/core/http";
import {
    TNSHttpFormData,
    TNSHttpFormDataParam,
    TNSHttpFormDataResponse,
} from "nativescript-http-formdata";

import { Debugger as _ } from "./debugger";
import { DewError } from "./errors";

export default class StandardResponse<T> {
    public data: T;
    public errorMessage!: string;
    public error: StandardError = new StandardError();
}

class StandardError {
    public desc: string = "";
    public number: number = 0;
}

export { StandardError };

export enum RestClientErrors {
    HttpError = "HttpError",
    HttpErrorM = "HttpErrorM",
}

export class HttpError extends DewError {
    public constructor(resp: RestResponse<HttpResponse>) {
        super(RestClientErrors.HttpError, resp.response.statusCode.toString());
        this.response = resp;
    }
    public response: RestResponse<HttpResponse>;
}

export class HttpErrorM extends DewError {
    public constructor(resp: RestResponse<TNSHttpFormDataResponse>) {
        super(RestClientErrors.HttpErrorM, resp.response.statusCode.toString());
        this.response = resp;
    }
    public response: RestResponse<TNSHttpFormDataResponse>;
}

export enum TypeRestResponse {
    Multi,
    Normal,
}

export class RestResponse<T> {
    private _typeResponse: TypeRestResponse = TypeRestResponse.Normal;
    private _response: T = null;
    public get typeResponse() {
        return this.response;
    }
    public get response() {
        return this._response;
    }
    public constructor(response: T) {
        this._response = response;
    }
    /**
     * Use it if server return a StandardResponse object
     */
    public toStandardResponse<U>(): StandardResponse<U> {
        const response = new StandardResponse<U>();
        var json = "";
        if (this.response.hasOwnProperty("body"))
            json = (this.response as any).body;
        else json = (this.response as any).content.toJSON();
        return Object.assign(response, json) as StandardResponse<U>;
    }
    /**
     * Use it if server return raw objects
     */
    public toStandardResponseData<U>(): StandardResponse<U> {
        const response = new StandardResponse<U>();
        var json = "";
        if (this.response.hasOwnProperty("body"))
            json = (this.response as any).body;
        else json = (this.response as any).content.toJSON();
        let temp = {};
        response.data = (Object.assign(temp, json) as unknown) as U;
        return response;
    }
}

export class RestClient {
    public static Api: string = "http://10.0.0.100:22000/sapi/";
    public constructor() {}

    public DefaultHeaders: {};

    public log(url: string, method: string, headers: any, data: any) {
        _.log("Url: " + url);
        _.log("Method: " + method);
        _.log("Headers: ");
        _.log(headers);
        _.log("Data: ");
        _.log(data);
    }
    /**
     * Perform a multipart/form-data request
     * @param url the url
     * @param data data object
     * @param headers headers
     */
    public async POSTMP(
        url: string,
        data: object | null,
        headers?: object | null
    ): Promise<RestResponse<TNSHttpFormDataResponse>> {
        let resp: TNSHttpFormDataResponse = null;
        const client = new TNSHttpFormData();
        const fData: TNSHttpFormDataParam[] = [];
        if (data !== null) {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const element = data[key];
                    fData.push({
                        parameterName: key,
                        data: element,
                    });
                }
            }
        }
        if (headers === null) {
            headers = this.DefaultHeaders;
        } else {
            for (let key in this.DefaultHeaders) {
                if (!headers.hasOwnProperty(key)) {
                    headers[key] = this.DefaultHeaders[key];
                }
            }
        }
        headers["Content-type"] = "multipart/form-data";
        try {
            this.log(url, "POST", headers, fData);
            resp = await client.post(url, fData, {
                headers: headers,
            });
            _.log(resp.body);
            return new RestResponse<TNSHttpFormDataResponse>(resp);
        } catch (error) {
            throw new HttpErrorM(
                new RestResponse<TNSHttpFormDataResponse>(resp)
            );
        }
    }
    /**
     * Execute a POST httprequest
     * @param options options
     * @throws HttpError
     */
    public async POST(
        url: string,
        data: object | null,
        headers?: object | null
    ): Promise<RestResponse<HttpResponse>> {
        if (headers === null) {
            headers = this.DefaultHeaders;
        } else {
            for (let key in this.DefaultHeaders) {
                if (!headers.hasOwnProperty(key)) {
                    headers[key] = this.DefaultHeaders[key];
                }
            }
        }
        const jsonData = data !== null ? JSON.stringify(data) : null;
        const finalOptions: HttpRequestOptions = {
            method: "POST",
            content: jsonData,
            url,
            headers: headers,
        };
        this.log(url, "POST - NO MULTIPART", headers, data);
        const resp = await request(finalOptions);
        _.log(resp.content.raw);
        if (resp.statusCode >= 200 && resp.statusCode < 300)
            return new RestResponse<HttpResponse>(resp);
        else throw new HttpError(new RestResponse<HttpResponse>(resp));
    }
    /**
     * Execute a POST httprequest
     * @param options options
     * @throws HttpError
     */
    public async PUT(
        url: string,
        data: object | null,
        headers?: object | null
    ): Promise<RestResponse<HttpResponse>> {
        if (headers === null) {
            headers = this.DefaultHeaders;
        } else {
            for (let key in this.DefaultHeaders) {
                if (!headers.hasOwnProperty(key)) {
                    headers[key] = this.DefaultHeaders[key];
                }
            }
        }
        const jsonData = data !== null ? JSON.stringify(data) : null;
        const finalOptions: HttpRequestOptions = {
            method: "PUT",
            content: jsonData,
            url,
            headers: headers,
        };
        this.log(url, "PUT - NO MULTIPART", headers, data);
        const resp = await request(finalOptions);
        _.log(resp.content.raw);
        if (resp.statusCode >= 200 && resp.statusCode < 300)
            return new RestResponse<HttpResponse>(resp);
        else throw new HttpError(new RestResponse<HttpResponse>(resp));
    }
    /**
     * Execute an httprequest
     * @param options options
     * @throws HttpError
     */
    public async GET(
        url: string,
        headers?: object | null
    ): Promise<RestResponse<HttpResponse>> {
        const finalOptions: HttpRequestOptions = {
            method: "GET",
            url,
            headers: headers,
        };
        this.log(url, "GET", headers, null);
        const resp = await request(finalOptions);
        _.log(resp.content.raw);
        if (resp.statusCode >= 200 && resp.statusCode < 300)
            return new RestResponse<HttpResponse>(resp);
        else throw new HttpError(new RestResponse<HttpResponse>(resp));
    }
}
