export class PostClass {
    constructor(      id,      team_id,      week_name,      upload_date,      app,      content,      context,      screenkaOn,      comment,      comment_user_fullname,   top_number,     is_highlighted
    ) {
      /***/ this.id = id; //data przekonwertowana na string np. 2023_0322_1301
      this.team_id = team_id;// if team==null then post uniwersalny
      this.week = week_name; //mozna pofiltrowac, mozna info odrazu poznac (bo jest to pewnego rodzaju context - a na tym nam zalezy zby week_name mialo znaczenie i bylo czesto oznaczane), jesli null to uniwersalny - wiadomo
      this.upload_date = upload_date;
      this.app = app;
      this.content = content; 
      this.context = context; //dlaczego uploader zdecydowal sie to spostowac, jaki przekaz za soba niesie? co czujesz? dodaj nieco tla do uploadowanej relacji!
      this.screenkaOn = screenkaOn; //czy bierze udzial w screence, kazdy ma dodac jeden pozadny kontent na screenke. (Jak chce dwa to rozdzieli to do dwoch roznych aplikacji!)
      /*?*/ this.comment = comment; // tylko jeden! , potrzebna do one-shot
      /*?*/ this.comment_user_fullname = comment_user_fullname; //kto
      
      /*?*/ this.top_number = top_number;
      /*?*/ this.is_highlighted = is_highlighted;

      /*NO*/ //judge score - wystarczy komentarz, ocene i ostateczni werdykt zostawiamy hotowi
      /*NO*/ //this.co_comment = co_comment; // komentarz jurora, jednego jurora , potrzebne do jugding-time // jeden komentarz period
      /*MAYBE */ //?tag - ???? np tapeta itp. a pozniej sortowanko
    }
  }
  