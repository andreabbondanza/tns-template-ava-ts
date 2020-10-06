import * as base64 from "base-64";
import * as appSettings from "@nativescript/core/application-settings";
import * as utf8 from "utf8";

import { Token, RolesTypes, IToken, ClaimsTypes } from "./token";

// NOTE: WORK WITH JWT TOKEN

export class TokenManager {
    private localKey: string = "adf4567cae584a556";
    private token: string | null = null;
    /**
     * Set the token in the app settings
     */
    private setLocalToken(): void {
        appSettings.setString(this.localKey, this.getTokenString());
    }
    /**
     * Return standard Header authorization as array
     */
    public getTokenHeaderArray(): string[] {
        return ["Authorization", "Bearer " + this.getTokenString()];
    }
    /**
     * Return standard Header authorization as object
     */
    public getTokenHeader(): {} {
        return { Authorization: "Bearer " + this.getTokenString() };
    }
    private atob(toConvert: string): string {
        return utf8.decode(base64.decode(toConvert));
    }
    /**
     * Return token string, works with jwt token
     */
    public getTokenJsonString(): string | null {
        let tokenized: string[] = [];
        if (this.token !== null) tokenized = this.getTokenString().split(".");
        if (tokenized.length > 0) return this.atob(tokenized[1]);
        return null;
    }
    /**
     * Return the Token as type
     */
    public getTokenObject(): IToken | null {
        let tokenized: string[] = [];
        if (this.token !== null) tokenized = this.getTokenString().split(".");
        if (tokenized.length > 0)
            return Object.assign(
                new Token(),
                JSON.parse(decodeURIComponent(this.atob(tokenized[1])))
            );
        return null;
    }
    /**
     * Return token string
     */
    public getTokenString(): string {
        if (this.token !== null) return this.token;
        throw new ReferenceError("Token is missed, not loaded");
    }
    /**
     * Check if the owner of current token is an admin
     */
    public isAdmin(): boolean {
        const token = this.getTokenObject();
        if (token !== null) {
            for (const elem of token.types) {
                if (elem === RolesTypes.A1) return true;
            }
        }
        return false;
    }
    /**
     * Check if an user has roles
     * @param role the role
     */
    public hasClaim(claim: ClaimsTypes): boolean {
        const token = this.getTokenObject();
        if (token !== null) {
            for (const elem of token.claims) {
                if (elem === claim) return true;
            }
        }
        return false;
    }
    /**
     * Check if an user has roles
     * @param role the role
     */
    public hasRole(role: RolesTypes): boolean {
        const token = this.getTokenObject();
        if (token !== null) {
            for (const elem of token.types) {
                if (elem === role) return true;
            }
        }
        return false;
    }
    /**
     * Check if a valid token is loaded
     */
    public isLoaded(): boolean {
        if (this.token === null) return false;
        const tJson = this.getTokenJsonString();
        if (tJson !== null) {
            const json = JSON.parse(tJson);
            if (typeof json === "object") {
                return true;
            }
        }
        return false;
    }
    /**
     * Load the token from localstorage
     */
    public loadLocalToken(): boolean {
        let loaded: string | null = null;
        loaded = appSettings.getString(this.localKey, null);
        if (loaded !== null) {
            if (loaded.split(".").length === 3) {
                const json = JSON.parse(this.atob(loaded.split(".")[1]));
                if (typeof json === "object") {
                    this.token = loaded;
                    return true;
                } else {
                    throw new SyntaxError("Local token is invalid");
                }
            } else {
                throw new SyntaxError("Local token is invalid");
            }
        }
        return false;
    }
    /**
     * Set the token string
     * @param token token string
     */
    public setToken(token: string): void {
        this.token = token;
        this.setLocalToken();
    }
    /**
     * Remove token from vuex and storage
     */
    public unsetToken(): void {
        this.token = null;
        appSettings.remove(this.localKey);
    }
}
