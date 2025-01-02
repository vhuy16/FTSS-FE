// src/store/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SearchType = {
    searchValue: string;
};
const initialState: SearchType = {
    searchValue: '',
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        changeSearchValue: (state, action: PayloadAction<string>) => {
            state.searchValue = action.payload;
        },
    },
});

export const { changeSearchValue } = searchSlice.actions;
export default searchSlice.reducer;
