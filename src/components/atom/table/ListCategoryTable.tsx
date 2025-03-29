import React, { useEffect, useState } from 'react';
import { DownloadIcon } from '@icons/admin_icon';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Button from '@components/ui/button/Button';
import { Box, styled } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { getAllUser } from '@redux/slices/userSlice';
import UserPopup from '../popup/UserPopup';
import { getAllOrder } from '@redux/slices/orderSlice';
import { currencyFormat } from '@ultils/helper';
import Badge from '@components/ui/badge/Badge';
import OrderPopup from '../popup/OrderPopup';
import { getAllProductForAdmin, getProductByNameForAdmin } from '@redux/slices/productSlice';
import ProductPopup from '../popup/ProductPopup';
import AddProductModal from '../modal/AddProductModal';
import { getAllCategory, SubCategory } from '@redux/slices/categorySlice';
import AddCategoryModal from '../modal/AddCategoryModal';
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
export default function ListCategoryTable() {
    const listCategory = useAppSelector((state) => state.category.categories);
    const isLoading = useAppSelector((state) => state.category.isLoadingGetAllCategory);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getAllCategory());
    }, []);
    const columns: GridColDef[] = [
        { field: 'stt', headerName: 'STT', width: 50, headerClassName: 'super-app-theme--header' },
        { field: 'id', headerName: 'Mã danh mục', width: 350, headerClassName: 'super-app-theme--header' },
        {
            field: 'image',
            headerName: 'Ảnh',
            width: 150,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <div className="flex items-center gap-3 h-full">
                    <div className="w-10 h-10 overflow-hidden rounded-[10px]">
                        <img src={params.row.linkImage} alt={params.row.categoryName} />
                    </div>
                </div>
            ),
        },
        { field: 'categoryName', headerName: 'Tên danh mục', width: 150, headerClassName: 'super-app-theme--header' },
        { field: 'description', headerName: 'Mô tả', width: 150, headerClassName: 'super-app-theme--header' },
        {
            field: 'subCategories',
            headerName: 'Danh mục phụ',
            width: 250,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <span>{params.row.subCategories.map((sub: SubCategory) => sub.subCategoryName).join(', ')}</span>
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
                    {/* <ProductPopup product={params.row} /> */}
                </Box>
            ),
        },
    ];
    const rows = listCategory?.map((category, index) => {
        return { ...category, stt: index + 1 };
    });
    return isLoading && listCategory.length === 0 ? (
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

            {listCategory && (
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
            <AddCategoryModal isModalAddOpen={isModalAddOpen} setIsModalAddOpen={setIsModalAddOpen}></AddCategoryModal>
        </div>
    );
}
