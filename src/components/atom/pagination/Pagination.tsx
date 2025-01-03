import * as React from 'react';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';
import { getAllProduct } from '@redux/slices/productSlice';
import { useAppDispatch, useAppSelector } from '@redux/hook';

export default function PaginationControlled() {
    const [page, setPage] = React.useState(1);
    const dispatch = useAppDispatch();
    const total_page = useAppSelector((state) => state.product.data?.totalPages);
    useEffect(() => {
        dispatch(getAllProduct({ page: 1, size: 6 }));
    }, []);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        console.log('page', value);
        dispatch(getAllProduct({ page: value, size: 6 }));
        setPage(value);
    };

    return (
        <Stack spacing={2} style={{ marginTop: '5rem' }}>
            <Pagination count={total_page} page={page} onChange={handleChange} />
        </Stack>
    );
}
