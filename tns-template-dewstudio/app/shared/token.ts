// Generico token interface
interface IToken
{
    idUser: number;
    updated: string;
    created: string;
    expired: string;
    userName: string;
    email: string;
    // separated by commas
    types: string;
    // separated by commas
    claims: string;
}
// token implementation
export class Token implements IToken
{
    public idUser: number = 0;
    public updated: string = "";
    public created: string = "";
    public expired: string = "";
    public userName: string = "";
    public email: string = "";
    public types: string = "";
    public claims: string = "";
}
// roles
export enum RolesTypes
{
    A1 = "ExampleAdmin",
    U1 = "ExampleUser"
}

export enum ClaimsTypes
{
    AC = "AccessControl",
    VC = "ViewControl"
}

export { IToken as IToken };
