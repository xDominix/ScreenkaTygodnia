import { AppClass, Format } from "../Objects/App/AppClass";
import { CustomEvent } from "../Objects/Event/CustomEvent";
import { DayEvent } from "../Objects/Event/DayEvent";
import { EventExperience, EventFor, EventViewsTill } from "../Objects/Event/_Event";
import { MAX_ST_VIEWS, WeekDay, isDayToday, isLessThenMinutes } from "../aFunctions";

//ogolny sort: string, long, path, url, none
export const Apps = {
    //Specialy Designed Primitives
    Word: new AppClass("Word","","write down a word, a pharse or an emoji that describes your day.",Format.String,1),
    Sentence:new AppClass("Sentence","","write a sentence, quote, feeling or a thought that is on your mind.",Format.LongString,2),
    //Build-in
    Notes: new AppClass("Notes", "note", "write longer about anything.", Format.LongString, 3),
    Photos: new AppClass("Photos", "photo, video", "share a photo from your gallery.", Format.Path, 4), //upload saved photo, saved video, screenshot, screen recording.
    Safari: new AppClass("Safari", "page", "read some interesting content? saw some pretty layout? Share a website!", Format.Url, 5),
    //Build-out (build in optionals)
    Maps: new AppClass("Maps", "place", "recommend new places you recently visited, your favorite spots to hang out.", Format.String, 11),
    News: new AppClass("News", "story", "tell others what happened in the world recently, something new - around you.", Format.LongString, 12),
    Camera: new AppClass("Camera", "photo, video", "share your photographic sessions. Selfies, portraits, panoramas etc.", Format.Path, 13),//upload a photo, selfie, portrait, panorama, video taken by you.
    //Build-in end
    Contacts: new AppClass("Contacts", "person", "suggest a friend you want to add to the community!", Format.Url, 18),
    Ideas: new AppClass("Ideas","idea","suggest a new week motive, new app to add, a special event or an additional app features.",Format.LongString,19), //logo to tips z iphone, wiec mozna w przyszlosci podmienic
    //Specially Designed
    Diary: new AppClass("Diary", "note", "describe your day. Your thoughts about how it is now.", Format.LongString, 21),
    //TM
    Spotify: new AppClass("Spotify", "song, podcast", "share your favorite song or podcast.", Format.Url, 22),
    Youtube: new AppClass("Youtube", "video, short", "share a video that makes you happy!", Format.Url, 23),
    Netflix: new AppClass("Netflix", "movie, tv series", "share the title of a movie or TV series you watched recently.", Format.Url, 24),
    Instagram: new AppClass("Instagram", "post, account", "paste the URL of your favorite account or post on Instagram.", Format.Url, 25),
    Pinterest: new AppClass("Pinterest", "post, account", "share recipes, ideas for the home, style inspiration, and other ideas to experiment with.", Format.Url, 26),
    LouisVuitton: new AppClass("Louis Vuitton", "collection", "share collections from the fashion world.", Format.Path, 27),
    //Group Apps
    DonutekGng: new AppClass("DonutekGng","pic","share some brudy rodzinne.~",Format.Path,30),
    //Default
    Default: new AppClass("Default", "", "", Format.None, 100),
};

export const BUILDIN_APPS = [Apps.Notes,Apps.Safari,Apps.Photos,Apps.Contacts,Apps.Ideas]; //w tym jeden placeholder btw, (to nie event.name btw, tylko to local in object key)

export const Events = {//kolejnosc ma znaczenie (soon: sortowanie po weekDay, pozniej EventFor i potem po interactive - to wtedy bedzie git)
    //mon
    UploadOn: new DayEvent("Upload-On", WeekDay.Monday,8, 24, " - upload's on! To nowy tydzień, nowy motyw i nowe doznania.", EventFor.me,1, EventExperience.Informative),
    //wed
    OhPreview: new DayEvent("Oh-Preview", WeekDay.Wednesday, 20, 22," - oh! To podgląd poprzedniego tygodnia jednego z uczestników.", EventFor.friends, 2,EventExperience.Full),
    //thu
    ThrowBack: new DayEvent("Throw-Back", WeekDay.Thursday,20,22, " - ow! Cofnijmy się do twojego poprzedniego tygodnia...", EventFor.friends, 2,EventExperience.Full,),
    //sat
    UploadOff: new DayEvent("Upload-Off", WeekDay.Saturday,20, 24, " - upload's off. ST już w drodze! W tym czasie możesz powspominać swój tydzień.", EventFor.screenka, 1, EventExperience.Informative),
    UploadOffForMe: new DayEvent("Upload-Off", WeekDay.Saturday,20, 24, " - upload's off. W tym czasie możesz powspominać swój tydzień.", EventFor.me, 1,EventExperience.Informative),
    WeekUploads: new DayEvent("Week Uploads", WeekDay.Saturday,20, 24, " - powspominaj swój tydzień.", EventFor.me, 1, EventExperience.Interactive),
    //sun
    STHere: new DayEvent("ST-Here",WeekDay.Sunday,8,24," - przeczytaj najnowsze wydanie Screenki Tygodnia! Powspominaj tydzień swój i innych. Oczyść swój umysł przed nowym...",EventFor.screenka,2,EventExperience.Informative),
    STHereForMe: new DayEvent("ST-Here",WeekDay.Sunday,0,24," - dzień relaksu. Powspominaj ten tydzień i oczyść swój umysł przed nowym...",EventFor.me,0,EventExperience.Informative),//CHILL DAY
    WeekUploads2: new DayEvent("Week Uploads 2", WeekDay.Sunday,0, 24, " - powspominaj swój tydzień drugi raz.", EventFor.me, 1, EventExperience.Interactive),
   
    //everyday
    MorningShot: new DayEvent("Morning-Shot", null,8,12, " - wake up! Jeden z twoich wczorajszych postów, na dzień dobry.", EventFor.me, 2,EventExperience.Full),
    OneShot: new DayEvent("One-Shot", null, 19, 20, " - szybki strzał. Jeden z dzisiejszych postów uczestników.", EventFor.friends, 1,EventExperience.Full),
    DayUploads: new DayEvent("Day Uploads", null, 22, 24," - powspominaj swój dzień, na koniec dnia.", EventFor.me, 0,  EventExperience.Interactive),
    
    //custom
    Upload: new CustomEvent("Upload","- uchwyć chwilę.",EventFor.me,EventExperience.Interactive,()=> !Events.UploadOff.isTime() && !Events.STHere.isTime() && ( !isDayToday(WeekDay.Monday) || Events.UploadOn.isTime())),
    RnShot : new CustomEvent("Rn-Shot","- z ostatniej chwili! Najnowszy post innego uczestnika do 15min po jego dodaniu.",EventFor.friends,EventExperience.Full,(props)=> props && isLessThenMinutes(props.date,15),1,EventViewsTill.FifteenMinutes),
    ManageUploads : new CustomEvent("Manage Uploads","- zarządzaj swoimi uploadami.",EventFor.me,EventExperience.Interactive,()=>true),
    Screenka : new CustomEvent("Screenka Tygodnia","- w skórcie ST, lokalna gazeta cotygodniowych wspomnień.",EventFor.screenka,EventExperience.Interactive,(props)=> props &&( Events.STHere.isTime() || props.week?.force_st),MAX_ST_VIEWS,EventViewsTill.Week),

    //Reset: new DayEvent("Reset", WeekDay.Sunday, 12, 19, " - re-set. Okazja na dostrojenie swoich ustawień preferencji.", EventFor.me, 1, EventExperience.None),
    //Reset + ClearMind(UploadOn) => NewMe ?  (nowy tydzien, nowy ty!)

    //AboutWeek: new CustomEvent("About Week","- nowy motyw już czeka!",EventFor.me,EventExperience.Interactive,()=>(!isDayToday(WeekDay.Monday) || Events.UploadOn.isTime())),
    //Moze kiedys... Teraz chcemy poznac week przed pojsciem spac! I obudzic sie by zaczac go uploadowac!
}