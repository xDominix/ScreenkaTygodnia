import { Day, toWeekDay } from "./Day/Day";

export class Week{
    constructor(   name,start_date,  description,emoji,  oh_preview_off , throw_back_off,  one_shot_off, blocked_apps, extra_apps, force_screenka_show,  special_days=null, screenka_views=null) {
        /***/ this.name = name; //gdy bedziemy chcieli sobie wziac po week_namie z posta,
        this.start_date = start_date; // filtrujemy czy currweekdate===newdate, filtrujemy po datach ktore so przed teraz, a pozniej sortujemy po najwyzszej i nia bierzemy - tym samym nowy week odbedzie wtedy kiedy start_date - wraz ze screenka!
        this.description = description; // opis tygodnia, zawierac moze uwagi tygodnia np. spersonalizuj by dodac settingsy! (wejdz na /login)
        this.emoji = emoji;

        /*?*/ this.oh_preview_off = oh_preview_off;
        /*?*/ this.throw_back_off = throw_back_off;
        /*?*/ this.one_shot_off = one_shot_off;

        /*?*/ this.blocked_apps = blocked_apps; //- np. #1 week bez person section , innego robisz zen-week itp. 
        /*?*/ this.extra_apps = extra_apps; // sa one jakby popular apps

        this.screenka_views = screenka_views;
        this.special_days = special_days;

        /*4DEMO*/ this.force_screenka_show = force_screenka_show;

        /*SOON*/ //max_tickets - np. 1 (one-ticket-week), 5 (dla wiekszych kontenciarzy)
        /*NO*/ //participants: user - nie, zakladamy ze kazdy postuje kazdego tygodnia
    }

    isDayOff = (day) =>{
        switch(day){
            case Day.OneShot: return this.one_shot_off=== true;
            case Day.ThrowBack: return this.throw_back_off ===true;
            case Day.OhPreview: return this.oh_preview_off === true;
            default: return true;
        }
    }

    static fromDoc=(doc,special_days=null,screenka_views=null)=>{
        return doc?new Week(doc.id,doc.start_date.toDate(),doc.description,doc.emoji,doc.oh_preview_off,doc.throw_back_off,doc.one_shot_off,doc.blocked_apps,doc.extra_apps,doc.force_screenka_show,special_days,screenka_views):null;
    }
}

export class ScreenkaView{
    constructor(user_fullname, view_date)
    {
        /***/ this.user_fullname = user_fullname;
        this.view_date = view_date;
        
        /*MAYBE*/ //comment?? - nieee... to ma byc fresh and clean, a z drugiej strony cos w stylu - opisz emocje?
        /*MAYBE*/ //rate?? - daj gwiazdki???
    }

    static fromDoc=(doc)=>{
        return doc?new ScreenkaView(doc.id,doc.view_date.toDate()):null
    }
}

export class SpecialDay{
    constructor(week_day,name,description)
    {
        /***/ this.week_day = week_day
        this.name = name
        this.description = description
    }

    toDay()
    {
        return new Day(this.name,toWeekDay(this.week_day),"",this.description)
    }

    static fromDoc=(doc)=>{
        return doc?new SpecialDay(doc.id,doc.name,doc.description):null
    }
}