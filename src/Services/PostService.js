import { NOW, YY_MMDD_HHMM, dateToWeekDay, dayEqual, delay, getMonday, getPath, } from "../aFunctions";
import { DEMONOW, PostRepositoryMap } from "./aDemobase";
import { PostClass } from "../Objects/Post/PostClass";
import { doc, updateDoc , arrayUnion, increment, setDoc, orderBy, where, limit} from "firebase/firestore";
import { db, getDoc, getDocs, getPostContentSrcFromStorage, storage} from "../Services/aFirebase";
import { ref, uploadBytes } from "firebase/storage";

export const usePostService = (demo)=> demo ? PostServiceDemo : PostService;

const PostService = {

    getUserPost: async (user_fullname, id) => {
      let doc = await getDoc(`users/${user_fullname}/posts`, id);
      let post =  PostClass.fromDoc(doc);
      if(!post.permissions.me) return null
      return post;
    },
    getUserPostAndTrySetView: async (user_fullname, id,view_fullname) => {
      if(!user_fullname || !id || !view_fullname) return null;
      let doc = await getDoc(`users/${user_fullname}/posts`, id);
      let post = PostClass.fromDoc(doc);
      if(!post.permissions.me) return null
      if(post!=null && user_fullname!==view_fullname && post.view===null ) {
        await updateDoc(doc(db, `users/${user_fullname}/posts`, id), {
          view: view_fullname,
        });
        post.view = view_fullname;
      }
      return post;
    },

    getUserCurrentDayRandomPost: async (user_fullname,host_id,forFriends=null,okApps=[]) => {//today post
      if(user_fullname || host_id) return null;
      let fromDate =new Date(NOW().setHours(0,0,0,0))
      let toDate = NOW();

      let random = Math.random(); 
      let opStr = Math.random() >= 0.5?">=":"<=";

      let queries = [where("upload_date",">=",fromDate),where("upload_date","<=",toDate),where("host_id","==",host_id),where("permissions.me","==",true)]
      if(forFriends!==null) queries.push(where("permissions.friends","==",forFriends));
      if(okApps) queries.push("app","in",okApps);
      let docs = await getDocs(`users/${user_fullname}/posts`,...queries,where("random",opStr,random),orderBy("random"),limit(1));
      if(!docs|| docs.length!== 1) docs = await getDocs(`users/${user_fullname}/posts`,...queries,where("random",opStr===">="?"<=":">=",random),orderBy("random"),limit(1));
      return PostClass.fromDoc(docs?.at(0));
    },

    getUserLatestPost: async (user_fullname,host_id) => {
      if(user_fullname || host_id) return null;
      let docs = await getDocs(`users/${user_fullname}/posts`,where("host_id","==",host_id),orderBy("upload_date","desc"),limit(1));
      let post = PostClass.fromDoc(docs?.at(0)); 
      if(!post.permissions.me) return null;
      return post
    },

    getUserPostTicketsUsed:async(user_fullname,host_id)=>{
      return PostService.getUserCurrentDayPosts(user_fullname,host_id,true).then(posts=>posts.length)
    },

    getUserCurrentDayPosts: async (user_fullname,host_id,forScreenka=null) => { //czesciowo host_id jest uzywne, dla postow z dnia jest muli-host rezultat
      if(!user_fullname) return [];
      let fromDate =new Date(NOW().setHours(0,0,0,0))
      let toDate = NOW();
      let docs;
      if(forScreenka!==null) 
      {
         if(host_id) docs= await getDocs(`users/${user_fullname}/posts`,where("upload_date",">=",fromDate),where("upload_date","<=",toDate),where("host_id","==",host_id),where("permissions.me","==",true),where("permissions.screenka","==",forScreenka),orderBy("upload_date","desc"),limit(20));
        else docs= await getDocs(`users/${user_fullname}/posts`,where("upload_date",">=",fromDate),where("upload_date","<=",toDate),where("permissions.me","==",true),where("permissions.screenka","==",forScreenka),orderBy("upload_date","desc"),limit(20));
      }
      else docs= await getDocs(`users/${user_fullname}/posts`,where("upload_date",">=",fromDate),where("upload_date","<=",toDate),where("permissions.me","==",true),orderBy("upload_date","desc"),limit(20));
      return docs? docs.map((doc) => PostClass.fromDoc(doc)) : [];
    },

    getUserCurrentWeekPosts: async (user_fullname,host_id) => {
      if (user_fullname == null) return null;
  
      let queries;
      let fromDate =getMonday(), toDate = NOW();
      queries = [where("upload_date",">=",fromDate),where("upload_date","<=",toDate),where("permissions.me","==",true)];
      if(host_id!==null) queries.push(where("host_id","==",host_id))
      queries.push(orderBy("upload_date","desc"),limit(30));
      let docs = await getDocs(`users/${user_fullname}/posts`,...queries);
      return docs.map((doc) => PostClass.fromDoc(doc));
    },

    getUserPastWeekPosts: async (user_fullname, week_name,host_id=null,forScreenka=false,okApps=[], no_view=false)=> {
      if (user_fullname == null || week_name==null) return null;
  
      let queries;
      if(week_name) queries = [where("week_name","==",week_name)];
      if(host_id!==null) queries.push(where("host_id","==",host_id))
      queries.push(where("permissions.me","==",true));
      if(forScreenka!==null) queries.push(where("permissions.screenka","==",forScreenka))
      if(no_view) queries.push(where("view","==",null));
      if(okApps) queries.push("app","in",okApps);
      queries.push(orderBy("upload_date","desc"),limit(30));

      let docs = await getDocs(`users/${user_fullname}/posts`,...queries);
      return docs.map((doc) => PostClass.fromDoc(doc));
    },
  
    getPathPostContentUrl: async (user_fullname, content) => {
      if (content == null) return null;
  
      let sessionUrl = sessionStorage.getItem(content);
      if (sessionUrl) return new Promise((resolve) => resolve(sessionUrl));
  
      return getPostContentSrcFromStorage(user_fullname, content).then((url) => {
        sessionStorage.setItem(content, url);
        return url;
      }).catch(err=>{if(err.code==='storage/object-not-found') return getPath("no_picture.png"); else throw err;});
    },

    changePostPermissions: async(user_fullname,post_id, permissions)=>{
      if(!user_fullname || !post_id) return null;
      console.log("post "+post_id+ " change permissions");
      let res = {}
      if(permissions.me!=null) res["permissions.me"] = permissions.me;
      if(permissions.friends!=null) res["permissions.friends"] = permissions.friends;
      if(permissions.screenka!=null) res["permissions.screenka"] = permissions.screenka;
      return updateDoc(doc(db, "users", user_fullname, "posts", post_id), res);
    },
  
    postPost: async (user_fullname, post, file = null) => { //returns id or error
        const uploadFile = async () => {
            if (file == null) return Promise.resolve();
            if (file.size > 4e6) throw new Error("Please upload a file smaller than 4MB");
            let secure_filename = YY_MMDD_HHMM(post.upload_date)+ ( post.context ? ("_"+ post.context.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0,15)):"")
            post.content = secure_filename;
            let fileRef = ref(storage, user_fullname + "/" + secure_filename);
        
            return uploadBytes(fileRef, file);
        };

        const uploadPost = async () => {
            let postName = YY_MMDD_HHMM(post.upload_date);//= (new Date(2100, 0, 0).valueOf() - post.upload_date.valueOf()).toString();
            res = postName;
            return setDoc(doc(db, "users", user_fullname, "posts", postName), post.toDoc());
        };
          
          const updateWeek = async () => {
            let host_id = post.host_id, week_name = post.week_name;
            if(!host_id || !week_name) return Promise.resolve();
            let data = {
              latest: (post.permissions.friends?{user:user_fullname,app:post.app,date:NOW()}:{app:post.app,date:NOW()}),
            };
            data[`day_participants.${dateToWeekDay(NOW())}`] = arrayUnion(user_fullname); //zeby nie bylo ze jest ghosted
            data[`day_apps_counts.${dateToWeekDay(NOW())}.${post.app}`] = increment(1);
            return updateDoc(doc(db, "hosts", host_id, "weeks", week_name), data);
        };
          
          if (!post?.content) throw new Error();
          var res = null;
          return uploadFile().then(uploadPost).then(updateWeek).then(()=>res);
        },
    };

const PostServiceDemo = {
    getUserPost: async (user_fullname, id) => {
        await delay(1000);
        return PostRepositoryMap.get(user_fullname).find((post) => post.id === id);
    },
    getUserPostAndTrySetView: async (user_fullname, id,view) => {
      await delay(1000);
      let post = PostRepositoryMap.get(user_fullname).find((post) => post.id === id);
      if(post!=null && user_fullname!==view && post.view===null) {
        await updateDoc(doc(db, `users/${user_fullname}/posts`, id), {
          view: view,
        });
        post.view = view;
      }
      return post;
    },

    getUserCurrentDayRandomPost: async (user_fullname,host_id,forFriends=null,okApps=[]) => {
      let posts = await PostServiceDemo.getUserCurrentDayPosts(user_fullname,null);
      if(!posts) return null;
      posts.sort(() => 0.5 - Math.random());
      return posts?.at(0);
    },

    getUserLatestPost: async (user_fullname,host_id) => {
        let posts = await PostServiceDemo.getUserCurrentDayPosts(user_fullname);
        posts?.sort((a, b) => a.upload_date - b.upload_date);
        return posts?.[0];
    },
    
    getUserPostTicketsUsed:async(user_fullname,host_id)=>{
      return (await PostServiceDemo.getUserCurrentDayPosts(user_fullname,null)).filter(post=>post.permissions.screenka===true).length;
    },

    getUserCurrentDayPosts: async (user_fullname,host_id,forScreenka) => {//narazie bez
        await delay(500);
        if (user_fullname == null) return [];
        return PostRepositoryMap.get(user_fullname)?.filter((post) => dayEqual(post.upload_date, DEMONOW)).filter(post=>post.permissions.me === true);
    },
 
    getUserCurrentWeekPosts: async (user_fullname,host_id) => { //narazie bez
      if(!user_fullname) return null;
      return PostService.getUserPastWeekPosts(user_fullname,host_id)
    },
    
    getUserPastWeekPosts: async (user_fullname, week_name,host_id=null,forScreenka=false,okApps=[])=> {
        await delay(1000);
        if (user_fullname == null || host_id == null || week_name==null) return null;
        return PostRepositoryMap.get(user_fullname)?.filter((post) => post.host_id === host_id && post.week_name === week_name);
    },
    
    getPathPostContentUrl: async () => {
        return getPath("no_picture.png");
    },

    changePostPermissions: async(user_fullname,post_id, permissions)=>{
      if(!user_fullname || !post_id) return null;
        await delay(200);
    },
    
    postPost: async (user_fullname, post, file = null) => {//return id or error
        const uploadFile = async () => {
        if (file == null) return Promise.resolve();
        if (file.size > 4e6) throw new Error("Please upload a file smaller than 4MB");
        return Promise.resolve();
        };
    
        const uploadPost = async () => {
          let postName = YY_MMDD_HHMM(post.upload_date);
          res = postName;
          return Promise.resolve();
        };
    
        const updateWeek = async () => {
        return Promise.resolve();
        };
        
        var res= null;
        if (!post?.content) throw new Error();
        await delay(1000);
        return uploadFile().then(uploadPost).then(updateWeek).then(()=>res);
    },
};
      