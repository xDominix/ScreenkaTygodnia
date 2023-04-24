export class Team {
    constructor(id,fullname,start_date,members,popular_apps,personalized_apps, weeks) { 
      /***/ this.id = id; //auto
      this.fullname = fullname
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
}

export class Member{
  constructor(fullname,join_date){
    /***/ this.fullname = fullname;
    this.join_date = join_date;

    /*SOON*/ //role - np artysta, screenka helper, judge, menager - a takie rozne nazwy, zadne konkretne
  }
}