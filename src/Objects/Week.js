import { Day, toWeekDay } from "./Day";

export class Week{
    constructor(
        name,
        start_date,
        description,
        emoji,
        special_days,
        oh_preview_off ,
        throw_back_off,
        one_shot_off,
        blocked_apps,
        extra_apps,
        screenka_views,
      ) {
        this.name = name;
        this.start_date = start_date;
        this.description = description;
        this.emoji = emoji;
        this.oh_preview_off = oh_preview_off;
        this.throw_back_off = throw_back_off;
        this.one_shot_off = one_shot_off;
        this.blocked_apps = blocked_apps;
        this.extra_apps = extra_apps;
        this.screenka_views = screenka_views;
        this.special_days = special_days;
      }
}

export class ScreenkaView{
    constructor(user_fullname, view_date)
    {
        this.user_fullname = user_fullname
        this.view_date = view_date
    }
}

export class SpecialDay{
    constructor(week_day,name,description)
    {
        this.week_day = week_day
        this.name = name
        this.description = description
    }

    toDay()
    {
        return new Day(this.name,toWeekDay(this.week_day),"",this.description)
    }
}