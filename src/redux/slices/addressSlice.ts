import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllProvince = createAsyncThunk('address/getAllProvince', async () => {
    const response = await axios.get('https://sandbox.goship.io/api/v2/cities', {
        headers: {
            Authorization:
                'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjNiMWUwZDlkYzhiYzUxZmJkOTA1MDI4NzQ4MTMxOTJmMmFhYzBhNTk0MzE1M2Y5ZGRiNzdhZDdkZGU5ODg5NDhmZWQ0ODk1OGE3NTNjNGExIn0.eyJhdWQiOiIxMyIsImp0aSI6IjNiMWUwZDlkYzhiYzUxZmJkOTA1MDI4NzQ4MTMxOTJmMmFhYzBhNTk0MzE1M2Y5ZGRiNzdhZDdkZGU5ODg5NDhmZWQ0ODk1OGE3NTNjNGExIiwiaWF0IjoxNzM5NDk5NDIzLCJuYmYiOjE3Mzk0OTk0MjMsImV4cCI6MjA1NTAzMjIyMywic3ViIjoiMzUxNSIsInNjb3BlcyI6W119.fNiGQkOJWhpKjLDNbsWV8kcQ5THdCEQ00xYrv89x9zgxH7hwX7iBZW-4-SmFpSh6ITZEukxp0MsqG7bJlH0-7NmcWB4iKyJJVbtFUb_NnXQyibc5aJYpEicEkZDwnbkW385Oe_M5pXlr7UY-pzMMNRKlyrKyGXG_edvQQxRpecO1QVDqvrOp5LSbi7j0EcabCrUmjbIj0L7hm1xGHHuk_-YW6I3eK7nttkkKMUi7YRbV3T3s8vO6MFOt1dLZ7Zq05QwWsRtSbH7aGnqb1T1hA6v4pF_87phUSjXZ-WKlRHmLaxMYN9fz56jHnqnfIcKUh89JIjfOxRNZFoGbVgeTxWxc4lFqak35Qc5AlValSI13Spzn7wvl8FR_sK3U9wtfMOSSGIRAJmQzLL7SJaGZiuJ7dt9ODuL6EJ4fyu4X-Z2wqw9KG57j_ezbd9jUCzj9wrDj-2A1srPw5ZW--0ohKa-_5OR2WAKinnGGVEHMp8CS5_v4469jPitb_U3cO94xc2EWaXgPDCU7bggIdx_T4xz_RJDlPnt-_27ygZIu5lKbDLfWURdao1xFP_1akOSEfbOMDnXT-hKnRrUk6tiuJmdaqr_gfDl8sxdQQsN2ft12gg4I1_Vo7yQw47givWz3XLlgffFXZY71znxvuFQIxn6aZ-vrlA-ZKzUVmm-dLFE',
        },
    });
    return response.data.data;
});
export const getAllDistrict = createAsyncThunk('address/getAllDistrict', async (id: string) => {
    const response = await axios.get(`https://sandbox.goship.io/api/v2/cities/${id}/districts`, {
        headers: {
            Authorization:
                'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjNiMWUwZDlkYzhiYzUxZmJkOTA1MDI4NzQ4MTMxOTJmMmFhYzBhNTk0MzE1M2Y5ZGRiNzdhZDdkZGU5ODg5NDhmZWQ0ODk1OGE3NTNjNGExIn0.eyJhdWQiOiIxMyIsImp0aSI6IjNiMWUwZDlkYzhiYzUxZmJkOTA1MDI4NzQ4MTMxOTJmMmFhYzBhNTk0MzE1M2Y5ZGRiNzdhZDdkZGU5ODg5NDhmZWQ0ODk1OGE3NTNjNGExIiwiaWF0IjoxNzM5NDk5NDIzLCJuYmYiOjE3Mzk0OTk0MjMsImV4cCI6MjA1NTAzMjIyMywic3ViIjoiMzUxNSIsInNjb3BlcyI6W119.fNiGQkOJWhpKjLDNbsWV8kcQ5THdCEQ00xYrv89x9zgxH7hwX7iBZW-4-SmFpSh6ITZEukxp0MsqG7bJlH0-7NmcWB4iKyJJVbtFUb_NnXQyibc5aJYpEicEkZDwnbkW385Oe_M5pXlr7UY-pzMMNRKlyrKyGXG_edvQQxRpecO1QVDqvrOp5LSbi7j0EcabCrUmjbIj0L7hm1xGHHuk_-YW6I3eK7nttkkKMUi7YRbV3T3s8vO6MFOt1dLZ7Zq05QwWsRtSbH7aGnqb1T1hA6v4pF_87phUSjXZ-WKlRHmLaxMYN9fz56jHnqnfIcKUh89JIjfOxRNZFoGbVgeTxWxc4lFqak35Qc5AlValSI13Spzn7wvl8FR_sK3U9wtfMOSSGIRAJmQzLL7SJaGZiuJ7dt9ODuL6EJ4fyu4X-Z2wqw9KG57j_ezbd9jUCzj9wrDj-2A1srPw5ZW--0ohKa-_5OR2WAKinnGGVEHMp8CS5_v4469jPitb_U3cO94xc2EWaXgPDCU7bggIdx_T4xz_RJDlPnt-_27ygZIu5lKbDLfWURdao1xFP_1akOSEfbOMDnXT-hKnRrUk6tiuJmdaqr_gfDl8sxdQQsN2ft12gg4I1_Vo7yQw47givWz3XLlgffFXZY71znxvuFQIxn6aZ-vrlA-ZKzUVmm-dLFE',
        },
    });
    return response.data.data;
});
export const getAllWard = createAsyncThunk('address/getAllWard', async (id: string) => {
    const response = await axios.get(
        `https://sandbox.goship.io/api/v2/districts/${id}/wards`,

        {
            headers: {
                Authorization:
                    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjNiMWUwZDlkYzhiYzUxZmJkOTA1MDI4NzQ4MTMxOTJmMmFhYzBhNTk0MzE1M2Y5ZGRiNzdhZDdkZGU5ODg5NDhmZWQ0ODk1OGE3NTNjNGExIn0.eyJhdWQiOiIxMyIsImp0aSI6IjNiMWUwZDlkYzhiYzUxZmJkOTA1MDI4NzQ4MTMxOTJmMmFhYzBhNTk0MzE1M2Y5ZGRiNzdhZDdkZGU5ODg5NDhmZWQ0ODk1OGE3NTNjNGExIiwiaWF0IjoxNzM5NDk5NDIzLCJuYmYiOjE3Mzk0OTk0MjMsImV4cCI6MjA1NTAzMjIyMywic3ViIjoiMzUxNSIsInNjb3BlcyI6W119.fNiGQkOJWhpKjLDNbsWV8kcQ5THdCEQ00xYrv89x9zgxH7hwX7iBZW-4-SmFpSh6ITZEukxp0MsqG7bJlH0-7NmcWB4iKyJJVbtFUb_NnXQyibc5aJYpEicEkZDwnbkW385Oe_M5pXlr7UY-pzMMNRKlyrKyGXG_edvQQxRpecO1QVDqvrOp5LSbi7j0EcabCrUmjbIj0L7hm1xGHHuk_-YW6I3eK7nttkkKMUi7YRbV3T3s8vO6MFOt1dLZ7Zq05QwWsRtSbH7aGnqb1T1hA6v4pF_87phUSjXZ-WKlRHmLaxMYN9fz56jHnqnfIcKUh89JIjfOxRNZFoGbVgeTxWxc4lFqak35Qc5AlValSI13Spzn7wvl8FR_sK3U9wtfMOSSGIRAJmQzLL7SJaGZiuJ7dt9ODuL6EJ4fyu4X-Z2wqw9KG57j_ezbd9jUCzj9wrDj-2A1srPw5ZW--0ohKa-_5OR2WAKinnGGVEHMp8CS5_v4469jPitb_U3cO94xc2EWaXgPDCU7bggIdx_T4xz_RJDlPnt-_27ygZIu5lKbDLfWURdao1xFP_1akOSEfbOMDnXT-hKnRrUk6tiuJmdaqr_gfDl8sxdQQsN2ft12gg4I1_Vo7yQw47givWz3XLlgffFXZY71znxvuFQIxn6aZ-vrlA-ZKzUVmm-dLFE',
            },
        },
    );
    return response.data.data;
});
type Province = {
    id: string;
    name: string;
};
type District = {
    id: string;
    name: string;
    city_id: string;
};
type Ward = {
    id: string;
    name: string;
    district_id: string;
};

type ProvinceState = {
    listProvince: Province[];
    listDistrict: District[];
    listWard: Ward[];
    isLoading: boolean;
    isError: boolean;
};
const initialState: ProvinceState = {
    listProvince: [],
    listDistrict: [],
    listWard: [],
    isLoading: false,
    isError: false,
};

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllProvince.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllProvince.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.listProvince = action.payload;
            })
            .addCase(getAllProvince.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            });
        builder
            .addCase(getAllDistrict.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllDistrict.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.listDistrict = action.payload;
            })
            .addCase(getAllDistrict.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            });
        builder
            .addCase(getAllWard.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllWard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.listWard = action.payload;
            })
            .addCase(getAllWard.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            });
    },
});
export default addressSlice.reducer;
