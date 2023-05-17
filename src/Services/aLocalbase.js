import { PostClass as Post } from "../Objects/Post/PostClass"
import { Host } from "../Objects/Host"
import { UserClass } from "../Objects/User/UserClass"
import { Week } from "../Objects/Week"

export const DEMONOW = new Date(2023,4-1,24,20,17);
export const DEMONAME = "Demo User" 
export const DEMOUSERNAME = "demo_user"

const PostRepository = [
    new Post("dsnanaaiaocsn","-1","Glassy Week",new Date(2023,4-1,24,14,0),"Camera",null,"To wszystko sie tu zaczelo!",true,null,"Tola Bajka",null,null),
    new Post("dsnanaaiasasa","-1","Glassy Week",new Date(2023,4-1,24,15,0),"Safari","https://open.spotify.com/track/2dHHgzDwk4BJdRwy9uXhTO","Ta storna to majstersztyk",false,null,null,null,null),
    new Post("dsnasddsxccsn","-1","Glassy Week",new Date(2023,4-1,24,16,16),"Maps","Paryz Francja","Fajne miejsc polecam",true,null,null,null,null),
]
const PostRepository2 = [
    new Post("123123","-1","Glassy Week",new Date(2023,4-1,24,20,10),"Spotify","https://open.spotify.com/track/2dHHgzDwk4BJdRwy9uXhTO","To wszystko sie tu zaczelo!",true,null,DEMONAME,null),
]
const PostRepository3 = [
    new Post("123","-1","Glassy Week",new Date(2023,4-1,24,14,30),"Spotify","https://open.spotify.com/track/2dHHgzDwk4BJdRwy9uXhTO","Hejka!",true,null,null,null),
]
export const UserRepository = [
    new UserClass(DEMONAME,DEMOUSERNAME,["-1"],["Maps"],PostRepository),
    new UserClass("Tola Bajka","bayka",["-1"],null,PostRepository2),
    new UserClass("Mia Muller","miam",["-1"],null,PostRepository3)
]

const special_day_map = new Map([
    ["Thursday",{name:"Halloween", description:"Scarrry!!..."}]
])
const WeekRepository = [
    new Week("First Week",new Date(2023,4-1,17,8,0),"Pierwszy tydzień to pierwszy tydzień, nie ma nic pierwszejszego, niż tydzień.","1️⃣",null,null,null,true,[DEMONAME,"Mia Muller"],),
    new Week("Glassy Week",new Date(2023,4-1,24,8,0),"New week, new you. Have fun. We are waiting for some new fresh and dope things! Use your glasses against burning sun! ...","🕶️",null,null,special_day_map,true,[DEMONAME,"Mia Muller"],new Map([["Spotify",1],["Maps",1],["Safari",1],["Camera",1]]))
]

const members_map = new Map([
    [DEMONAME, {join_date:new Date(2023,4-1,17), role:"host"}],
    ["Tola Bajka",{join_date:new Date(2023,4-1,17)}],
    ["Mia Muller", {join_date:new Date(2023,4-1,17)}]
])

export const HostRepository = [ new Host("-1",new Date(2023,4-1,10),
["Word","Sentence",
"Safari","Photos","Camera","Contacts","Settings",
"Spotify","Youtube","Netflix",],
["Maps","Instagram"],new Map([["FirstGroup",[DEMONAME,"Tola Bajka"]]]),members_map,3,WeekRepository)] 



