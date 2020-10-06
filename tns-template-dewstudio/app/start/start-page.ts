/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import { NavigatedData, Page } from "@nativescript/core/ui/page";

import { StartViewModel } from "./start-view-model";
import { Debugger } from "~/shared/debugger";

export function onNavigatingTo(args: NavigatedData) {
    const page = args.object as Page;
    try {
        if (page !== null) page.bindingContext = new StartViewModel();
    } catch (err) {
        Debugger.log(err.name);
    }
}
