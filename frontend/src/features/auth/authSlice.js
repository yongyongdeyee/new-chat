import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/client.js";

const savedToken = localStorage.getItem("token");
const savedUser = localStorage.getItem("user");

export const login = createAsyncThunk("auth/login", async (formData, thunkApi) => {
  try {
    const response = await api.post("/login", formData);
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "登录失败");
  }
});

export const register = createAsyncThunk("auth/register", async (formData, thunkApi) => {
  try {
    const response = await api.post("/register", formData);
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "注册失败");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: savedToken,
    user: savedUser ? JSON.parse(savedUser) : null,
    loading: false,
    error: "",
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.error = "";
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError(state) {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
