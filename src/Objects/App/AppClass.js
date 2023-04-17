export const Format = { None:"None", String:"String",LongString:"LongString" ,Url:"Url", Path:"Path",}

export const LABEL_STEP = 10

export class AppClass {
    constructor(name,miniDescription,description,format,label) { 
      this.name = name;
      this.miniDescription = miniDescription;
      this.description = description;
      this.format=  format;
      this.label=label;
    }

    static get(string) {switch (string) {
      case "Word": return AppClass.Word;
      case "Sentence": return AppClass.Sentence;
      case "Safari":return AppClass.Safari;
      case "Photos":return AppClass.Photos;
      case "Camera":return AppClass.Camera;
      case "Maps":return AppClass.Maps;
      case "Contacts":return AppClass.Contacts;
      case "Spotify":return AppClass.Spotify;
      case "Youtube":return AppClass.Youtube;
      case "Netflix":return AppClass.Netflix;
      case "Instagram":return AppClass.Instagram;
      case "Settings":return AppClass.Settings;
      default: return AppClass.Default;
    }}

    static Default = new AppClass("Default","","",Format.None,100)
    //Abstract
    static Word = new AppClass("Word","","write down a word, phrase or an emoji that describes your day!",Format.String,0)
    static Sentence = new AppClass("Sentence", "","write a sentence, short story, poetical quote, funny joke...",Format.LongString,1)//about what you've heard, what you've learned, what you've done.
    //Apple App
    static Safari = new AppClass("Safari","page","read some interesting content? saw some pretty layout? Share a website!",Format.Url,10)
    static Photos = new AppClass("Photos","photo, video","upload saved photo, saved video, screenshot, screen recording.",Format.Path,11)
    static Camera = new AppClass("Camera","photo, video","upload a photo, selfie, portrait, panorama, video taken by you.",Format.Path,12)
    //irl
    static Maps = new AppClass("Maps","place","recommend new place you recently visited, your favorite spot to hang out.",Format.String,20);
    static Contacts = new AppClass("Contacts","person","suggest a friend you want to add to the community!",Format.Url,21)

    //App
    static Spotify = new AppClass("Spotify","song, podcast","share your favourite song or podcast.",Format.Url,31)
    static Youtube = new AppClass("Youtube","video, short","share video that makes you happy!",Format.Url,32)
    static Netflix = new AppClass("Netflix","movie, tv series","share the title of movie or tv series you watched recently.",Format.Url,33)
    static Instagram = new AppClass("Instagram","post, account","paste the url of your favourite account or post on Instagram.",Format.Url,34)
    //Settings
    static Settings = new AppClass("Settings","idea","set up your week; suggest a motive of the week, app name, special event, additional feature.",Format.String,35)

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