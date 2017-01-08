/**
 * Created by EdgeTech on 2/11/2016.
 */


export class Vehicle{
    private model: string;
    private make: string;
    private year: number;

    constructor(data){
        this.model = data["model"];
        this.make = data["make"];
        this.year = data["year"];

    }

}