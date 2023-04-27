import { PostClass as Post } from "../Objects/Post/PostClass"
import { Team, Member } from "../Objects/Team"
import { UserClass } from "../Objects/User/UserClass"
import { SpecialDay, Week } from "../Objects/Week"

export const DEMONOW = new Date(2023,4-1,24,20,17);
export const DEMONAME = "Default User" 
export const DEMOUSERNAME = "default_user"

const PostRepository = [
    new Post("dsnanaaiaocsn","-1","Glassy Week",new Date(2023,4-1,24,14,0),"Camera",null,"To wszystko sie tu zaczelo!",true,null,null,null,null),
    new Post("dsnanaaiasasa","-1","Glassy Week",new Date(2023,4-1,24,15,0),"Safari","https://open.spotify.com/track/2dHHgzDwk4BJdRwy9uXhTO","Ta storna to majstersztyk",false,null,null,null,null),
    new Post("dsnasddsxccsn","-1","Glassy Week",new Date(2023,4-1,24,16,16),"Instagram","https://open.spotify.com/track/2dHHgzDwk4BJdRwy9uXhTO","Ten film mnie tak urzekl ostatnio",true,null,null,null,null),
]
const PostRepository2 = [
    new Post("123123","-1","Glassy Week",new Date(2023,4-1,24,14,30),"Spotify","https://open.spotify.com/track/2dHHgzDwk4BJdRwy9uXhTO","To wszystko sie tu zaczelo!",true,null,null,null),
]
export const UserRepository = [
    new UserClass(DEMONAME,DEMOUSERNAME,"default.jpg",["-1"],["Maps"],PostRepository),
    new UserClass("Tola Bajka","bayka","bajtola.jpg",["-1"],null,PostRepository2),
    new UserClass("Mia Muller","miam","miam.jpg",["-1"],null,null)
]


const MemberRepository = [
    new Member(DEMONAME,new Date(2023,4-1,17)),
    new Member("Tola Bajka",new Date(2023,4-1,17))
]
const SpecialDays = [
    new SpecialDay("Wednesday","Halloween","Scarrry!!...")
]
const WeekRepository = [
    new Week("Glassy Week",new Date(2023,4-1,24,8,0),"New week, new you. Have fun. We are waiting for some new fresh and dope things! Use your glasses against burning sun! ...","🕶️",true,true,true,null,null,true,SpecialDays,null)
]
export const TeamRepository = [
    new Team("-1",new Date(2023,4-1,17),
    ["Word","Sentence",
    "Safari","Photos","Camera","Contacts","Settings",
    "Spotify","Youtube","Netflix",],
    ["Maps","Instagram"],MemberRepository,WeekRepository)
]



