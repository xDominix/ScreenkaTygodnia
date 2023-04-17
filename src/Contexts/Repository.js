import { AppClass } from "../Objects/App/AppClass"
import { PostClass as Post } from "../Objects/Post/PostClass"
import { Member, Team } from "../Objects/Team"
import { UserClass } from "../Objects/User/UserClass"
import { SpecialDay, Week } from "../Objects/Week"

const PostRepository = [
    new Post("dsnanaaiaocsn","0","First Week",new Date(2023,4-1,16),"Spotify","https://open.spotify.com/track/2dHHgzDwk4BJdRwy9uXhTO","To wszystko sie tu zaczelo!",true,null,null,null,null,true,0),
    new Post("dsnanaaiasasa","0","First Week",new Date(2023,4-1,16),"Safari","https://open.spotify.com/track/2dHHgzDwk4BJdRwy9uXhTO","Ta storna to majstersztyk",false,null,null,null,null,true,0),
    new Post("dsnasddsxccsn","0","First Week",new Date(2023,4-1,12),"Instagram","https://open.spotify.com/track/2dHHgzDwk4BJdRwy9uXhTO","Ten film mnie tak urzekl ostatnio",true,null,null,null,null,true,0),
]
export const UserRepository = [
    new UserClass("Dominik Jędraszek","xDominix","dominikj.jpg",["0"],["Maps"],PostRepository),
    new UserClass("Filip Jędraszek","Pilif","filipj.jpg",["0"],null,null)
]


const MemberRepository = [
    new Member("Dominik Jędraszek",new Date(2023,3-1,17)),
    new Member("Filip Jędraszek",new Date(2023,3-1,18))
]
const SpecialDays = [
    new SpecialDay("Wednesday","Halloween","Scarrry!!...")
]
const WeekRepository = [
    new Week("First Week",new Date(2023,4-1,10),"New week, new you. Have fun. We are waiting for some new fresh and dope things! Use your glasses against burning sun! ...","🕶️",SpecialDays,true,true,true,null,null,null)
]
export const TeamRepository = [
    new Team("0","DonutekGng",new Date(2023,3-1,14),MemberRepository,
    ["Word","Sentence",
    "Safari","Photos","Camera","Contacts","Settings",
    "Spotify","Youtube","Netflix",],
    ["Maps","Instagram"],WeekRepository)
]





