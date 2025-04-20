import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { addCategory, getAllCategory, getAllSubCategoryByCateName } from '@redux/slices/categorySlice';
import { addProducts, getAllCategoryWithProduct, getAllProductForAdmin } from '@redux/slices/productSlice';
import { toast } from 'react-toastify';
import Loading from '../Loading/Loading';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import 'flowbite';
import { createSetupPackage } from '@redux/slices/setupSlice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getIssueCategorySlice } from '@redux/slices/issueCategorySlice';
import { addIssue } from '@redux/slices/issueSlice';

type ModalAddProps = {
    isModalAddOpen: boolean;
    setIsModalAddOpen: (isOpen: boolean) => void;
};
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
};

export default function AddIssueModal({ isModalAddOpen, setIsModalAddOpen }: ModalAddProps) {
    const dispatch = useAppDispatch();
    const isLoadingAdd = useAppSelector((state) => state.issue.isLoadingAdd);
    const listIssueCategory = useAppSelector((state) => state.issueCategory.listIssueCategory);
    const listProduct = useAppSelector((state) => state.product.listProductForAdmin);
    const isLoadingIssueCategory = useAppSelector((state) => state.issueCategory.isLoading);
    const isLoadingGetProduct = useAppSelector((state) => state.product.isLoadingGetAllProductForAdmin);
    const [data, setData] = useState<{
        title: string;
        issueCategoryId: string;
        description: string;
        solutionName: string;
        productIds: string[];
        desSolution: string;
        ImageFile: File | null;
    }>({
        title: '',
        issueCategoryId: '',
        description: '',
        solutionName: '',
        productIds: [],
        desSolution: '',
        ImageFile: null,
    });
    const [productValue, setProductValue] = useState<string[]>([]);
    useEffect(() => {
        dispatch(getIssueCategorySlice());
        dispatch(getAllProductForAdmin());
    }, []);
    useEffect(() => {
        if (!isModalAddOpen) {
            setData({
                title: '',
                issueCategoryId: '',
                description: '',
                solutionName: '',
                productIds: [],
                desSolution: '',
                ImageFile: null,
            });
            setProductValue([]);
        }
    }, [isModalAddOpen]);

    const handleChange = (event: SelectChangeEvent<typeof productValue>) => {
        const {
            target: { value },
        } = event;
        setProductValue(typeof value === 'string' ? value.split(',') : value);
    };

    const handleSubmit = async () => {
        data.productIds = productValue.map((p) => JSON.parse(p).id);
        if (
            data.title &&
            data.description &&
            data.ImageFile &&
            data.issueCategoryId &&
            data.solutionName &&
            data.desSolution &&
            data.productIds.length > 0
        ) {
            const formData = new FormData();
            const solutionsJson = JSON.stringify({
                SolutionName: data.solutionName,
                Description: data.desSolution,
                ProductIds: data.productIds,
            });
            formData.append('Title', data.title);
            formData.append('Description', data.description);
            formData.append('IssueCategoryId', data.issueCategoryId);
            formData.append('SolutionsJson', solutionsJson);
            formData.append('IssueImage', data.ImageFile);
            try {
                const res = await dispatch(addIssue(formData)).unwrap();
                if (res.status == 201 || res.status == 200) {
                    setIsModalAddOpen(false);
                    toast.success('Thêm danh mục thành công');
                }
            } catch (error) {
                toast.error(error as string);
            }
        } else {
            toast.error('Vui lòng nhập đủ thông tin');
        }
    };
    return (
        <>
            {/* Modal */}
            <div>
                <Modal
                    open={isModalAddOpen}
                    onClose={() => {
                        setIsModalAddOpen(false);
                    }}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div className="relative overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                            <div className="relative p-4 w-full h-full md:h-auto">
                                <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Thêm danh mục
                                        </h3>
                                        <button
                                            type="button"
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                            onClick={() => {
                                                setIsModalAddOpen(false);
                                            }}
                                        >
                                            <svg
                                                aria-hidden="true"
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clip-rule="evenodd"
                                                ></path>
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <div>
                                        <div className="grid gap-4 mb-4 sm:grid-cols-6">
                                            <div className="sm:col-span-3">
                                                <label
                                                    htmlFor="description"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Chọn ảnh
                                                </label>
                                                <input
                                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                                    type="file"
                                                    onChange={(e) => {
                                                        if (e.target.files) {
                                                            setData({ ...data, ImageFile: e.target.files[0] });
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="sm:col-span-3">
                                                <label
                                                    htmlFor="name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Tên vấn đề
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Nhập tên vấn đề"
                                                    required={true}
                                                    value={data.title}
                                                    onChange={(e) => setData({ ...data, title: e.target.value })}
                                                />
                                            </div>
                                            <div className="sm:col-span-6">
                                                <label
                                                    htmlFor="price"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Danh mục vấn đề
                                                </label>
                                                {isLoadingIssueCategory ? (
                                                    <Loading></Loading>
                                                ) : (
                                                    <select
                                                        id="category"
                                                        onChange={(e) => {
                                                            setData({
                                                                ...data,
                                                                issueCategoryId: JSON.parse(e.target.value).id,
                                                            });
                                                        }}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    >
                                                        <option
                                                            selected={true}
                                                            value={JSON.stringify({
                                                                name: '1',
                                                                id: '1',
                                                            })}
                                                        >
                                                            Chọn danh mục
                                                        </option>

                                                        {listIssueCategory ? (
                                                            listIssueCategory
                                                                .filter((cate) => cate.isDelete === false)
                                                                .map((issueCategory) => (
                                                                    <option
                                                                        value={JSON.stringify({
                                                                            name: issueCategory.issueCategoryName,
                                                                            id: issueCategory.id,
                                                                        })}
                                                                    >
                                                                        {issueCategory.issueCategoryName}
                                                                    </option>
                                                                ))
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </select>
                                                )}
                                            </div>
                                            <div className="sm:col-span-6">
                                                <label
                                                    htmlFor="description"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Mô tả
                                                </label>
                                                <textarea
                                                    id="description"
                                                    rows={4}
                                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Viết mô tả vấn đề tại đây"
                                                    required={true}
                                                    value={data.description}
                                                    onChange={(e) => setData({ ...data, description: e.target.value })}
                                                ></textarea>
                                            </div>
                                            <div className="rounded-t border-b dark:border-gray-600 sm:col-span-6"></div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Giải pháp
                                            </h3>
                                            <div className="sm:col-span-6">
                                                <label
                                                    htmlFor="name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Tên giải pháp
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Nhập tên giải pháp"
                                                    required={true}
                                                    value={data.solutionName}
                                                    onChange={(e) => setData({ ...data, solutionName: e.target.value })}
                                                />
                                            </div>
                                            <div className="sm:col-span-6">
                                                <label
                                                    htmlFor="description"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Sản phẩm đề xuất
                                                </label>

                                                {isLoadingGetProduct ? (
                                                    <Loading></Loading>
                                                ) : (
                                                    <FormControl sx={{ width: '100%', marginTop: '1rem' }}>
                                                        <InputLabel id="demo-multiple-checkbox-label">
                                                            Chọn sản phẩm
                                                        </InputLabel>
                                                        <Select
                                                            labelId="demo-multiple-checkbox-label"
                                                            id="demo-multiple-checkbox"
                                                            multiple
                                                            value={productValue}
                                                            onChange={handleChange}
                                                            input={<OutlinedInput label="Chọn sản phẩm" />}
                                                            renderValue={() => {
                                                                return productValue
                                                                    .map((product) => JSON.parse(product).name)
                                                                    .join(', ');
                                                            }}
                                                            MenuProps={MenuProps}
                                                        >
                                                            {listProduct.map((product) => (
                                                                <MenuItem
                                                                    key={product.id}
                                                                    value={JSON.stringify({
                                                                        name: product.productName,
                                                                        id: product.id,
                                                                    })}
                                                                >
                                                                    <Checkbox
                                                                        checked={productValue.some(
                                                                            (p) => JSON.parse(p).id === product.id,
                                                                        )}
                                                                    />
                                                                    <div className="flex items-center gap-3 h-full w-full">
                                                                        <div className="w-10 h-10 overflow-hidden rounded-[10px]">
                                                                            <img
                                                                                src={product.images[0]}
                                                                                alt={product.productName}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                                                {product.productName}
                                                                            </span>
                                                                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                                                {product.subCategoryName}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            </div>

                                            <div className="sm:col-span-6">
                                                <label
                                                    htmlFor="description"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Mô tả
                                                </label>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={data.desSolution}
                                                    onChange={(value) => setData({ ...data, desSolution: value })}
                                                    style={{ maxHeight: '10rem', overflowY: 'auto' }} // ~ 4 dòng
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-center">
                                            <button
                                                onClick={handleSubmit}
                                                className="text-white inline-flex items-center bg-blackGreen  hover:bg-blackGreenHover focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mt-3 mr-3"
                                            >
                                                {isLoadingAdd ? <Loading></Loading> : 'Thêm'}
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setIsModalAddOpen(false);
                                                }}
                                                className="text-red-600 inline-flex items-center mt-3 font-bold text-sm underline"
                                            >
                                                <svg
                                                    className="mr-1 -ml-1 w-6 h-6"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                ></svg>
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Modal>
            </div>
        </>
    );
}
