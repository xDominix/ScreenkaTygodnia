import { toMap } from "../aFunctions";

export class Host {
    constructor(id,start_date,popular_apps,personalized_apps,groups_map, members=null,weeks=null) { 
      /***/ this.id = id; //auto
      this.start_date = start_date;
      
      this.popular_apps = popular_apps; // takie co kazdy bedzie widzial posty z nich (bo sa uniwersalne, i nieprzewidywalne)
      this.personalized_apps = personalized_apps;// for personalized use, posty takich aplikacji trafiaja max do znajomych
      /*SOON*/ // apps_change_date - zeby moc zauktualizowac preferencje, bo defaultowo ida na off. (gdy appka idzie z popular na personalized)
      
      this.groups_map = groups_map;

      this.members = members; //jesli tu cie nie ma a masz Host w user/Hosts to znaczy ze masz bana, ale luz nic wielkiego, po prostu postowac nie mozesz, najwyrazniej jakos sie niewlasciwie zachowywales
                                                        // w miare bedzie sie pokrywalo z host.friends
                                                        // ale jednym powodem zastosowania jest to ze na poczatku nie mozemy wszystkich friendsow poznac i to stopniowo bedziemy dodawac koleno
                                                        //nie nazwa: members - bo czlonek brzmi za bardzo zobowiazaujaco
      this.members_fullnames = members? members.map(member=>member.fullname) : getMembersFullnamesFromGroupsMap(groups_map);

      this.weeks = weeks;
    }

    getFriendsFullnames =(fullname)=>{
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
      return doc?new Host(doc.id, doc.start_date.toDate(),doc.popular_apps,doc.personalized_apps,toMap(doc.groups_map)):null;
  }
}

export class Member{
  constructor(fullname,joined_date){
    /***/ this.fullname = fullname;
    this.joined_date = joined_date;

    /*SOON*/ //role - np artysta, screenka helper, judge, menager - a takie rozne nazwy, zadne konkretne
  }

  static fromDoc=(doc)=>{
    return doc?new Member(doc.id,doc.joined_date.toDate()):null;
  }
}

const getMembersFullnamesFromGroupsMap = (groups_map)=>{
  let res =[];
  groups_map.forEach(members => {
      members.forEach(member=>{
        if(!res.includes(member)) res.push(member);
      })})
  return res;
}