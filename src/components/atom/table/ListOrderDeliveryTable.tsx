import React, { useEffect, useState } from 'react';
import { DownloadIcon } from '@icons/admin_icon';
import Button from '@components/ui/button/Button';
import { Box, styled } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { getAllUser } from '@redux/slices/userSlice';
import UserPopup from '../popup/UserPopup';
import { getAllOrder } from '@redux/slices/orderSlice';
import { currencyFormat } from '@ultils/helper';
import Badge from '@components/ui/badge/Badge';
import OrderPopup from '../popup/OrderPopup';
import { useNavigate } from 'react-router-dom';
import { Order } from '@redux/slices/orderListSlice';
import { CSVLink } from 'react-csv';
import OrderDeliveryPopup from '../popup/OrderDeliveryPopup';

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
export default function ListOrderDeliveryTable() {
    const orders = useAppSelector((state) => state.order.listOrder);
    const [selectedRow, setSelectedRow] = useState<any[]>([]);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getAllOrder());
    }, []);
    const listOrder = orders.filter(
        (order) =>
            order.isAssigned === false &&
            order.status === 'PROCESSED' &&
            order.setupPackage != null &&
            order.address.split(', ').pop() === 'Hồ Chí Minh',
    );
    const columns: GridColDef[] = [
        { field: 'stt', headerName: 'STT', width: 50, headerClassName: 'super-app-theme--header' },

        {
            field: 'id',
            headerName: 'Mã đơn hàng',
            width: 150,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <span onClick={(event) => event.stopPropagation()} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    {params.row.oderCode}
                </span>
            ),
        },
        {
            field: 'customerName',
            headerName: 'Tên khách hàng',
            width: 150,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => params.row.userResponse.name,
        },
        {
            field: 'createDate',
            headerName: 'Ngày tạo',
            width: 120,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => params.row.createDate.split('T')[0],
        },
        {
            field: 'paymentStatus',
            headerName: 'Trạng thái thanh toán',
            width: 180,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Badge
                    size="sm"
                    color={
                        params.row.payment.paymentStatus === 'Processing'
                            ? 'warning'
                            : params.row.payment.paymentStatus === 'Completed'
                            ? 'success'
                            : params.row.payment.paymentStatus === 'Cancelled'
                            ? 'error'
                            : 'warning'
                    }
                >
                    {params.row.payment.paymentStatus === 'Processing'
                        ? 'Đang chờ thanh toán'
                        : params.row.payment.paymentStatus === 'Completed'
                        ? 'Đã thanh toán'
                        : params.row.payment.paymentStatus === 'Cancelled'
                        ? 'Đã hủy'
                        : 'Đang hoàn trả'}
                </Badge>
            ),
        },
        {
            field: 'totalPrice',
            headerName: 'Tổng tiền',
            width: 100,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => currencyFormat(params.row.totalPrice),
        },
        {
            field: 'paymentMethod',
            headerName: 'Phương thức thanh toán',
            width: 200,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => params.row.payment.paymentMethod,
        },
        {
            field: 'status',
            headerName: 'Trạng thái đơn hàng',
            width: 200,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Badge
                    size="sm"
                    color={
                        params.row.status === 'PENDING_DELIVERY'
                            ? 'primary'
                            : params.row.status === 'PROCESSING'
                            ? 'warning'
                            : params.row.status === 'PROCESSED'
                            ? 'info'
                            : params.row.status === 'CANCELLED'
                            ? 'error'
                            : params.row.status === 'COMPLETED'
                            ? 'success'
                            : params.row.status === 'RETURNED'
                            ? 'light'
                            : 'dark'
                    }
                >
                    {params.row.status === 'PENDING_DELIVERY'
                        ? 'Đang giao'
                        : params.row.status === 'PROCESSING'
                        ? 'Đang xử lý'
                        : params.row.status === 'PROCESSED'
                        ? 'Đã xử lý'
                        : params.row.status === 'CANCELLED'
                        ? 'Đã hủy'
                        : params.row.status === 'COMPLETED'
                        ? 'Hoàn tất'
                        : params.row.status === 'RETURNED'
                        ? 'Hoàn trả'
                        : 'Hoàn tiền'}
                </Badge>
            ),
        },
        {
            field: 'isAssigned',
            headerName: 'Trạng thái phân công',
            width: 200,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Badge size="sm" color={params.row.isAssigned === true ? 'success' : 'warning'}>
                    {params.row.isAssigned === true ? 'Đã phân công ' : 'Chưa phân công'}
                </Badge>
            ),
        },
        {
            field: 'actions',
            headerName: '',
            flex: 1,
            width: 80,
            headerClassName: 'super-app-theme--header',
            align: 'right',
            headerAlign: 'right',
            sortable: false,
            renderCell: (params) => (
                <Box
                    sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
                    onClick={(event) => event.stopPropagation()}
                >
                    <OrderDeliveryPopup order={params.row} />
                </Box>
            ),
        },
    ];
    const navigate = useNavigate();
    const handleCellDoubleClick = (params: GridCellParams) => {
        if (params.field === 'id') {
            navigate(`/listOrder/${params.row.id}`);
        }
    };
    const rows = listOrder?.map((order, index) => {
        return { ...order, stt: index + 1 };
    });

    return (
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
                    <CSVLink data={selectedRow} filename="order">
                        Tải về
                    </CSVLink>
                </Button>
            </div>

            {listOrder && (
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
                        onCellDoubleClick={handleCellDoubleClick}
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
                            '& .MuiDataGrid-columnHeaderTitleContainer': {
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
                        // disableRowSelectionOnClick
                        disableColumnMenu
                        disableColumnFilter
                        checkboxSelection
                        onRowSelectionModelChange={(row) => {
                            const orders = listOrder.filter((order) => row.includes(order.id as string));
                            const dataCSV = orders.map((order) => ({
                                'Mã đơn hàng': order.oderCode,
                                'Ngày tạo': order.createDate,
                                'Tên khách hàng': order.userResponse.name,
                                'Số điện thoại': order.userResponse.phoneNumber,
                                'Trạng thái đơn hàng': order.status,
                                'Trạng thái thanh toán': order.payment.paymentStatus,
                                'Phương thức thanh toán': order.payment.paymentMethod,
                                'Địa chỉ giao hàng': order.address,
                                'Tổng tiền': order.totalPrice,
                            }));
                            setSelectedRow(dataCSV);
                        }}
                    />
                </Box>
            )}
        </div>
    );
}
