import { AppClass, Format } from "../Objects/App/AppClass";
import { CustomEvent } from "../Objects/Event/CustomEvent";
import { DayEvent } from "../Objects/Event/DayEvent";
import { EventExperience, EventFor, EventViewsTill } from "../Objects/Event/_Event";
import { MAX_SCREENKA, WeekDay, isDayToday, isLessThenMinutes } from "../aFunctions";

export const Apps = {
    //Build-in
    Notes: new AppClass("Notes", "note", "write down what is on your mind.", Format.LongString, 1),
    Safari: new AppClass("Safari", "page", "read some interesting content? saw some pretty layout? Share a website!", Format.Url, 2),
    Photos: new AppClass("Photos", "photo, video", "share a photo in your gallery.", Format.Path, 3), //upload saved photo, saved video, screenshot, screen recording.
    Contacts: new AppClass("Contacts", "person", "suggest a friend you want to add to the community!", Format.Url, 8),
    Ideas: new AppClass("Ideas","idea","suggest a new week motive, new app to add, a special event or an additional app features.",Format.LongString,9), //logo to tips z iphone, wiec mozna w przyszlosci podmienic
    //Build-in extras
    Maps: new AppClass("Maps", "place", "recommend new places you recently visited, your favorite spots to hang out.", Format.String, 11),
    Camera: new AppClass("Camera", "photo, video", "share your photographic sessions. Selfies, portraits, panoramas etc.", Format.Path, 12),//upload a photo, selfie, portrait, panorama, video taken by you.
    News: new AppClass("News", "story", "tell others what happened in the world recently, something new - around you.", Format.LongString, 13),
    //Specially Designed and TM
    Word: new AppClass("Word","","write a word, a pharse or an emoji that is on your mind.",Format.String,30),//spec
    Diary: new AppClass("Diary", "note", "describe your day. Your thoughts about how it is now.", Format.LongString, 31),//spec
    Spotify: new AppClass("Spotify", "song, podcast", "share your favorite song or podcast.", Format.Url, 32),
    Youtube: new AppClass("Youtube", "video, short", "share a video that makes you happy!", Format.Url, 33),
    Netflix: new AppClass("Netflix", "movie, tv series", "share the title of a movie or TV series you watched recently.", Format.Url, 34),
    Instagram: new AppClass("Instagram", "post, account", "paste the URL of your favorite account or post on Instagram.", Format.Url, 35),
    Pinterest: new AppClass("Pinterest", "post, account", "share recipes, ideas for the home, style inspiration, and other ideas to experiment with.", Format.Url, 36),
    LouisVuitton: new AppClass("Louis Vuitton", "collection", "share collections from the fashion world.", Format.Path, 37),
    //Group Apps
    DonutekGng: new AppClass("DonutekGng","pic","share some brudy rodzinne.",Format.Path,40),
    //Default
    Default: new AppClass("Default", "", "", Format.None, 100),
};

export const BUILDIN_APPS = [Apps.Notes,Apps.Safari,Apps.Photos,Apps.Contacts,Apps.Ideas]; //w tym jeden placeholder btw, (to nie event.name btw, tylko to local in object key)

export const Events = {//kolejnosc ma znaczenie, ustawiaj godzinami
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
    MorningShot: new DayEvent("Morning-Shot", null,8,12, " - wake up! Jeden z twoich wczorajszych postów na dzień dobry.", EventFor.me, 2,EventExperience.Full),
    OneShot: new DayEvent("One-Shot", null, 19, 20, " - szybki strzał. Jeden z dzisiejszych postów uczestników.", EventFor.friends, 1,EventExperience.Full),
    DayUploads: new DayEvent("Day Uploads", null, 20, 24," - przeglądnij swój dzień na koniec dnia.", EventFor.me, 0,  EventExperience.Interactive),
    //custom
    Upload: new CustomEvent("Upload","- uchwyć chwilę.",EventFor.me,0,EventExperience.Interactive,()=> !Events.DeadLine.isTime() && ( Events.ClearMind.isTime()|| !isDayToday(WeekDay.Monday) )),
    Screenka : new CustomEvent("Screenka Tygodnia","- w skórcie ST, lokalna gazeta cotygodniowych wspomnień.",EventFor.screenka,2,EventExperience.Interactive,(props)=>props && (Events.ClearMind.isTime() || props.week ===true || props.week.force_screenka),MAX_SCREENKA,EventViewsTill.Week),//week (week=true cheat ;))
    RnShot : new CustomEvent("Rn-Shot","- z ostatniej chwili! Najnowszy post innego uczestnika do 15min po jego dodaniu.",EventFor.friends,0,EventExperience.Full,(props)=> props && isLessThenMinutes(props.date,15),1,EventViewsTill.FifteenMinutes),
    ManageUploads : new CustomEvent("Manage Uploads","- zarządzaj swoimi uploadami.",EventFor.me,0,EventExperience.Interactive,()=>true),
}