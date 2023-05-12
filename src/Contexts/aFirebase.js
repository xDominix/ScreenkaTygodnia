import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {doc, collection as dbCollection,getDoc as dbGetDoc, getDocs as dbGetDocs, query,where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAegBj5gvK08FHBAoB1B8FgSm_bgAGla5o",
  authDomain: "screenka-app.firebaseapp.com",
  projectId: "screenka-app",
  storageBucket: "screenka-app.appspot.com",
  messagingSenderId: "269459460789",
  appId: "1:269459460789:web:dd0c0760a3d01dcfd864fc",
  measurementId: "G-2VX4EY9R84"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app)

//functions

export async function getDoc(collection,document) {
  console.log("getDoc "+collection+"/"+document);
    if(collection==null || document==null) return null;
  try {
    const docSnapshot = await dbGetDoc(doc(db,collection,document));

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      if(data==null) return null
      return {id:docSnapshot.id,...data};
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting object document:', error);
    return null;
  }
}


export async function getDocWhere(collection,what,equal){
  console.log("getDocWhere from "+collection+" => "+equal);

    if(collection==null || what==null) return null;
    try {
    const q = query(dbCollection(db, collection), where(what, "==", equal));

    const querySnapshot = await dbGetDocs(q);
    let res = null;
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        res = {id:doc.id,...data}
        });
    return res;
    } catch (error) {
        console.error('Error getting document:', error);
        return null;
    }
}

export async function getDocsWhere(collection,what,equal){
    console.log("getDocsWhere from "+collection+" => "+equal);
    
    if(collection==null || what==null) return null;
    try {
    const q = query(dbCollection(db, collection), where(what, "==", equal));

    const querySnapshot = await dbGetDocs(q);
    const datas = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        datas.push({id:doc.id,...data});
        });
    return datas;
    } catch (error) {
        console.error('Error getting document:', error);
        return null;
    }
}

export async function getDocs(collection){
  console.log("getDocs from "+collection);
    if(collection==null) return null;
    try {
        const snapshot = await dbGetDocs(dbCollection(db,collection))
    
        const datas = [];
        snapshot.forEach((docSnapshot) => {
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            datas.push({id:docSnapshot.id,...data});
        }
        });
    
        return datas;
    } catch (error) {
        console.error('Error getting documents:', error);
        return null;
    }
}

//storage
export const getUserSrcFromStorage= (fullname)=> {
  console.log(fullname+"/src.jpg");
  return getDownloadURL(ref(storage, fullname+"/src.jpg"));
}

export const getPostFromStorage=(fullname,content)=>{ //jak narazie zakladamy ze to zdjecia
  console.log(fullname+"/"+content+" from Storage")
  return getDownloadURL(ref(storage, fullname+"/"+content));
}