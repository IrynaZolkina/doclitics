import { configureStore, createSlice } from "@reduxjs/toolkit";

// Toast slice
const toastSlice = createSlice({
  name: "toast",
  initialState: [],
  reducers: {
    addToast: (state, action) => {
      state.push({
        id: Date.now(),
        type: action.payload.type || "info", // "success", "error", "warning", "info"
        message: action.payload.message,
      });
    },
    removeToast: (state, action) => {
      return state.filter((toast) => toast.id !== action.payload);
    },
  },
});
// Counter slice
// File slice
const initialFileState = {
  fileName: "",
  fileType: "",
  storeTotalPages: "",
  storeExtractedTexts: "",
  fileSize: 0,
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
    username: "",
    email: "",
    isLoggedIn: false,
  },
  reducers: {
    login: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.username = "";
      state.email = "";
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export const { addToast, removeToast } = toastSlice.actions;
export const { setFileData, clearFileData } = fileSlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    toast: toastSlice.reducer,
    file: fileSlice.reducer,
  },
});
