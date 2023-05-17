import { delay, getPath, } from "../aFunctions";
import { DEMOUSERNAME, UserRepository } from "./aLocalbase";
import { UserClass as User, UserClass} from "../Objects/User/UserClass";
import { doc, updateDoc, where } from "firebase/firestore";
import { db, getDoc, getDocWhere, getDocs, getUserSrcFromStorage } from "../Services/aFirebase";

export const useUserService = (demo)=> demo ? UserServiceDemo : UserService;

const UserService = {
    getUser: async (fullname) => {
      if (fullname == null) return null;
      if (sessionStorage.getItem("users/" + fullname)) {
        let obj = JSON.parse(sessionStorage.getItem("users/" + fullname));
        return User.fromDoc(obj);
      }
      let doc = await getDoc("users", fullname);
      sessionStorage.setItem("users/" + fullname, JSON.stringify(doc));
      return User.fromDoc(doc);
    },
  
    getUserByUsername: async (username) => {
      return getDocWhere("users", "username", username).then(UserClass.fromDoc);
    },
  
    trySetUsername: async (fullname, username) => {
      if (username == null || username.length <= 0 || username.length > 20) return false;
  
      let user = await UserService.getUser(fullname);
      if (user == null) throw new Error("Wrong your fullname");
      if(!user.hosts || user.hosts.length===0) return false;
      
      let docs = await getDocs(`users`,where("hosts","array-contains-any",user.hosts),where("username","==",user.username))
      if(!docs || docs.length!==0) return false;

      await updateDoc(doc(db, "users", fullname), { username: username });
  
      return true;
    },
  
    trySetPersonalizedApps: async (fullname, apps) => {
      if (fullname == null || apps == null) return false;
      await updateDoc(doc(db, "users", fullname), { personalized_apps: apps });
      return true;
    },
  
    getUserSrcUrl: async (user_fullname) => {
      if (user_fullname == null) return null;
  
      let sessionUrl = sessionStorage.getItem(user_fullname + "_src");
      if (sessionUrl) return new Promise((resolve) => resolve(sessionUrl));
  
      return getUserSrcFromStorage(user_fullname).then((url) => {
        sessionStorage.setItem(user_fullname + "_src", url);
        return url;
      }).catch(err=>{if(err.code==='storage/object-not-found') return getPath("default_profile_picture.png"); else throw err;});
    },
};

const UserServiceDemo = {
    getUser: async (fullname) => {
      await delay(1000);
      if (fullname === undefined) return undefined;
      return UserRepository.find(
        (user) => user.fullname.toLowerCase() === fullname.toLowerCase()
      );
    },
  
    getUserByUsername: async (username) => {
      await delay(1000);
      if (username === undefined) return undefined;
      return UserRepository.find(
        (user) => user.username.toLowerCase() === DEMOUSERNAME.toLowerCase()
      );
    },
  
    trySetUsername: async (fullname, username) => {
      if (username == null || username.length <= 0 || username.length > 20)
        return false;
  
      let user = await UserServiceDemo.getUser(fullname);
      if (user == null) throw new Error("Wrong your fullname");
  
      //todo
      
      await delay(1000); // set
  
      return true;
    },
  
    trySetPersonalizedApps: async (fullname, apps) => {
      await delay(1000); // set
      return true;
    },
  
    getUserSrcUrl: async (user_fullname) => {
      return getPath("default_profile_picture.png");
    },
};
  
  