/**
 * Exceptions file, extends the RootException to use it
 */
export class DewError extends Error
{
    public constructor(name: string, mess: string)
    {
        super();
        this.name = name;
    }
}
