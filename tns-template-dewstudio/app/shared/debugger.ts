/**
 * debug class
 */

export class Debugger
{
    public static IsDebugOn: boolean = false;
    public static log(x: any)
    {
        if (Debugger.IsDebugOn)
            console.log(x);
    }
}