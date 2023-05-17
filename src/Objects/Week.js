import { toMap } from "../aFunctions";
import { Day, toWeekDay } from "./Day/Day";

export class Week{
    constructor(   name,start_date,  description,emoji, blocked_apps, extra_apps,special_days_map=new Map(), force_screenka_show, participants,apps_counts_map=new Map(),latest_map=new Map(),  screenka_views_map=new Map(),max_tickets=null) {
        /***/ this.name = name; //gdy bedziemy chcieli sobie wziac po week_namie z posta,
        this.start_date = start_date; // filtrujemy czy currweekdate===newdate, filtrujemy po datach ktore so przed teraz, a pozniej sortujemy po najwyzszej i nia bierzemy - tym samym nowy week odbedzie wtedy kiedy start_date - wraz ze screenka!
        this.description = description; // opis tygodnia, zawierac moze uwagi tygodnia np. spersonalizuj by dodac settingsy! (wejdz na /login)
        this.emoji = emoji;

        /*?*/ this.blocked_apps = blocked_apps; //- np. #1 week bez person section , innego robisz zen-week itp. 
        /*?*/ this.extra_apps = extra_apps; // sa one jakby popular apps

        this.participants = participants
        this.apps_counts_map = apps_counts_map;
        this.latest_map = latest_map;

        this.screenka_views_map = screenka_views_map; // user_fullname => view_date, /*SOON*/ comment, rate...

        this.special_days_map = special_days_map; //week_day => name, description  /*SOON */ // fromHour, toHour

        /*4DEMO*/ this.force_screenka_show = force_screenka_show;

        this.max_tickets = max_tickets;//- np. 1 (one-ticket-week), 5 (dla wiekszych kontenciarzy) / jesli nie ma weeka, i ograniczenie sie pozniej pojawi, to good for you (goscia co zapostowal juz z 3 ticketami.. prawdziwy fan co postuje juz od poczatku tygodnia!...

    }

    getSpecialDays =()=>{
        let days = []
        this.special_days_map.forEach((value,week_name)=> days.push(new Day(value.name,toWeekDay(week_name),"",value.description)))
        return days;
    }

    static fromDoc=(doc)=>{
        if(!doc) return;

        let screenka_views = toMap(doc.screenka_views_map);
        //var newEntries = Array.from(screenka_views, ([key, value]) => [key, {...value,view_date:value.view_date.toDate()}]);
        //screenka_views = new Map(newEntries);
        screenka_views.forEach((value,)=>value.view_date= value.view_date.toDate());

        let latest = toMap(doc.latest_map);
        //var newEntries = Array.from(latest, ([key, value]) => [key, {...value,date:value.date?.toDate()}]);
        //screenka_views = new Map(newEntries);
        latest.set("date",latest.get("date").toDate());

        return new Week(doc.id,doc.start_date.toDate(),doc.description,doc.emoji,doc.blocked_apps,doc.extra_apps,toMap(doc.special_days_map),doc.force_screenka_show,doc.participants,toMap(doc.apps_counts_map),latest,screenka_views,doc.max_tickets);
    }
}