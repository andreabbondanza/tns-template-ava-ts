import { DewViewModel } from "../shared/dewViewModel";
import HomeModel, { HomeItem } from "./home-model";

import { Timing } from "~/shared/timing";
import { DewError } from "~/shared/errors";
import { RestClientErrors, HttpError, RestClient } from "~/shared/restClient";
import { Debugger } from "~/shared/debugger";
import { ObservableArray } from "@nativescript/core/data/observable-array";
import * as dialogs from "@nativescript/core/ui/dialogs";
import { EventData } from "@nativescript/core/data/observable";

export class HomeViewModel extends DewViewModel {
    private _loginState: boolean = false;
    private _restItems: HomeItem[] = [];

    public get restItems() {
        return new ObservableArray<HomeItem>(this._restItems);
    }

    public model: HomeModel = new HomeModel();
    public exceptionType: string = "";
    public state: number = 0;

    public get loginText(): string {
        return this._loginState ? "LOGOUT" : "LOGIN";
    }
    public get items(): string[] {
        return [
            "Common view model for login management (jwt token manager) and notify property changes",
            "A rest client for web requests with standard responses",
            "An utils class with some stuff (delays, etc.)",
            "A system for exceptions class",
            "A common main model to copy objects",
            "A debugger class",
            "Check readme for know all amazing stuff",
        ];
    }

    constructor() {
        super();
    }

    // methods

    public onFirstExceptionTap(args: EventData) {
        try {
            throw new DewError("First Exception", "Bla bla bla");
        } catch (error) {
            this.exceptionType = error.name;
            this.npc("exceptionType");
        }
    }

    public onSecondExceptionTap(args: EventData) {
        try {
            throw new DewError("Second Exception", "Bla bla bla");
        } catch (error) {
            this.exceptionType = error.name;
            this.npc("exceptionType");
        }
    }
    public async onRestRequestTap(args: EventData) {
        if (this._restItems.length < 5) {
            try {
                const client = new RestClient();
                const resp = await client.GET(
                    "https://jsonplaceholder.typicode.com/todos/" +
                        (this._restItems.length + 1)
                );
                const result = resp.toStandardResponseData<HomeItem>();
                Debugger.log(result);
                this._restItems.push(result.data);
                this.npc("restItems");
            } catch (error) {
                if (error.name === RestClientErrors.HttpError) {
                    const e = error as HttpError;
                    Debugger.log(e.message);
                    dialogs.alert(e.message);
                }
            }
        } else {
            dialogs.alert("Items ended");
        }
    }
    public onTimeoutTap(args: EventData) {
        Timing.timeout(() => {
            this.state += 10;
            this.npc("state");
        }, 2000);
    }

    public onRepeatTap(args: EventData) {
        this.state = 0;
        Timing.repeat((handler: number) => {
            this.state += 10;
            this.npc("state");
            if (this.state >= 100) clearInterval(handler);
        }, 1000);
    }

    public onLoginTap(args: EventData) {
        if (!this.tManager.isLoaded()) {
            // generated on https://jwt.io/
            this.tManager.setToken(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjUsInVwZGF0ZWQiOiIyMDE5LTA1LTE3IiwiY3JlYXRlZCI6IjIwMTktMDUtMTYiLCJleHBpcmVkIjoiMjAxOS0xMC0yOCIsInVzZXJOYW1lIjoiQmF0bWFuIiwiZW1haWwiOiJtZXRyb3BvbGlzX3N1Y2tzQG91dGxvb2suY29tIiwidHlwZXMiOiJBMSxBMiIsImNsYWltcyI6bnVsbH0.Ccwzbd-NRnPdUJsI7zmAWtshPjXP7i6FjxkWYfjmfQQ"
            );
            this._loginState = this.tManager.loadLocalToken();
            this.model.name = this.tManager.getTokenObject().userName;
            this.npc("loginText");
            this.npc("model");
        } else {
            this.tManager.unsetToken();
            this._loginState = this.tManager.isLoaded();
            this.model = new HomeModel();
            this.npc("loginText");
            this.npc("model");
        }
    }
}
