import { AvaModel } from "~/shared/dewModel";

export default class HomeModel extends AvaModel {
    public name: string = "";
    public get nameHello(): string {
        if (this.name.length === 0) return "";
        return "Hello " + this.name.capitalize();
    }
}

export class HomeItem extends AvaModel {
    public userId: number = 0;
    public id: number = 0;
    public title: string = "";
    public completed: boolean = false;
}
