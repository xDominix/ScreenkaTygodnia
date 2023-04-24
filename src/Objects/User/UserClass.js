import { getUserFullSrc } from "../../aFunctions";

export class UserClass{
    constructor (fullname,username, src, teams, personalized_apps, posts){
        /***/ this.fullname = fullname; //name + surname
        this.username=username; //at first funnyname
        this.src=getUserFullSrc(src);
        this.teams=teams;
        this.personalized_apps=personalized_apps;
        this.posts= posts;
    }  

    static getDefaultSrc = ()=>getUserFullSrc();
}   