import { NOW, YY_MMDD_HHMM, dayEqual, delay, getMonday, getPath, randomElement, weekEqual } from "../aFunctions";
import { DEMONOW, UserRepository } from "./aLocalbase";
import { PostClass } from "../Objects/Post/PostClass";
import { doc, updateDoc , arrayUnion, increment, setDoc, orderBy, where, limit} from "firebase/firestore";
import { db, getDoc, getDocs, getPostContentSrcFromStorage, storage} from "../Services/aFirebase";
import { ref, uploadBytes } from "firebase/storage";

export const usePostService = (demo)=> demo ? PostServiceDemo : PostService;

const PostService = {
    // getUserPostSnapshot - narazie oszczedzamy na readach w firestore, a nie jest to tez niewiadomo jaka przydatna funkcja przy sprawdzaniu
    // getHostWeekPosts - TO MUCH FOR DB

    getUserPost: async (user_fullname, id) => {
      let doc = await getDoc(`users/${user_fullname}/posts`, id);
      return PostClass.fromDoc(doc);
    },
    getUserPostAndTrySetView: async (user_fullname, id,comment_user_fullname) => {
      let doc = await getDoc(`users/${user_fullname}/posts`, id);
      let post = PostClass.fromDoc(doc);
      if(post!=null && user_fullname!==comment_user_fullname && post.comment_user_fullname===null ) {
        await updateDoc(doc(db, `users/${user_fullname}/posts`, id), {
          comment_user_fullname: comment_user_fullname,
        });
        post.comment_user_fullname = comment_user_fullname;
      }
      return post;
    },

    getUserOneShotPost:async(user_fullname,okApps)=>{
      let fromDate =new Date(NOW().setHours(0,0,0,0))
      let toDate = NOW();
      let docs = await getDocs(`users/${user_fullname}/posts`,where("upload_date",">=",fromDate),where("upload_date","<=",toDate),where("comment_user_fullname","==",null),where("app","in",okApps),limit(10));
      let doc = randomElement(docs);
      return PostClass.fromDoc(doc);
    },

    getUserLatestPost: async (user_fullname) => {
      let docs = await getDocs(`users/${user_fullname}/posts`,orderBy("upload_date","desc"),limit(1));
      return PostClass.fromDoc(docs?.at(0));
    },

    getUserPostTicketsUsed:async(user_fullname)=>{
      return PostService.getUserDayPosts(user_fullname,true).then(posts=>posts.length)
    },

    getUserDayPosts: async (user_fullname,screenkaOn= false) => {
      let fromDate =new Date(NOW().setHours(0,0,0,0))
      let toDate = NOW();
      let docs;
      if(screenkaOn) docs = await getDocs(`users/${user_fullname}/posts`,where("upload_date",">=",fromDate),where("upload_date","<=",toDate),where("screenkaOn","==",true),orderBy("upload_date"),limit(10));
      else docs = await getDocs(`users/${user_fullname}/posts`,where("upload_date",">=",fromDate),where("upload_date","<=",toDate),orderBy("upload_date"),limit(20));
      return docs.map((doc) => PostClass.fromDoc(doc));
    },
  
    getUserWeekPosts: async (user_fullname,screenkaOn=false) => {
      if(user_fullname==null) return null;
      let fromDate =getMonday();
      let toDate = NOW();
      let docs;
      if(screenkaOn) docs = await getDocs(`users/${user_fullname}/posts`,where("upload_date",">=",fromDate),where("upload_date","<=",toDate),where("screenkaOn","==",true),orderBy("upload_date"),limit(30));
      else docs = await getDocs(`users/${user_fullname}/posts`,where("upload_date",">=",fromDate),where("upload_date","<=",toDate),orderBy("upload_date"),limit(40));
      return docs.map((doc) => PostClass.fromDoc(doc));
    },
  
    getUserHostWeekPosts: async (user_fullname, host_id, week_name,screenkaOn=false)=> {
      if (user_fullname == null || host_id == null || week_name==null) return null;
      let docs;
      if(screenkaOn) docs = await getDocs(`users/${user_fullname}/posts`,where("host_id","==",host_id),where("week_name","==",week_name),where("screenkaOn","==",true),orderBy("upload_date"),limit(20));
      else docs = await getDocs(`users/${user_fullname}/posts`,where("host_id","==",host_id),where("week_name","==",week_name),orderBy("upload_date"),limit(30));
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
  
    trySetUserPostComment: async (user_fullname, id, comment_user_fullname, comment) => {
      if (user_fullname === comment_user_fullname) return false;
  
      let post = await PostService.getUserPost(user_fullname, id);
      if (post == null) return false;

      if(post.comment_user_fullname==null || (post.comment_user_fullname === comment_user_fullname && post.comment ==null))
      {
        await updateDoc(doc(db, `users/${user_fullname}/posts`, id), {
          comment_user_fullname: comment_user_fullname,
          comment: comment,
        });
        return true;
      }
      return false;
    },
  
    postPost: async (user_fullname, post, file = null) => {
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
            return setDoc(doc(db, "users", user_fullname, "posts", postName), post.toDoc());
        };
          
          const updateWeek = async () => {
            let host_id = post.host_id, week_name = post.week_name;
            if(!host_id || !week_name) return;
            let data = {
              latest_map: {user:user_fullname,app:post.app,date:NOW()},
              participants: arrayUnion(user_fullname),
            };
            data[`apps_counts_map.${post.app}`] = increment(1);
            return updateDoc(doc(db, "hosts", host_id, "weeks", week_name), data);
        };
          
          if (!post?.content) throw new Error();
          return uploadFile().then(uploadPost).then(updateWeek);
        },
    };

const PostServiceDemo = {
    getUserPost: async (user_fullname, id) => {
        await delay(1000);
        if (user_fullname === undefined || id === undefined) return undefined;
        let user = UserRepository.find((user) => user.fullname.toLowerCase() === user_fullname.toLowerCase());
        if (user === undefined) return undefined;
        return user.posts.find((post) => post.id === id);
    },
    getUserPostAndTrySetView: async (user_fullname, id,comment_user_fullname) => {
      await delay(1000);
      let user = UserRepository.find((user) => user.fullname.toLowerCase() === user_fullname.toLowerCase());
      let post = user?.posts.find((post) => post.id === id);
      if(post!=null && user_fullname!==comment_user_fullname && post.comment_user_fullname===null) {
        await updateDoc(doc(db, `users/${user_fullname}/posts`, id), {
          comment_user_fullname: comment_user_fullname,
        });
        post.comment_user_fullname = comment_user_fullname;
      }
      return post;
    },

    getUserOneShotPost:async(user_fullname,okApps)=>{
      let posts = PostServiceDemo.getUserDayPosts(user_fullname);
      let post = randomElement(posts);
      return post;
    },
    
    getUserLatestPost: async (user_fullname) => {
        let posts = await PostServiceDemo.getUserDayPosts(user_fullname);
        posts?.sort((a, b) => a.upload_date - b.upload_date);
        return posts?.[0];
    },
    
    getUserPostTicketsUsed:async(user_fullname)=>{
      return (await PostServiceDemo.getUserDayPosts(user_fullname)).filter(post=>post.screenkaOn===true).length;
    },

    getUserDayPosts: async (user_fullname,screenkaOn) => {
        await delay(1000);
        if (user_fullname == null) return null;
        let user = UserRepository.find((user) => user.fullname.toLowerCase() === user_fullname.toLowerCase());
        if (user == null) return null;
        return user.posts.filter((post) => dayEqual(post.upload_date, DEMONOW));
    },
    
    getUserWeekPosts: async (user_fullname,screenkaOn=false) => {
        await delay(1000);
        if (user_fullname == null) return null;
        let user = UserRepository.find((user) => user.fullname.toLowerCase() === user_fullname.toLowerCase());
        if (user == null) return null;
        return user.posts?.filter((post) => weekEqual(post.upload_date, DEMONOW));
    },
    
    getUserHostWeekPosts: async (user_fullname, host_id, week_name,screenkaOn=false) => {
        await delay(1000);
        if (user_fullname == null || host_id == null || week_name==null) return null;
        let user = UserRepository.find((user) => user.fullname.toLowerCase() === user_fullname.toLowerCase());
        if (user === undefined) return undefined;
        return user.posts?.filter((post) => post.host_id === host_id && post.week_name === week_name);
    },
    
    getPathPostContentUrl: async () => {
        return getPath("no_picture.png");
    },
    
    trySetUserPostComment: async (user_fullname, id, comment_user_fullname, comment) => {
        await delay(500);
        return true;
    },
    
    postPost: async (user_fullname, post, file = null) => {
        const uploadFile = async () => {
        if (file == null) return Promise.resolve();
        if (file.size > 4e6) throw new Error("Please upload a file smaller than 4MB");
        return Promise.resolve();
        };
    
        const uploadPost = async () => {
        return Promise.resolve();
        };
    
        const updateWeek = async () => {
        return Promise.resolve();
        };
    
        if (!post?.content) throw new Error();
        await delay(1000);
        return uploadFile().then(uploadPost).then(updateWeek);
    },
};
      