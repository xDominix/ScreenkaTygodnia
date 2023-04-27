import React from "react";
import { NOW, dayEqual, delay, getPath, weekEqual } from "../aFunctions";
import { DEMONOW, UserRepository } from "./aLocalbase";
import { PostClass } from "../Objects/Post/PostClass";
import { addDoc, doc, updateDoc ,collection} from "firebase/firestore";
import { db, getDoc, getDocs ,getDocsWhere, getPostFromStorage, storage} from "./aFirebase";
import { ref, uploadBytes } from "firebase/storage";


export const PostContext = React.createContext();

export const PostProvider = ({children}) => {

    const getUserPost = async (user_fullname,id)=>{
        let doc = await getDoc(`users/${user_fullname}/posts`,id);
        return PostClass.fromDoc(doc);
    }

    const getUserDayPosts = async (user_fullname)=>{
        let docs = await getDocs(`users/${user_fullname}/posts`);
        let posts = docs.map(doc=>PostClass.fromDoc(doc));
        return posts?.filter(post=> dayEqual(post.upload_date,NOW));
    }

    const getUserWeekPosts = async (user_fullname,team_id=null,week_name=null)=>{
        if(week_name==null || team_id==null)
        {
            let docs = await getDocs(`users/${user_fullname}/posts`);
            let posts = docs.map(doc=>PostClass.fromDoc(doc));
            return posts?.filter(post=> weekEqual(post.upload_date,NOW));
        }

        let docs = await getDocsWhere(`users/${user_fullname}/posts`,"week_name",week_name);
        let posts = docs.map(doc=>PostClass.fromDoc(doc));
        posts = docs?.filter(post=> post.team_id === team_id);
        return posts?.filter(post=> weekEqual(post.upload_date,NOW));
    }

    const getUserTeamWeekPosts = async (user_fullname,team_id,week_name=null)=>{
        if(user_fullname==null || team_id==null) return null
        return await getUserWeekPosts(user_fullname,team_id,week_name);
     }

    // const getTeamWeekPosts ()=>{} // TO MUCH FOR DB

    const getPathPostUrl = async (post)=>{
        if(post==null || post.content==null) return null;

        let sessionUrl =sessionStorage.getItem(post.content);
        if(sessionUrl) return new Promise((resolve, ) => { resolve(sessionUrl); });

        return getPostFromStorage(post.content).then(url=>{
            sessionStorage.setItem(post.content,url);
            return url;
        })
    }

    //SETTERS

    const setUserPostComment = async (user_fullname,id, comment_user_fullname,comment=null)=>{

        let post = await getUserPost(user_fullname,id);
        if(post==null || post.comment_user_fullname) return false;

        if(comment!=null) await updateDoc(doc(db, `users/${user_fullname}/posts`,id),{comment_user_fullname:comment_user_fullname,comment:comment});
        else await updateDoc(doc(db, `users/${user_fullname}/posts`,id),{comment_user_fullname:comment_user_fullname});

        return true;
    }

    const postPost = async (user_fullname,post)=>{

        const docRef = await addDoc(collection(db, `users/${user_fullname}/posts`), post.toDoc());

        console.log("Document written with ID: ", docRef.id);
    }

    const postFile = async (filename)=>{
        if(!filename) return;

        let ref = ref(storage,'posts/'+filename);

        await uploadBytes(ref,filename)

        console.log('Uploaded file to posts/'+filename);
    }
    

    const value = {
        getUserPost,
        getUserDayPosts,getUserWeekPosts,getUserTeamWeekPosts,
        setUserPostComment,getPathPostUrl,postPost,postFile
    }

    return ( 
    <PostContext.Provider value={value}>
        {children}
    </PostContext.Provider> );
}


export const PostDemoProvider = ({children}) => {

    const getUserPost = async (user_fullname,id)=>{
        await delay(1000); 
        if(user_fullname===undefined || id===undefined) return undefined
        let user= UserRepository.find(user=>user.fullname.toLowerCase()===user_fullname.toLowerCase())
        if(user===undefined) return undefined;
        return user.posts.find(post => post.id===id);
    }

    const getUserDayPosts = async (user_fullname)=>{
        await delay(1000); 
        if(user_fullname==null) return null
        let user= UserRepository.find(user=>user.fullname.toLowerCase()===user_fullname.toLowerCase())
        if(user==null) return null;
        return user.posts.filter(post=> dayEqual(post.upload_date,DEMONOW));
    }

    const getUserWeekPosts = async (user_fullname,team_id=null,week_name=null)=>{
        await delay(1000); 
        if(user_fullname!=null && team_id!=null && week_name!=null) return await getUserTeamWeekPosts(user_fullname,team_id,week_name)
        if(user_fullname==null ) return null
        let user= UserRepository.find(user=>user.fullname.toLowerCase()===user_fullname.toLowerCase())
        if(user==null) return null;
        return user.posts?.filter(post=> weekEqual(post.upload_date,DEMONOW));
    }

    const getUserTeamWeekPosts = async (user_fullname,team_id,week_name=null)=>{
        await delay(1000); 
        if(user_fullname==null || team_id==null ) return undefined
        let user= UserRepository.find(user=>user.fullname.toLowerCase()===user_fullname.toLowerCase())
        if(user===undefined) return undefined;
        return user.posts?.filter(post=> post.team_id===team_id && post.week_name===week_name);
    }

    // const getTeamWeekPosts ()=>{} // TO MUCH FOR DB

    const getPathPostUrl = async ()=>{
        return getPath('no_picture.png');
    }

    //SETTERS

    const setUserPostComment = async (user_fullname,id, comment_user_fullname,comment=null)=>{
        //comment is already set return false
        delay(500);
        return true;
    }

    const postPost = async (user_fullname,post)=>{
        await delay(2000);
        return true;
    }

    const postFile = async (filename)=>{
        if(!filename) return;
        await delay(2000)

        console.log('Uploaded file to posts/'+filename);
    }
    
    

    const value = {
        getUserPost,
        getUserDayPosts,getUserWeekPosts,getUserTeamWeekPosts,
        setUserPostComment,getPathPostUrl,postPost,postFile
    }

    return ( 
    <PostContext.Provider value={value}>
        {children}
    </PostContext.Provider> );
}