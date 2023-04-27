export class Team {
    constructor(id,start_date,popular_apps,personalized_apps, members,weeks=null) { 
      /***/ this.id = id; //auto
      this.start_date = start_date;
      this.members = members; //jesli tu cie nie ma a masz Team w user/Teams to znaczy ze masz bana, ale luz nic wielkiego, po prostu postowac nie mozesz, najwyrazniej jakos sie niewlasciwie zachowywales
                                                      // w miare bedzie sie pokrywalo z team.friends
                                                      // ale jednym powodem zastosowania jest to ze na poczatku nie mozemy wszystkich friendsow poznac i to stopniowo bedziemy dodawac koleno
                                                      //nie nazwa: members - bo czlonek brzmi za bardzo zobowiazaujaco
      
      this.popular_apps = popular_apps; // takie co kazdy bedzie widzial posty z nich (bo sa uniwersalne, i nieprzewidywalne)
      this.personalized_apps = personalized_apps;// for personalized use, posty takich aplikacji trafiaja max do znajomych
      /*SOON*/ // apps_change_date - zeby moc zauktualizowac preferencje, bo defaultowo ida na off. (gdy appka idzie z popular na personalized)
      
      this.weeks = weeks;
    }

    static fromDoc=(doc,members)=>{
      return doc?new Team(doc.id, doc.start_date.toDate(),doc.popular_apps,doc.personalized_apps,members):null;
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