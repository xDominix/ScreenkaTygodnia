//CONSTS
export const MAX_TICKETS = 3;
export const MAX_SCREENKA = 3;
export const ADMIN = true;
export const CUSTOM_DATE = new Date(2021,3,3,10,10);
export const NOW = ()=> new Date(); //CUSTOM DATE

//PATH
export const getPath=(file)=>{
    return `${process.env.PUBLIC_URL}/assets/${file}`
}

export const getAppFullSrc=(app_name,size=64)=>{
    if(size<=64) return getPath("app-logos-64/"+app_name.toLowerCase()+".png")
    return getPath("app-logos-128/"+app_name.toLowerCase()+".png")
}

//ASYNC

export function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

//DATE
export const MonthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];

export const isDayToday=(dayIndex)=>{ return (NOW().getDay()+6)%7 === dayIndex;}

export const dayIndexToday=()=>{ return (NOW().getDay()+6)%7 }

export function getMonday(d) {
    d = new Date(d);
    d.setHours(0,0,0,0);
    var day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

export function dayEqual(instancedate1, instancedate2) {
    return instancedate1.getFullYear() === instancedate2.getFullYear() &&
    instancedate1.getMonth() === instancedate2.getMonth() &&
    instancedate1.getDate() === instancedate2.getDate()
}
export function weekEqual(date1, date2) {
    return datesWeekDelta(date1,date2)===0;
}

const isBetweenHour = (fromHour,toHour)=>{
    let hour=NOW().getHours();
    return fromHour<=hour && hour<toHour;
}

export const isTime=(weekIndex,fromHour,toHour) =>{
    if(weekIndex==null) return isBetweenHour(fromHour,toHour);
    if(!isDayToday(weekIndex)) return false;
    if(!isBetweenHour(fromHour,toHour)) return false;
    return true;
}
    
export const dateToHourString = (date)=>{
    return (
        date.getHours().toLocaleString('en-US', { minimumIntegerDigits: 1, useGrouping: false })+ ":"+ 
        date.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }))
}

export const datesWeekDelta = (date1,date2)=>{
    date1 = getMonday(date1);
    date2 = getMonday(date2);
    let dayDelta = Math.ceil((date1.getTime()-date2.getTime()) / (1000 * 3600 * 24));
    dayDelta = Math.abs(dayDelta);
    return Math.floor(dayDelta/7);
}

export const isLessThenMinutes = (date,minutes)=>{
    var diff = NOW() - date;
    if(diff<0) return false;
    var diffMinutes = Math.floor((diff/1000)/60);
    return minutes >= diffMinutes;
}

export const YYYYMMDDHHMM=(date)=>{
    function pad2(n) {  return (n < 10 ? '0' : '') + n; }
    return date.getFullYear() +
        pad2(date.getMonth() + 1) + 
        pad2(date.getDate()) +
        pad2(date.getHours()) +
        pad2(date.getMinutes())
}

//RANDOM
export const randomElement = (array)=>{
    return array[Math.floor(Math.random() * array.length)];
}

//MAP
export const toMap=(doc)=>{
    const map = new Map();
    Object.entries(doc).forEach(([key, value]) => { map.set(key, value) });
    return map;
}
/*
export const fromMap = (map)=>{
    const firestoreMap = {};
    map.forEach((value, key) => {
    firestoreMap[key] = value;
    });
    return firestoreMap;
}*/

//name
export const shortenFullname=(fullname)=>{
    let splits = fullname.split(" ");
    splits = splits.map((split,i)=>{return i===0?split:(split.charAt(0)+".")})
    return splits.join(" ");
}

