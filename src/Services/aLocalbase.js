import { CustomEvent } from "../Objects/Event/CustomEvent";
import { DayEvent } from "../Objects/Event/DayEvent";

export const DEFAULT_APP_NAMES = ["Word","Sentence", "Safari","Photos","Camera","Contacts","Settings","Spotify","Youtube","Netflix",];

//kolejnosc istotna
export const DayEvents = [
    DayEvent.ClearMind,DayEvent.DeadLine,//no_page screenka
    DayEvent.WeekStart,DayEvent.Reset, //no_page me
    DayEvent.OhPreview, DayEvent.ThrowBack, //screenka
    DayEvent.OneShot, //friends
    DayEvent.WeekUploads,DayEvent.DayUploads //me
];

export const CustomEvents = [
    CustomEvent.Upload,
    CustomEvent.Screenka,
    CustomEvent.RnShot,
];
