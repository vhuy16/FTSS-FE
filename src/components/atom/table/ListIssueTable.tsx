import React, { useEffect, useState } from 'react';
import { DownloadIcon } from '@icons/admin_icon';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Button from '@components/ui/button/Button';
import { Box, styled } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import Badge from '@components/ui/badge/Badge';
import LoadingPage from '../Loading/LoadingPage';
import { getIssue, Issue } from '@redux/slices/issueSlice';
import AddIssueModal from '../modal/AddIssueModal';
import IssuePopup from '../popup/IssuePopup';
import EditIssueModal from '../modal/EditIssueModal';

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
export default function ListIssueTable() {
    const listIssue = useAppSelector((state) => state.issue.listIssue ?? []);
    const isLoading = useAppSelector((state) => state.issue.isLoading);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [value, setValue] = useState('');
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getIssue());
    }, []);
    useEffect(() => {
        if (value === '') {
            setIssues(listIssue);
        } else {
            setIssues(listIssue.filter((issue) => issue.title.toLowerCase().includes(value)));
        }
    }, [value, listIssue]);
    const columns: GridColDef[] = [
        { field: 'stt', headerName: 'STT', width: 50, headerClassName: 'super-app-theme--header' },
        { field: 'id', headerName: 'Mã vấn đề', width: 350, headerClassName: 'super-app-theme--header' },
        {
            field: 'issue',
            headerName: 'Vấn đề',
            width: 300,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <div className="flex items-center gap-3 h-full">
                    <div className="w-10 h-10 overflow-hidden rounded-[10px]">
                        <img src={params.row.issueImage} alt={params.row.title} />
                    </div>
                    <div>
                        <span
                            className="block font-medium text-gray-800 text-theme-sm dark:text-white/90"
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width: '200px',
                            }}
                            title={params.row.title}
                        >
                            {params.row.title}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {params.row.description}
                        </span>
                    </div>
                </div>
            ),
        },
        { field: 'issueCategoryName', headerName: 'Danh mục', width: 250, headerClassName: 'super-app-theme--header' },

        {
            field: 'createDate',
            headerName: 'Ngày tạo',
            width: 120,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => params.row.createDate.split('T')[0],
        },

        {
            field: 'isDelete',
            headerName: 'Trạng thái',
            width: 200,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Badge size="sm" color={params.row.isDelete === false ? 'success' : 'error'}>
                    {params.row.isDelete === false ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                </Badge>
            ),
        },
        {
            field: 'actions',
            headerName: '',
            flex: 1,
            width: 200,
            headerClassName: 'super-app-theme--header',
            align: 'right',
            headerAlign: 'right',
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <IssuePopup issue={params.row} setIsModalEditOpen={setIsModalEditOpen} />
                </Box>
            ),
        },
    ];
    const rows = issues?.map((issue, index) => {
        return { ...issue, stt: index + 1 };
    });
    return isLoading && listIssue?.length === 0 ? (
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
                        onChange={(e) => {
                            setValue(e.target.value.toLowerCase());
                        }}
                    />
                </div>
                <Button
                    size="ssm"
                    variant="primary"
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                    onClick={() => {
                        setIsModalAddOpen(true);
                    }}
                >
                    Thêm mới
                </Button>
            </div>

            {listIssue && (
                <Box
                    sx={{
                        minHeight: 400,
                        width: '100%',
                        overflow: 'visible',
                        position: 'relative' /* Đảm bảo các phần tử con có thể thoát ra */,
                    }}
                >
                    <StyledDataGrid
                        // autoHeight
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
            <AddIssueModal isModalAddOpen={isModalAddOpen} setIsModalAddOpen={setIsModalAddOpen}></AddIssueModal>
            <EditIssueModal isModalEditOpen={isModalEditOpen} setIsModalEditOpen={setIsModalEditOpen} />
        </div>
    );
}
