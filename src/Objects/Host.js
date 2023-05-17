import { toMap } from "../aFunctions";

export class Host {
    constructor(id,start_date,popular_apps,personalized_apps,groups_map, members_map=new Map(),max_tickets=0,weeks=null) { 
      /***/ this.id = id; //auto
      this.start_date = start_date;
      
      this.popular_apps = popular_apps; // takie co kazdy bedzie widzial posty z nich (bo sa uniwersalne, i nieprzewidywalne)
      this.personalized_apps = personalized_apps;// for personalized use, posty takich aplikacji trafiaja max do znajomych
      /*SOON*/ // apps_change_date - zeby moc zauktualizowac preferencje, bo defaultowo ida na off. (gdy appka idzie z popular na personalized)
      
      this.groups_map = groups_map; // zakladamy ze jest scisle powiazane z membersami > see SOON

      this.members_map = members_map;  //fullname => join_date, role, // leave_date - soon
                                                        //jesli tu cie nie ma a masz Host w user/Hosts to znaczy ze masz bana, ale luz nic wielkiego, po prostu postowac nie mozesz, najwyrazniej jakos sie niewlasciwie zachowywales
                                                        // w miare bedzie sie pokrywalo z host.friends
                                                        // ale jednym powodem zastosowania jest to ze na poczatku nie mozemy wszystkich friendsow poznac i to stopniowo bedziemy dodawac koleno
                                                        //nie nazwa: members - bo czlonek brzmi za bardzo zobowiazaujaco

      this.max_tickets = max_tickets;
      this.weeks = weeks;
    }

    getFriendsFullnames =(fullname)=>{//return array
      let res = [];
      this.groups_map.forEach((members) => {
        if(members.includes(fullname))
        {
          members.forEach(member=>{
            if(member!==fullname && !res.includes(member)) res.push(member);
          })
        }
      });
      return res;
    }

    static fromDoc=(doc)=>{
      if(!doc) return null;

      let members_map = toMap(doc.members_map);
     
      members_map.forEach((value,)=>value.join_date= value.join_date.toDate());
     /* new Map(Array.from( members_map ).map(([key, value]) => {
        value.join_date = value.join_date.toDate();
        return ({ key, value })
    }))*/

      return new Host(doc.id, doc.start_date.toDate(),doc.popular_apps,doc.personalized_apps,toMap(doc.groups_map),members_map,doc.max_tickets);
  }
}

/*
const getMembersFullnamesFromGroupsMap = (groups_map)=>{
  let res =[];
  groups_map.forEach(members => {
      members.forEach(member=>{
        if(!res.includes(member)) res.push(member);
      })})
  return res;
}
*/