import { Apps, BUILDIN_APPS } from "./aLocalbase";

export const useAppService = () => AppService;

const AppService = {
    getApps :()=>Object.values(Apps),
    getBuildinApps : ()=> BUILDIN_APPS
};
