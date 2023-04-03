import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const appState = atom({
  key: "appState",
  default: {
    viewCompanyId: null,
    viewTeamId: null,
  },
  effects_UNSTABLE: [persistAtom],
});

export const userState = atom({
  key: "userState",
  default: {
    isLoggedIn: false,
    isAdmin: false,
    username: "",
    password: "",
  },
  effects_UNSTABLE: [persistAtom],
});

export const announcementsState = atom({
  key: "announcementsState",
  default: [],
});

export const companyState = atom({
  key: "companyState",
  default: [],
});

export const allUsersState = atom({
  key: "allUsersState",
  default: [],
});

export const errorState = atom({
  key: "errorState",
  default: {
    isError: false,
    message: "",
  },
});

export const modalState = atom({
  key: "modalState",
  default: {
    isOpen: false,
    type: "", // refer to ModalContainer.js for list of types
    data: {}, // do whatever you want with this
  },
});

export const projectsState = atom({
  key: "projectsState",
  default: [],
});

export const teamState = atom({
  key: "teamState",
  default: [],
});
