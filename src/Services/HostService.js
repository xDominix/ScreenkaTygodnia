import { NOW, datesWeekDelta, delay, } from "../aFunctions";
import { DEMONOW, HostRepository } from "./aLocalbase";
import { Host } from "../Objects/Host";
import { getDoc } from "../Services/aFirebase";

export const useHostService = (demo)=> demo ? HostServiceDemo : HostService;

const HostService = {
    getHost: async (id) => {
      let doc = await getDoc("hosts", id);
      return Host.fromDoc(doc);
    },

    getHostWeekNumber: (host) => {
      if (host == null) return null;
      return datesWeekDelta(host.start_date, NOW());
    },
};

const HostServiceDemo = {
    getHost: async (id) => {
      if (id === undefined) return undefined;
      await delay(500);
      return HostRepository.find((host) => host.id === id);
    },
  
    getHostWeekNumber: (host) => {
      if (host == null) return null;
      return datesWeekDelta(host.start_date, DEMONOW);
    },
};
  
  