export class PostClass {
    constructor(
      id,
      team,
      week_name,
      upload_date,
      app,
      content,
      context,
      screenkaOn,
      comment,
      comment_user_id,
      co_comment,
      co_comment_user_id,
      is_highlighted,
      top_number
    ) {
      this.id = id; 
      this.team = team;
      this.week = week_name;
      this.upload_date = upload_date;
      this.app = app;
      this.content = content; 
      this.context = context;
      this.screenkaOn = screenkaOn;
      this.comment = comment;
      this.comment_user_id = comment_user_id;
      this.co_comment = co_comment;
      this.co_comment_user_id = co_comment_user_id;
      this.is_highlighted = is_highlighted;
      this.top_number = top_number;
    }
  }
  