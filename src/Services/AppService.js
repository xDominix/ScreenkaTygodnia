import { Apps, BUILDIN_APPS } from "./aLocalbase";

export const useAppService = () => AppService;

const AppService = {
    getApp : (name) => Object.values(Apps).find(app=>app.name===name),
    getBuildinApps : ()=> BUILDIN_APPS
};
