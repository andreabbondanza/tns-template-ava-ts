import { View } from 'tns-core-modules/ui/core/view/view';


// class for css, it can be useful for animations
export class CSS
{
    /**
     * Check if the view has passed class   
     * @param v view object
     * @param currClass className
     */
    public static HasClass(v: View, currClass: string)
    {
        return new RegExp("([ ]{1,}|$)" + currClass + "([ ]{1,}|$)").test(v.className);
    }
    /**
     * Add the passed class to class list of object
     * @param v view object
     * @param currClass class name
     */
    public static AddClass(v: View, currClass: string)
    {
        const classRegex = new RegExp("([ ]{1,}|$)" + currClass + "([ ]{1,}|$)");
        if (!classRegex.test(v.className))
            v.className += " " + currClass;
    }
    /**
     * Remove the passed class from class list of object
     * @param v view object
     * @param currClass class name
     */
    public static RemoveClass(v: View, currClass: string)
    {
        if (CSS.HasClass(v, currClass)) 
        {
            const classRegex = new RegExp("([ ]{1,}|$)" + currClass + "([ ]{1,}|$)");
            v.className = v.className.replace(classRegex, " ");
        }
    }
    /**
     * Execute a swap between two classes or add the first if none extists
     * @param v view object
     * @param currClass1 class name 1
     * @param currClass2 class name 2
     */
    public static SwapClass(v: View, currClass1: string, currClass2: string)
    {
        if (CSS.HasClass(v, currClass1)) 
        {
            CSS.RemoveClass(v, currClass1);
            CSS.AddClass(v, currClass2);
        }
        else
        {
            if (CSS.HasClass(v, currClass2)) 
            {
                CSS.RemoveClass(v, currClass2);
                CSS.AddClass(v, currClass1);
            }
            else
                CSS.AddClass(v, currClass1);
        }
    }
}