export class UserClass{
    constructor (fullname,username, hosts, personalized_apps, posts=null){
        /***/ this.fullname = fullname; //name + surname
        this.username=username; //at first funnyname
        this.hosts=hosts;
        this.personalized_apps=personalized_apps;
        this.posts= posts;

        /*SOON*/ // super_personalized_apps - tylko dla nielicznych - customowe aplikacje np. PIM production App, Changelog App
    }

    getName = () => this.fullname.split(" ")?.at(0);

    static fromDoc=(doc)=>{
        return doc?new UserClass(doc.id,doc.username,doc.hosts,doc.personalized_apps):null;
    }
}   