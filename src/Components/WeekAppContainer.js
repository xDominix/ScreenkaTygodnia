import React, { useContext, useEffect, useMemo, useState } from 'react';
import AppContainer from '../Pages/_/home/components/AppContainer';
import { AuthContext } from '../Contexts/AuthContext';
import NothingToShow from '../Pages/NothingToShow';
import { AppClass } from '../Objects/App/AppClass';

const APPS_SIZE = 4;

const WeekAppContainer = ({host_id, week_name}) => {
    const {getHostWeekForScreenka}= useContext(AuthContext);

    const [week,setWeek] = useState(null);
    useEffect(()=>{
        if(host_id && week_name) getHostWeekForScreenka(host_id,week_name).then(setWeek);
    },[host_id,week_name]);

    const apps = useMemo(()=>{
        if(!week) return  new Array(APPS_SIZE).fill(AppClass.Default);
        let arr= Object.entries(week.apps_counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, APPS_SIZE)
            .map(([app, ]) => app);
        while(APPS_SIZE > arr.length) arr.push(AppClass.Default);
        return arr;
    },[week?.apps_counts])

    if(!week) return <NothingToShow/>
    return (  <AppContainer apps={apps} notificationCountsMap={week?.apps_counts} /> );
}
 
export default WeekAppContainer;