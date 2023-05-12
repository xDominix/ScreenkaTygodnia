import React from "react";
import { NOW, YYYYMMDDHHMM, dayEqual, delay, getPath, weekEqual } from "../aFunctions";
import { DEMONOW, UserRepository } from "./aLocalbase";
import { PostClass } from "../Objects/Post/PostClass";
import { addDoc, doc, updateDoc ,collection, arrayUnion, increment} from "firebase/firestore";
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
        return posts?.filter(post=> dayEqual(post.upload_date,NOW()));
    }

    const getUserWeekPosts = async (user_fullname,host_id=null,week_name=null)=>{
        if(week_name==null || host_id==null)
        {
            let docs = await getDocs(`users/${user_fullname}/posts`);
            let posts = docs.map(doc=>PostClass.fromDoc(doc));
            return posts?.filter(post=> weekEqual(post.upload_date,NOW()));
        }

        let docs = await getDocsWhere(`users/${user_fullname}/posts`,"week_name",week_name);
        let posts = docs.map(doc=>PostClass.fromDoc(doc));
        posts = docs?.filter(post=> post.host_id === host_id);
        return posts?.filter(post=> weekEqual(post.upload_date,NOW()));
    }

    const getUserHostWeekPosts = async (user_fullname,host_id,week_name=null)=>{
        if(user_fullname==null || host_id==null) return null
        return await getUserWeekPosts(user_fullname,host_id,week_name);
     }

    // const getHostWeekPosts ()=>{} // TO MUCH FOR DB

    const getPathPostContentUrl = async (user_fullname,content)=>{
        if(content==null) return null;

        let sessionUrl =sessionStorage.getItem(content);
        if(sessionUrl) return new Promise((resolve, ) => { resolve(sessionUrl); });

        return getPostFromStorage(user_fullname,content).then(url=>{
            sessionStorage.setItem(content,url);
            return url;
        })
    }

    //SETTERS

    const setUserPostComment = async (user_fullname,id, comment_user_fullname,comment=null)=>{
        if(user_fullname === comment_user_fullname) return false;

        let post = await getUserPost(user_fullname,id);
        if(post==null || post.comment_user_fullname) return false;

        if(comment!=null) await updateDoc(doc(db, `users/${user_fullname}/posts`,id),{comment_user_fullname:comment_user_fullname,comment:comment});
        else await updateDoc(doc(db, `users/${user_fullname}/posts`,id),{comment_user_fullname:comment_user_fullname});

        return true;
    }

    const postPost = async (user_fullname,host_id,week_name,post,file=null)=>{

        if(file!=null)
        {
            let secure_filename = YYYYMMDDHHMM(post.upload_date)+"_"+file.name;
            post.content = secure_filename;

            let fileRef = ref(storage,user_fullname+'/'+secure_filename);
            await uploadBytes(fileRef,file);
            console.log('Uploaded file to '+user_fullname+'/'+secure_filename);
        }

        const docRef = await addDoc(collection(db, `users/${user_fullname}/posts`), post.toDoc());

        let data = {
            latest_uploader:user_fullname,
            participants:arrayUnion(user_fullname) }
        data[`apps_counts_map.${post.app}`] =  increment(1);
        updateDoc(doc(db,"hosts",host_id,"weeks",week_name),data)

        console.log("Document written with ID: ", docRef.id);
    }

    const value = {
        getUserPost,
        getUserDayPosts,getUserWeekPosts,getUserHostWeekPosts,
        setUserPostComment,getPathPostContentUrl,postPost
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

    const getUserWeekPosts = async (user_fullname,host_id=null,week_name=null)=>{
        await delay(1000); 
        if(user_fullname!=null && host_id!=null && week_name!=null) return await getUserHostWeekPosts(user_fullname,host_id,week_name)
        if(user_fullname==null ) return null
        let user= UserRepository.find(user=>user.fullname.toLowerCase()===user_fullname.toLowerCase())
        if(user==null) return null;
        return user.posts?.filter(post=> weekEqual(post.upload_date,DEMONOW));
    }

    const getUserHostWeekPosts = async (user_fullname,host_id,week_name=null)=>{
        await delay(1000); 
        if(user_fullname==null || host_id==null ) return undefined
        let user= UserRepository.find(user=>user.fullname.toLowerCase()===user_fullname.toLowerCase())
        if(user===undefined) return undefined;
        return user.posts?.filter(post=> post.host_id===host_id && post.week_name===week_name);
    }

    // const getHostWeekPosts ()=>{} // TO MUCH FOR DB

    const getPathPostContentUrl = async ()=>{
        return getPath('no_picture.png');
    }

    //SETTERS

    const setUserPostComment = async (user_fullname,id, comment_user_fullname,comment=null)=>{
        //comment is already set return false
        delay(500);
        return true;
    }

    const postPost = async (user_fullname,host,week,post,file=null)=>{
        await delay(2000);
        if(file){
            await delay(1000);
            console.log('Uploaded file to '+user_fullname+'/'+file.name);
        } 
        return true;
    }
    
    const value = {
        getUserPost,
        getUserDayPosts,getUserWeekPosts,getUserHostWeekPosts,
        setUserPostComment,getPathPostContentUrl,postPost
    }

    return ( 
    <PostContext.Provider value={value}>
        {children}
    </PostContext.Provider> );
}