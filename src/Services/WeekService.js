import { NOW, dayEqual, delay,  getMonday } from "../aFunctions";
import { HostRepository, DEMONOW, DEMONAME } from "./aLocalbase";
import { Week } from "../Objects/Week";
import { db, getDoc, getDocs } from "../Services/aFirebase";
import { Timestamp, limit, onSnapshot, orderBy, updateDoc, where } from "firebase/firestore";
import { doc} from "firebase/firestore";

export const useWeekService = (demo)=> demo ? WeekServiceDemo : WeekService;

const WeekService = {
    
    onWeekSnapshot : (host_id,week_name,onNext)=>{
        if(!host_id || !week_name) return function unsubscribe() {}
        return onSnapshot(doc(db,"hosts",host_id,"weeks",week_name),(doc)=>{let doc_ = doc.data();doc_.id=doc.id;onNext(Week.fromDoc(doc_))});
    },

    getHostWeek : async (host_id,week_name=null)=>{ //return week or null 
       if(host_id==null) return null;
        if(week_name!=null)
        {
            let doc =  await getDoc(`hosts/${host_id}/weeks`,week_name);
            return Week.fromDoc(doc);
        }

        let fromDate =getMonday();
        let toDate = NOW();
        let docs = await getDocs(`hosts/${host_id}/weeks`,where("start_date",">=",fromDate),where("start_date","<=",toDate),orderBy("start_date","desc"),limit(1));
        if(docs.length===0) return null;
        return Week.fromDoc(docs.at(0))
    },

    getHostWeekNames : async(host_id,from_date=null)=>{
        if(!host_id) return [];
        let docs;
        if(from_date) docs = await getDocs(`hosts/${host_id}/weeks`,where("start_date","<=",NOW()),where("start_date",">=",from_date),orderBy("start_date","desc"),limit(20));
        else docs = await getDocs(`hosts/${host_id}/weeks`,where("start_date","<=",NOW()),orderBy("start_date","desc"),limit(20));
        if(!docs)return [];
        return docs.map(doc=>doc.id)//Week.fromDoc(doc));
        //return [...new Set(weeks.map(week => week.name))];
    },

    trySetHostWeekScreenkaView : async (host_id,week_name,user_fullname)=>{
        let data;
        data[`screenka_views_map.${user_fullname}`] = { view_date:Timestamp.fromDate(NOW()), };
        await updateDoc(doc(db,`hosts/${host_id}/weeks/${week_name}`),data);
        return true;
    }

}

const WeekServiceDemo = {
    onWeekSnapshot : (host_id,week_name,onNext)=>{
        let isSubscribed = true;

        async function subscribe() {
            while (isSubscribed) {
                let snapshot = await WeekServiceDemo.getHostWeek(host_id,week_name);
                snapshot=Object.assign({}, snapshot);
                onNext(snapshot);

                snapshot = await WeekServiceDemo.getHostWeek(host_id,week_name);
                snapshot=Object.assign({}, snapshot);
                await delay(3000);
                snapshot.apps_counts_map = new Map([["Spotify",2],["Maps",1],["Safari",1],["Camera",1]]);
                snapshot.latest_map = new Map([["user","Tola Bajka"],["date", DEMONOW], ["app","Spotify"]]);
                snapshot.participants = [DEMONAME,"Mia Muller","Tola Bajka"];
                onNext(snapshot);

                isSubscribed=false;
            }
        }

        subscribe();

        return function unsubscribe() {
            isSubscribed = false;
        };
    },

    getHostWeek : async (host_id,week_name=null)=>{ //return week or null or undefined
        await delay(500)

        if(week_name!=null)
            return HostRepository.find(host=>host.id===host_id).weeks
                ?.sort((week1,week2)=>{return week1.start_date-week2.start_date})
                ?.find(week=>week.name===week_name); //bierzemy ten ostatni stworzony o tej nazwie

        return HostRepository.find(host=>host.id===host_id).weeks
            ?.filter(week => dayEqual(getMonday(week.start_date),getMonday(DEMONOW)))
            ?.sort((week1,week2)=>{return week1.start_date-week2.start_date})
            ?.find(week => week.start_date<DEMONOW);
    },

    getHostWeekNames : async (host_id,from_date=null)=>{
        await delay(1500)
        let host = HostRepository.find(host=>host.id === host_id)
        if(host==null) return null;
        if(host.weeks==null) return []
        let weeks = host.weeks.filter(week=>DEMONOW>week.start_date && ( from_date==null || week.start_date > from_date) );
        return [...new Set(weeks.map(week => week.name))];
    },

    trySetHostWeekScreenkaView : async (host_id,week_name,user_fullname)=>{
        //TODO
        return true;
    }

}