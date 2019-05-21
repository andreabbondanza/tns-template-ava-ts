export class DewModel
{
    /**
     * This function convert a json (fake T) object (without properties) to a T object with properties
     * @param obj1 start object
     * @param obj2 Target object
     */
    public CopyFromObject<T>(json: any): T
    {
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                const element = json[key];
                this[key] = json[key];
            }
        }
        return this as unknown as T;
    }
}