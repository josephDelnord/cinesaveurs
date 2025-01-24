import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IUser } from '../@types/User';

interface UserState {
	user: IUser | null;
	loading: boolean;
	error: string | null;
}
const initialState: UserState = {
	user: null,
	loading: false,
	error: null,
};

const userInfosSlice = createSlice({
	name: 'userInfos',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<IUser | null>) => {
			state.user = action.payload;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const { setUser, setLoading, setError } = userInfosSlice.actions;
export default userInfosSlice.reducer;