import { Apps, BUILDIN_APPS } from "./aLocalbase";

export const useAppService = (demo)=> demo===undefined ? null: AppService;

const AppService = {
    getApps :()=>Apps,
    getBuildinApps : ()=> BUILDIN_APPS.map(app=>Apps[app]) 
};
