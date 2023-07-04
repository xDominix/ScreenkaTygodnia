export const DEFAULT_APP_NAMES = ["Sentence", "Safari","Photos","News","Contacts","Settings","Spotify","Youtube","Netflix",];

export const AppType = {Personalized:0,Popular:1,Group:2,SuperPersonalized:3}

export const Format = { None:"none", String:"string",LongString:"long_string" ,Url:"url", Path:"path",}

export const LABEL_STEP = 10

export class AppClass {
    constructor(name,miniDescription,description,format,label) { 
      /***/ this.name = name; //to nie bedzie zmieniane, nie ma sensu ALE co z Spotify co bedziemy chcieli zastapi Apple Music????
      this.miniDescription = miniDescription;
      this.description = description;// przykladowe elementy w formacie
      this.format=  format;
      this.label=label;
    }

    static get(string) {switch (string) {
      case "Word": return AppClass.Word;
      case "Sentence": return AppClass.Sentence;
      case "Safari":return AppClass.Safari;
      case "Photos":return AppClass.Photos;
      case "Camera":return AppClass.Camera;
      case "News":return AppClass.News;
      case "Maps":return AppClass.Maps;
      case "Contacts":return AppClass.Contacts;
      case "Diary":return AppClass.Diary;
      case "Spotify":return AppClass.Spotify;
      case "Youtube":return AppClass.Youtube;
      case "Netflix":return AppClass.Netflix;
      case "Instagram":return AppClass.Instagram;
      case "Pinterest":return AppClass.Pinterest;
      case "Louis Vuitton":return AppClass.LouisVuitton;
      case "Settings":return AppClass.Settings;
      default: return AppClass.Default;
    }}

    static Default = new AppClass("Default","","",Format.None,100)
    //Abstract
    static Word = new AppClass("Word","","write down the word, pharse or emoji that is in your mind.",Format.String,0)
    static Sentence = new AppClass("Sentence", "","write a sentence about anything.",Format.LongString,1)

    //Apple App
    static Safari = new AppClass("Safari","page","read some interesting content? saw some pretty layout? Share a website!",Format.Url,10)
    static Photos = new AppClass("Photos","photo, video","share a photos in your gallery.",Format.Path,11) //upload saved photo, saved video, screenshot, screen recording.
    static Camera = new AppClass("Camera","photo, video","share your photographic sessions. Selfies, portraits, panoramas etc.",Format.Path,12) //upload a photo, selfie, portrait, panorama, video taken by you.
    static News = new AppClass("News", "story","tell us what interesting happened recently. Some crazy news!",Format.LongString,13)

    //irl
    static Maps = new AppClass("Maps","place","recommend new places you recently visited, your favorite spots to hang out.",Format.String,20);
    static Contacts = new AppClass("Contacts","person","suggest a friend you want to add to the community!",Format.Url,21)
    static Diary = new AppClass("Diary","note","describe your day. Your thoughts about how it is now.",Format.LongString,22);
    
    //App
    static Spotify = new AppClass("Spotify","song, podcast","share your favourite song or podcast.",Format.Url,31)
    static Youtube = new AppClass("Youtube","video, short","share video that makes you happy!",Format.Url,32)
    static Netflix = new AppClass("Netflix","movie, tv series","share the title of movie or tv series you watched recently.",Format.Url,33)
    static Instagram = new AppClass("Instagram","post, account","paste the url of your favourite account or post on Instagram.",Format.Url,34)
    static Pinterest = new AppClass("Pinterest","post, account","share recipes, ideas for the home, style inspiration and other ideas to experiment with.",Format.Url,35)
    //Settings
    static Settings = new AppClass("Settings","idea","suggest a motive of the week, custom app names, a special event or additional features.",Format.LongString,36)

    //superpersonalized
    static LouisVuitton = new AppClass("Louis Vuitton","collection","share collections from the fashion world.",Format.Path,36)
   
    getGroup = ()=>{
      return (this.label/LABEL_STEP) | 0
    }
}

AppClass.prototype.toString = function () {
  return this.name;
};
AppClass.prototype.valueOf = function () {
  return this.name;
};