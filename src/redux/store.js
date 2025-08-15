import { configureStore, createSlice } from "@reduxjs/toolkit";

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

// Toast slice
const toastSlice = createSlice({
  name: "toast",
  initialState: [],
  reducers: {
    addToast: (state, action) => {
      state.push(action.payload);
    },
    removeToast: (state, action) => {
      return state.filter((toast) => toast.id !== action.payload);
    },
  },
});

// Counter slice
const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

export const { login, logout } = userSlice.actions;
export const { addToast, removeToast } = toastSlice.actions;
export const { increment, decrement, reset } = counterSlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    toast: toastSlice.reducer,
    counter: counterSlice.reducer,
  },
});
