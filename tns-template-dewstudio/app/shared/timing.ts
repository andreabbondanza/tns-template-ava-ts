/**
 * Utils class
 */

export class Timing
{
    /**
     * Delay for a time
     * @param ms time in milliseconds
     */
    public static async delay(ms: number)
    {
        return new Promise((r, j) => setTimeout(r, ms));
    }
    /**
     * Execute a callback after the time
     * @param callback the callback to execute
     * @param ms time in milliseconds
     */
    public static async timeout(callback: () => void, ms: number): Promise<void>
    {
        await Timing.delay(ms);
        callback();
    }
    /**
     * Repeat a callback that get the handler
     * @param callback the callback to execute
     * @param ms time in ms
     */
    public static async repeat(callback: (handler: number) => void, ms: number): Promise<{}>
    {
        return new Promise((r, j) =>
        {
            const handler = setInterval(() =>
            {
                callback(handler);
            }, ms);
        });
    }
    /**
     * Clear the timeout handler
     * @param handler timeout handler
     */
    public static clearTimeout(handler: number): void
    {
        clearTimeout(handler);
    }
    /**
     * Clear the interval handler
     * @param handler interval handler
     */
    public static clearRepeat(handler: number): void
    {
        clearInterval(handler);
    }
}