import { AppClass, Format } from "../Objects/App/AppClass";
import { CustomEvent } from "../Objects/Event/CustomEvent";
import { DayEvent } from "../Objects/Event/DayEvent";
import { EventExperience, EventFor, EventViewsTill } from "../Objects/Event/_Event";
import { MAX_SCREENKA, WeekDay, isDayToday, isLessThenMinutes } from "../aFunctions";

export const Apps = {
    Default: new AppClass("Default", "", "", Format.None, 100),
    //Build-in
    Notes: new AppClass("Notes", "note", "write a sentence about anything.", Format.LongString, 1),
    Safari: new AppClass("Safari", "page", "read some interesting content? saw some pretty layout? Share a website!", Format.Url, 2),
    Photos: new AppClass("Photos", "photo, video", "share a photo in your gallery.", Format.Path, 3), //upload saved photo, saved video, screenshot, screen recording.
    //Extras
    Maps: new AppClass("Maps", "place", "recommend new places you recently visited, your favorite spots to hang out.", Format.String, 11),
    Camera: new AppClass("Camera", "photo, video", "share your photographic sessions. Selfies, portraits, panoramas etc.", Format.Path, 12),//upload a photo, selfie, portrait, panorama, video taken by you.
    News: new AppClass("News", "story", "tell us what interesting happened recently. Some crazy news!", Format.LongString, 13),
    //TM
    Diary: new AppClass("Diary", "note", "describe your day. Your thoughts about how it is now.", Format.LongString, 20),
    Spotify: new AppClass("Spotify", "song, podcast", "share your favorite song or podcast.", Format.Url, 21),
    Youtube: new AppClass("Youtube", "video, short", "share a video that makes you happy!", Format.Url, 22),
    Netflix: new AppClass("Netflix", "movie, tv series", "share the title of a movie or TV series you watched recently.", Format.Url, 23),
    Instagram: new AppClass("Instagram", "post, account", "paste the URL of your favorite account or post on Instagram.", Format.Url, 24),
    Pinterest: new AppClass("Pinterest", "post, account", "share recipes, ideas for the home, style inspiration, and other ideas to experiment with.", Format.Url, 25),
    LouisVuitton: new AppClass("Louis Vuitton", "collection", "share collections from the fashion world.", Format.Path, 26),
    //End-apps
    Contacts: new AppClass("Contacts", "person", "suggest a friend you want to add to the community!", Format.Url, 29),    
    //Out-dated
    Settings: new AppClass("Settings", "idea", "suggest a motive of the week, custom app names, a special event, or additional features.", Format.LongString, 98),//-> idea app?
    Sentence: new AppClass("Sentence", "", "write a sentence about anything.", Format.LongString, 99),//-> notes
};

export const BUILDIN_APPS = ["Notes", "Safari","Photos","Spotify","Youtube","Contacts"]; //w tym dwa placeholdery btw, (to nie event.name btw)

export const DayEvents = {
    //mon
    ClearMind: new DayEvent("Clear-Mind", WeekDay.Monday,8, 24, " - oczyść swój umysł. To nowy tydzień, nowy motyw i najnowsze wydanie Screenki Tygodnia!", EventFor.screenka, 2, EventExperience.Informative),
    ClearMindForMe: new DayEvent("Clear-Mind", WeekDay.Monday,8, 24, " - oczyść swój umysł. To nowy tydzień, nowy motyw, i nowe doznania!", EventFor.me, 1,EventExperience.Informative),
    //thu
    OhPreview: new DayEvent("Oh-Preview", WeekDay.Thursday, 20, 22," - oh! Przegląd poprzedniego tygodnia jednego z uczestników.", EventFor.friends, 2,EventExperience.Full),
    //fri
    ThrowBack: new DayEvent("Throw-Back", WeekDay.Friday,12, 19, " - przegląd twojego poprzedniego tygodnia.", EventFor.friends, 2,EventExperience.Full,),
    //sun
    //Reset: new DayEvent("Reset", WeekDay.Sunday, 12, 19, " - re-set. Okazja na dostrojenie swoich ustawień preferencji.", EventFor.me, 1, EventExperience.None),
    DeadLine: new DayEvent("Dead-Line", WeekDay.Sunday,20, 24, " - upload off. Screenka Tygodnia już w drodze. W tym czasie możesz powspominać swój tydzień.", EventFor.screenka, 1, EventExperience.Informative),
    DeadLineForMe: new DayEvent("Dead-Line", WeekDay.Sunday,20, 24, " - upload off. W tym czasie możesz powspominać swój tydzień.", EventFor.me, 1,EventExperience.Informative),
    WeekUploads: new DayEvent("Week Uploads", WeekDay.Sunday,20, 24, " - w tym czasie możesz powspominać swój tydzień.", EventFor.me, 1, EventExperience.Interactive),
    //everyday
    OneShot: new DayEvent("One-Shot", null, 19, 20, " - szybki strzał. Jeden z dzisiejszych postów uczestników.", EventFor.friends, 1,EventExperience.Full),
    MorningShot: new DayEvent("Morning-Shot", null,8,12, " - wake up. Jeden z twoich wczorajszych postów na dzień dobry.", EventFor.me, 2,EventExperience.Full),
    DayUploads: new DayEvent("Day Uploads", null, 20, 24," - przeglądnij swój dzień na koniec dnia.", EventFor.me, 0,  EventExperience.Interactive),
}

export const CustomEvents={
    Upload: new CustomEvent("Upload","- uchwyć chwilę.",EventFor.me,0,EventExperience.Interactive,()=> !DayEvents.DeadLine.isTime() && ( DayEvents.ClearMind.isTime()|| !isDayToday(WeekDay.Monday) )),
    Screenka : new CustomEvent("Screenka Tygodnia","- w skórcie ST, lokalna gazeta cotygodniowych wspomnień.",EventFor.screenka,2,EventExperience.Interactive,(props)=>props.week!=null && (DayEvents.ClearMind.isTime() || props.week ===true || props.week.force_screenka),MAX_SCREENKA,EventViewsTill.Week),//week (week=true cheat ;))
    RnShot : new CustomEvent("Rn-Shot","- z ostatniej chwili! Najnowszy post innego uczestnika do 15min po jego dodaniu.",EventFor.friends,0,EventExperience.Full,(props)=>props.date!=null && isLessThenMinutes(props.date,15),1,EventViewsTill.FifteenMinutes),
    ManageUploads : new CustomEvent("Manage Uploads","- zarządzaj swoimi uploadami.",EventFor.me,0,EventExperience.Interactive,()=>true)
}