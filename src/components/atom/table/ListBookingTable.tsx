import React, { useEffect, useState } from 'react';
import { DownloadIcon } from '@icons/admin_icon';
import Button from '@components/ui/button/Button';
import { Box, styled } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { currencyFormat } from '@ultils/helper';
import Badge from '@components/ui/badge/Badge';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { Booking, getAllBooking } from '@redux/slices/missionSlide';
import BookingPopup from '../popup/BookingPopup';
import LoadingPage from '../Loading/LoadingPage';
import EditBookingModal from '../modal/EditBookingModal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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
export default function ListBookingTable() {
    const listBooking = useAppSelector((state) => state.mission.listBooking);
    const isLoading = useAppSelector((state) => state.mission.isLoadingGetAllBooking);
    const [selectedRow, setSelectedRow] = useState<any[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [status, setStatus] = useState('All');
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getAllBooking());
    }, []);
    useEffect(() => {
        if (status === 'All' && !searchValue) {
            setBookings(listBooking);
        } else if (status === 'All' && searchValue) {
            setBookings(listBooking.filter((booking) => booking.bookingCode.toLowerCase().includes(searchValue)));
        } else if (status !== 'All' && !searchValue) {
            setBookings(listBooking.filter((booking) => booking.status === status));
        } else {
            setBookings(
                listBooking.filter(
                    (booking) => booking.bookingCode.toLowerCase().includes(searchValue) && booking.status === status,
                ),
            );
        }
    }, [status, searchValue, listBooking]);

    const columns: GridColDef[] = [
        { field: 'stt', headerName: 'STT', width: 50, headerClassName: 'super-app-theme--header' },

        {
            field: 'id',
            headerName: 'Mã đơn ',
            width: 150,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <span onClick={(event) => event.stopPropagation()} style={{ cursor: 'pointer' }}>
                    {params.row.bookingCode}
                </span>
            ),
        },

        {
            field: 'fullName',
            headerName: 'Tên khách hàng',
            width: 150,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'phoneNumber',
            headerName: 'Số điện thoại',
            width: 150,
            headerClassName: 'super-app-theme--header',
        },

        {
            field: 'totalPrice',
            headerName: 'Giá tiền',
            width: 120,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => currencyFormat(params.row.totalPrice),
        },
        {
            field: 'scheduleDate',
            headerName: 'Thời gian bảo trì',
            width: 200,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                const dateTime = params.row.scheduleDate?.split('T');
                const date = dateTime?.[0];
                const time = dateTime?.[1]?.split(':').slice(0, 2).join(':'); // Chỉ lấy giờ và phút
                return `${date} lúc ${time}`;
            },
        },
        {
            field: 'payment',
            headerName: 'Trạng thái thanh toán',
            width: 200,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Badge
                    size="sm"
                    color={
                        params.row.payment?.paymentStatus === 'Processing'
                            ? 'warning'
                            : params.row.payment?.paymentStatus === 'Completed'
                            ? 'success'
                            : params.row.payment?.paymentStatus === 'Cancelled'
                            ? 'error'
                            : params.row.payment?.paymentStatus === 'Refunding'
                            ? 'light'
                            : params.row.payment?.paymentStatus === 'Refunded'
                            ? 'dark'
                            : 'primary'
                    }
                >
                    {params.row.payment?.paymentStatus === 'Processing'
                        ? 'Đang chờ thanh toán'
                        : params.row.payment?.paymentStatus === 'Completed'
                        ? 'Đã thanh toán'
                        : params.row.payment?.paymentStatus === 'Cancelled'
                        ? 'Đã hủy'
                        : params.row.payment?.paymentStatus === 'Refunding'
                        ? 'Đang hoàn tiền'
                        : params.row.payment?.paymentStatus === 'Refunded'
                        ? 'Đã hoàn tiền'
                        : 'primary'}
                </Badge>
            ),
        },
        {
            field: 'status',
            headerName: 'Trạng thái bảo trì',
            width: 200,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Badge
                    size="sm"
                    color={
                        params.row.status === 'CANCELLED'
                            ? 'error'
                            : params.row.status === 'NOTASSIGN'
                            ? 'light'
                            : params.row.status === 'ASSIGNED'
                            ? 'dark'
                            : params.row.status === 'DONE'
                            ? 'done'
                            : params.row.status === 'COMPLETED'
                            ? 'success'
                            : params.row.status === 'NOTDONE'
                            ? 'notDone'
                            : params.row.status === 'MISSED'
                            ? 'primary'
                            : params.row.status === 'PROCESSING'
                            ? 'warning'
                            : params.row.status === 'NOTSTARTED'
                            ? 'info'
                            : 'error'
                    }
                >
                    {params.row.status === 'CANCELLED'
                        ? 'Đã hủy'
                        : params.row.status === 'NOTASSIGN'
                        ? 'Chưa phân công'
                        : params.row.status === 'ASSIGNED'
                        ? 'Đã phân công'
                        : params.row.status === 'COMPLETED'
                        ? 'Hoàn tất'
                        : params.row.status === 'DONE'
                        ? 'Xong công việc'
                        : params.row.status === 'NOTDONE'
                        ? 'Chưa xong'
                        : params.row.status === 'MISSED'
                        ? 'Không thực hiện được'
                        : params.row.status === 'PROCESSING'
                        ? 'Đang tiến hành'
                        : params.row.status === 'NOTSTARTED'
                        ? 'Chưa tiến hành'
                        : 'error'}
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
                    <BookingPopup booking={params.row} setIsModalEditOpen={setIsModalEditOpen} />
                </Box>
            ),
        },
    ];
    const navigate = useNavigate();
    const handleCellDoubleClick = (params: GridCellParams) => {
        if (params.field === 'id') {
            navigate(`/listBooking/${params.row.id}`);
        }
    };
    const rows = bookings?.map((booking, index) => {
        return { ...booking, stt: index + 1 };
    });

    return isLoading && listBooking.length === 0 ? (
        <LoadingPage></LoadingPage>
    ) : (
        <div>
            <div className="flex justify-between mb-4">
                <div className="relative flex items-center">
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
                        onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
                        className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                    />
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small-label">Trạng thái</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            label="Trạng thái"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <MenuItem value={'All'}>Tất cả</MenuItem>
                            <MenuItem value={'NOTASSIGN'}>Chưa phân công</MenuItem>
                            <MenuItem value={'NOTSTARTED'}>Chưa tiến hành</MenuItem>
                            <MenuItem value={'PROCESSING'}>Đang tiến hành</MenuItem>
                            <MenuItem value={'ASSIGNED'}>Đã phân công</MenuItem>
                            <MenuItem value={'DONE'}>Xong công việc</MenuItem>
                            <MenuItem value={'NOTDONE'}>Chưa xong</MenuItem>
                            <MenuItem value={'MISSED'}>Không thực hiện được</MenuItem>
                            <MenuItem value={'COMPLETED'}>Hoàn tất</MenuItem>
                            <MenuItem value={'CANCELLED'}>Đã hủy</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <Button size="ssm" variant="primary" startIcon={<DownloadIcon />}>
                    <CSVLink data={selectedRow} filename="booking">
                        Tải về
                    </CSVLink>
                </Button>
            </div>

            {listBooking && (
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
                            const bookings = listBooking.filter((booking) => row.includes(booking.id as string));
                            const dataCSV = bookings.map((booking) => ({
                                'Mã đơn ': booking.id,
                                'Ngày bảo trì': booking.scheduleDate,
                                'Tên khách hàng': booking.fullName,
                                'Số điện thoại': booking.phoneNumber,
                                'Địa chỉ bảo trì': booking.address,
                                'Trạng thái': booking.status,
                                'Trạng thái phân công': booking.isAssigned,
                                'Tổng tiền': booking.totalPrice,
                            }));
                            setSelectedRow(dataCSV);
                        }}
                    />
                </Box>
            )}
            <EditBookingModal isModalEditOpen={isModalEditOpen} setIsModalEditOpen={setIsModalEditOpen} />
        </div>
    );
}
