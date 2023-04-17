//CONSTS
export const MAX_TICKETS = 3;
export const NOW = new Date();

//PATH
export const getPath=(file)=>{
    return `${process.env.PUBLIC_URL}/assets/${file}`
}

export const getAppFullSrc=(app_name,size=64)=>{
    if(size<=64) return getPath("app-logos-64/"+app_name.toLowerCase()+".png")
    return getPath("app-logos-128/"+app_name.toLowerCase()+".png")
}


export const getUserFullSrc=(src)=>{
    if(src==null) return getPath('default_profile_picture.png')
    return getPath('default_profile_picture.png') //TODO
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

export const isDayToday=(dayIndex)=>{ return (new Date().getDay()+6)%7 === dayIndex;}

export const dayIndexToday=()=>{ return (new Date().getDay()+6)%7 }

export function getMonday(d) {
    d = new Date(d);
    d.setHours(0,0,0,0);
    var day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

export function dateEqual(instancedate1, instancedate2) {
    return instancedate1.getFullYear() === instancedate2.getFullYear() &&
    instancedate1.getMonth() === instancedate2.getMonth() &&
    instancedate1.getDate() === instancedate2.getDate()
}
export function weekEqual(date1, date2) {
    return datesWeekDelta(date1,date2)===0;
}

const isBetweenHour = (fromHour,toHour)=>{
    let hour=new Date().getHours();
    return fromHour<=hour && hour<toHour;
}

export const isTime=(weekIndex,fromHour,toHour) =>{
    if(!isDayToday(weekIndex)) return false;
    if(!isBetweenHour(fromHour,toHour)) return false;
    return true;
}
    
export const dateToHourString = (date)=>{
    return (
        date.getHours().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })+ ":"+ 
        date.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }))
}

export const datesWeekDelta = (date1,date2)=>{
    date1 = getMonday(date1);
    date2 = getMonday(date2);
    let dayDelta = Math.ceil((date1.getTime()-date2.getTime()) / (1000 * 3600 * 24));
    dayDelta = Math.abs(dayDelta);
    return Math.floor(dayDelta/7);
}

//STRING
export const shortFullname= (fullname)=>{
    let splits = fullname.split(" ");
    splits = splits.map((split,i)=>{return i===0?split:(split.charAt(0)+".")})
    return splits.join(" ");
}