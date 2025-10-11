import { configureStore, createSlice } from "@reduxjs/toolkit";
import { use } from "react";

// Toast slice
const toastSlice = createSlice({
  name: "toast",
  initialState: null,
  reducers: {
    addToast: (state, action) => {
      return {
        id: Date.now() + Math.random(),
        type: action.payload.type || "info", // "success", "error", "warning", "info"
        message: action.payload.message,
      };
    },
    removeToast: () => null,
  },
});
// Counter slice
// File slice

export const summarySlice = createSlice({
  name: "summary",
  initialState: {
    choices: "",
    // choices: [],
  },
  reducers: {
    setSummary: (state, action) => {
      // action.payload should be array of choices
      state.choices = action.payload;
    },
    clearSummary: (state) => {
      state.choices = "";
      // state.choices = [];
    },
  },
});
/********************************** */
const initialFileState = {
  fileName: "",
  fileType: "",
  storeTotalPages: "",
  storeExtractedTexts: "",
  fileSize: 0,
  formattedPrompt: "",
  type: "",
  style: "",
  depth: "",
  tone: "",
};
const fileSlice = createSlice({
  name: "file",
  initialState: initialFileState,
  reducers: {
    setFileData: (state, action) => {
      return { ...state, ...action.payload }; // merge new data
    },
    clearFileData: () => initialFileState, // reset correctly
  },
});

// User slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    accessToken: null,
    username: "",
    email: "",
    isLoggedIn: false,
  },
  reducers: {
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.username = "";
      state.email = "";
      state.isLoggedIn = false;
    },
  },
});

const pageSlice = createSlice({
  name: "app",
  initialState: {
    lastPage: "/",
  },
  reducers: {
    setLastPage(state, action) {
      state.lastPage = action.payload;
    },
  },
});

const userNameSlice = createSlice({
  name: "userName",
  initialState: {
    username: "",
    useremail: "",
    userIsLoggedIn: false,
    userCategory: "",
  },
  reducers: {
    setUserLogin: (state, action) => {
      state.username = action.payload.username;
      state.useremail = action.payload.email;
      state.userIsLoggedIn = true;
      state.userCategory = action.payload.userCategory; //
      state.picture = action.payload.picture; //
    },
    setUserLogout: (state) => {
      state.username = "";
      state.useremail = "";
      state.userIsLoggedIn = false;
      state.userCategory = "";
      state.picture = "";
    },
  },
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearUser(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    setLoading(state) {
      state.loading = true;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});
export const { setUser, clearUser, setLoading, setError } = authSlice.actions;
export const { login, logout } = userSlice.actions;
export const { addToast, removeToast } = toastSlice.actions;
export const { setFileData, clearFileData } = fileSlice.actions;
export const { setUserLogin, setUserLogout } = userNameSlice.actions;
export const { setLastPage } = pageSlice.actions;
export const { setSummary, clearSummary } = summarySlice.actions;

export const store = configureStore({
  reducer: {
    userNameSlice: userNameSlice.reducer,
    user: userSlice.reducer,
    toast: toastSlice.reducer,
    file: fileSlice.reducer,
    auth: authSlice.reducer,
    page: pageSlice.reducer,
    summary: summarySlice.reducer,
  },
});
