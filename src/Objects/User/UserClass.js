import { getUserFullSrc } from "../../aFunctions";

export class UserClass{
    constructor (fullname,username, src, teams, personalized_apps, posts){
        /***/ this.fullname = fullname; //name + surname
        this.username=username; //at first funnyname
        this.src=getUserFullSrc(src);
        this.teams=teams;
        this.personalized_apps=personalized_apps;
        this.posts= posts;

        /*SOON*/ // super_personalized_apps - tylko dla nielicznych - customowe aplikacje np. PIM production App, Changelog App
    }  

    static getDefaultSrc = ()=>getUserFullSrc();

    getName = () => this.fullname.split(" ")?.at(0);

    getFullnameShort= ()=>{
        let splits = this.fullname.split(" ");
        splits = splits.map((split,i)=>{return i===0?split:(split.charAt(0)+".")})
        return splits.join(" ");
    }
}   