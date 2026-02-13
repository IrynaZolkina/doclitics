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

const currentFileMeta = createSlice({
  name: "currentFileMeta",
  initialState: initialFileState,
  reducers: {
    setCurrentFileMeta: (state, action) => {
      return { ...state, ...action.payload }; // merge new data
    },
    clearCurrentFileMeta: () => initialFileState, // reset correctly
  },
});

const initialUserState = {
  authChecked: false, // ✅ NEW
  isAuthenticated: false,

  id: null,
  email: null,
  username: null,
  plan: null,
  picture: null,
  docsAmount: 0,
  userSummaries: [], // 👈 add this
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUser(state, action) {
      state.authChecked = true; // ✅ NEW
      state.isAuthenticated = true;
      state.id = action.payload._id;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.plan = action.payload.plan ?? null;
      state.picture = action.payload.picture ?? null;
      state.docsAmount = action.payload.docsAmount ?? 0;
    },
    // ✅ add this
    setDocsAmount(state, action) {
      state.docsAmount = Number(action.payload) || 0;
    },

    // ✅ optional (if you want local decrement)
    decrementDocsAmount(state, action) {
      const n = action.payload ?? 1;
      state.docsAmount = Math.max(0, state.docsAmount - n);
    },
    setUserSummaries(state, action) {
      state.userSummaries = action.payload;
    },

    addUserSummary(state, action) {
      state.userSummaries.unshift(action.payload);
    },

    clearUserSummaries(state) {
      state.userSummaries = [];
    },
    clearUser(state) {
      // ✅ IMPORTANT: authChecked must become true after we checked
      state.authChecked = true;
      state.isAuthenticated = false;

      state.id = null;
      state.email = null;
      state.username = null;
      state.plan = null;
      state.picture = null;
      state.docsAmount = 0;
      // return initialUserState;
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

export const { addToast, removeToast } = toastSlice.actions;
export const { setFileData, clearFileData } = fileSlice.actions;
export const { setCurrentFileMeta, clearCurrentFileMeta } =
  currentFileMeta.actions;
export const {
  setUser,
  clearUser,
  setDocsAmount,
  decrementDocsAmount,
  setUserSummaries,
  addUserSummary,
  clearUserSummaries,
} = userSlice.actions;
export const { setLastPage } = pageSlice.actions;
export const { setSummary, clearSummary } = summarySlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    toast: toastSlice.reducer,
    file: fileSlice.reducer,

    page: pageSlice.reducer,
    summary: summarySlice.reducer,
  },
});
