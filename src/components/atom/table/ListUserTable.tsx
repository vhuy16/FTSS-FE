import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../ui/table';
import { DownloadIcon } from '@icons/admin_icon';
import Badge from '../../ui/badge/Badge';
import Button from '@components/ui/button/Button';
import { Box, IconButton, Paper, styled } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { getAllUser } from '@redux/slices/userSlice';
import Loading from '../Loading/Loading';
import UserPopup from '../popup/UserPopup';
import LoadingPage from '../Loading/LoadingPage';

const paginationModel = { page: 0, pageSize: 5 };
const StyledDataGrid = styled(DataGrid)((theme) => ({
    '& .MuiDataGrid-sortIcon': {
        opacity: 1,
        color: 'white',
    },
    '& .MuiDataGrid-menuIconButton': {
        opacity: 1,
        color: 'white',
    },
}));
export default function ListUserTable() {
    const listUser = useAppSelector((state) => state.userProfile.listUser);
    const isLoading = useAppSelector((state) => state.userProfile.isLoading);
    const isLoadingGetAllUser = useAppSelector((state) => state.userProfile.isLoadingGetAllUser);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getAllUser());
    }, []);
    const columns: GridColDef[] = [
        { field: 'stt', headerName: 'STT', width: 50, headerClassName: 'super-app-theme--header' },
        { field: 'username', headerName: 'Tên đăng nhập', width: 150, headerClassName: 'super-app-theme--header' },
        { field: 'fullName', headerName: 'Họ tên', width: 150, headerClassName: 'super-app-theme--header' },
        { field: 'email', headerName: 'Email', width: 250, headerClassName: 'super-app-theme--header' },
        // { field: 'address', headerName: 'Địa chỉ', width: 300, headerClassName: 'super-app-theme--header' },
        { field: 'phoneNumber', headerName: 'SĐT', width: 150, headerClassName: 'super-app-theme--header' },
        {
            field: 'gender',
            headerName: 'Giới tính',
            width: 150,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) =>
                params.row.gender === 'Male' ? (
                    <div className="flex justify-start items-center w-full h-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 text-blue-700"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                ) : (
                    <div className="flex justify-start items-center w-full h-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 text-theme-pink-500"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                ),
        },
        {
            field: 'role',
            headerName: 'Vai trò',
            width: 150,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) =>
                params.row.role === 'Customer'
                    ? 'Khách hàng'
                    : params.row.role === 'Technician'
                    ? 'Nhân viên kĩ thuật'
                    : params.row.role === 'Manager'
                    ? 'Quản lý'
                    : 'Admin',
        },
        {
            field: 'actions',
            headerName: '',
            flex: 1,
            width: 50,
            align: 'right',
            headerAlign: 'right',
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => <UserPopup user={params.row}></UserPopup>,
        },
    ];
    const rowsUser = listUser?.filter((user) => user.role !== 'Admin');
    const rows = rowsUser?.map((user, index) => {
        return { ...user, stt: index + 1, id: user.userId };
    });
    return isLoadingGetAllUser && listUser.length === 0 ? (
        <LoadingPage></LoadingPage>
    ) : (
        <div>
            <div className="flex justify-between mb-4">
                <div className="relative">
                    <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                        <svg
                            className="fill-gray-500 dark:fill-gray-400"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                                fill=""
                            />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                    />
                </div>
                <Button size="ssm" variant="primary" startIcon={<DownloadIcon />}>
                    Tải về
                </Button>
            </div>

            {listUser && (
                <Box
                    sx={{
                        minHeight: 400,
                        width: '100%',
                        overflow: 'visible',
                        position: 'relative' /* Đảm bảo các phần tử con có thể thoát ra */,
                    }}
                >
                    <StyledDataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        sx={{
                            height: '100%',
                            minHeight: 372,
                            '& .MuiDataGrid-root': {
                                overflow: 'visible !important',
                            },
                            '& .MuiDataGrid-virtualScroller': {
                                overflow: 'visible !important',
                            },
                            '& .MuiDataGrid-cell': {
                                overflow: 'visible !important',
                            },
                            '& .super-app-theme--header': {
                                backgroundColor: '#2d3748',
                                color: '#fff',
                                position: 'relative',
                                index: '0',
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 'bold',
                            },
                            '.MuiDataGrid-columnSeparator': {
                                display: 'none',
                            },
                            '& .MuiDataGrid-cell:focus': {
                                outline: 'none', // Bỏ viền xanh khi focus vào ô
                            },
                            '& .MuiDataGrid-cell:focus-within': {
                                outline: 'none', // Bỏ viền khi đang focus trong ô
                            },
                        }}
                        disableRowSelectionOnClick
                        disableColumnMenu
                        disableColumnFilter
                    />
                </Box>
            )}
        </div>
    );
}
