/**
 * Exceptions file, extends the RootException to use it
 */
export class AvaError extends Error {
    public constructor(name: string, mess: string) {
        super();
        this.name = name;
    }
}
