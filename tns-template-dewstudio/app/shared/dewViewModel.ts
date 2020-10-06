import { Observable } from "@nativescript/core/data/observable";

import { TokenManager } from "./tokenManager";

export class AvaViewModel extends Observable {
    protected tManager: TokenManager = new TokenManager();

    constructor() {
        super();
    }
    /**
     * Notify changes for a property
     * @param props array with props to notify
     */
    public npc(prop: string | string[]): void {
        if (typeof prop === "string")
            this.notifyPropertyChange(prop, this.get(prop));
        else {
            prop.forEach((item) => {
                this.notifyPropertyChange(item, this.get(item));
            });
        }
    }
}
