export class Team {
    constructor(id,name,start_date,members,popular_apps,personalized_apps, weeks) { 
      this.id = id;
      this.name = name;
      this.start_date = start_date;
      this.members = members;
      this.popular_apps = popular_apps;
      this.personalized_apps = personalized_apps;
      this.weeks = weeks;
    }
}

export class Member{
  constructor(fullname,join_date){
    this.fullname = fullname;
    this.join_date = join_date;
  }
}