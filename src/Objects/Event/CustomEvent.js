import { Event } from "./_Event";

export class CustomEvent extends Event {
    constructor(name,description,for_,experience,isTimeFunction,max_views,views_till){
        super(name,description,for_,0,experience,max_views,views_till)
        this.isTime =  (typeof isTimeFunction === 'function')? isTimeFunction: null;
    }
    
    isTime = (props={})=> this.isTime ? this.isTime(props) : null;
}