import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { getAllCategory, getAllSubCategoryByCateName } from '@redux/slices/categorySlice';
import { addProducts, editProducts, Product } from '@redux/slices/productSlice';
import { toast } from 'react-toastify';
import Loading from '../Loading/Loading';
import { Checkbox, FormControlLabel } from '@mui/material';
import { tab } from '@testing-library/user-event/dist/tab';
type ModalEditProps = {
    isModalEditOpen: boolean;
    setIsModalEditOpen: (isOpen: boolean) => void;
};
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
};
export default function EditProductModal({ isModalEditOpen, setIsModalEditOpen }: ModalEditProps) {
    const dispatch = useAppDispatch();
    const product = useAppSelector((state) => state.product.selectedProduct);
    const listCate = useAppSelector((state) => state.category.categories);
    const listSubCate = useAppSelector((state) => state.category.subCates);
    const isLoading = useAppSelector((state) => state.product.isLoadingEdit);
    const [checked, setChecked] = useState(false);
    const [cateName, setCateName] = useState(product.categoryName);
    const [subCate, setSubCate] = useState({ name: '', id: '' });
    const [data, setData] = useState<{
        productName: string;
        description: string;
        cateName: string;
        subCateName: string;
        price: number;
        quantity: number;
        subCategoryId: string;
        size: string;
        power: number;
        images: File[];
    }>({
        productName: product.productName,
        description: product.description,
        cateName: product.categoryName,
        subCateName: product.subCategoryName,
        price: product.price,
        quantity: product.quantity,
        subCategoryId: '',
        size: product.size,
        power: product.power,
        images: [],
    });

    useEffect(() => {
        if (isModalEditOpen) {
            dispatch(getAllCategory());
        }
    }, [isModalEditOpen]);
    useEffect(() => {
        if (isModalEditOpen && checked) {
            dispatch(getAllSubCategoryByCateName(cateName));
        }
    }, [cateName, checked]);
    useEffect(() => {
        if (isModalEditOpen && product.id) {
            setData({
                productName: product.productName,
                description: product.description,
                cateName: product.categoryName,
                subCateName: product.subCategoryName,
                price: product.price,
                quantity: product.quantity,
                size: product.size,
                power: product.power,
                subCategoryId: '',
                images: [],
            });
            setCateName(product.categoryName);
        }
    }, [isModalEditOpen]);
    const handleSubmit = async () => {
        if (data.productName && data.price && data.quantity && data.description) {
            const formData = new FormData();
            formData.append('ProductName', data.productName);
            formData.append('Description', data.description);
            formData.append('Status', '');
            if (data.price == 0) {
                formData.append('Price', '');
            } else {
                formData.append('Price', data.price.toString());
            }
            if (data.quantity == 0) {
                formData.append('Quantity', '');
            } else {
                formData.append('Quantity', data.quantity.toString());
            }

            if (data.subCategoryId == '1') {
                formData.append('SubCategoryId', '');
            } else {
                formData.append('SubCategoryId', data.subCategoryId);
            }
            formData.append('Size', '3x4x5');

            if (data.images.length == 0) {
                formData.append('ImageLink', '');
            } else {
                for (let i = 0; i < data.images.length; i++) {
                    formData.append('ImageLink', data.images[i]);
                }
            }
            try {
                const res = await dispatch(
                    editProducts({
                        formData: formData,
                        id: product.id,
                    }),
                ).unwrap();
                if (res?.status == '200') {
                    setIsModalEditOpen(false);
                    setChecked(false);
                    setData({
                        productName: '',
                        description: '',
                        cateName: '',
                        subCateName: '',
                        price: 0,
                        quantity: 0,
                        subCategoryId: '',
                        size: '',
                        power: 0,
                        images: [],
                    });
                    toast.success('Cập nhật sản phẩm thành công');
                } else {
                    toast.error('Cập nhật sản phẩm thất bại');
                }
            } catch (error) {
                toast.error(error as string);
            }
        } else {
            toast.error('Vui lòng điền đầy đủ thông tin');
        }
    };

    const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    return (
        <>
            {/* Modal */}
            <div>
                <Modal
                    open={isModalEditOpen}
                    onClose={() => {
                        setIsModalEditOpen(false);
                        setChecked(false);
                        setData({
                            productName: '',
                            description: '',
                            cateName: '',
                            subCateName: '',
                            price: 0,
                            quantity: 0,
                            subCategoryId: '',
                            size: '',
                            power: 0,
                            images: [],
                        });
                    }}
                    disableEnforceFocus
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div className="relative overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                            <div className="relative p-4 w-full h-full md:h-auto">
                                <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Cập nhật sản phẩm
                                        </h3>
                                        <button
                                            type="button"
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                            onClick={() => {
                                                setIsModalEditOpen(false);
                                                setChecked(false);
                                                setData({
                                                    productName: '',
                                                    description: '',
                                                    cateName: '',
                                                    subCateName: '',
                                                    price: 0,
                                                    quantity: 0,
                                                    subCategoryId: '',
                                                    size: '',
                                                    power: 0,
                                                    images: [],
                                                });
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
                                            <div className="sm:col-span-2">
                                                <label
                                                    htmlFor="name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Tên sản phẩm
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Nhập tên sản phẩm"
                                                    value={data.productName}
                                                    required={true}
                                                    onChange={(e) => setData({ ...data, productName: e.target.value })}
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label
                                                    htmlFor="brand"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Giá tiền
                                                </label>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    id="brand"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Nhập giá tiền"
                                                    value={JSON.stringify(data.price)}
                                                    required={true}
                                                    onChange={(e) =>
                                                        setData({ ...data, price: parseInt(e.target.value) })
                                                    }
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label
                                                    htmlFor="brand"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Số lượng
                                                </label>
                                                <input
                                                    type="number"
                                                    name="quantity"
                                                    id="brand"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Nhập số lượng"
                                                    value={JSON.stringify(data.quantity)}
                                                    required={true}
                                                    onChange={(e) =>
                                                        setData({ ...data, quantity: parseInt(e.target.value) })
                                                    }
                                                />
                                            </div>
                                            <div className="sm:col-span-6">
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox checked={checked} onChange={handleChangeCheckBox} />
                                                    }
                                                    label="Chọn lại danh mục cho sản phẩm"
                                                />
                                            </div>

                                            {checked && (
                                                <div className="sm:col-span-3">
                                                    <label
                                                        htmlFor="price"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Danh mục
                                                    </label>
                                                    <select
                                                        id="category"
                                                        onChange={(e) => {
                                                            setCateName(e.target.value);
                                                            setSubCate({ name: '', id: '' });
                                                        }}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    >
                                                        {listCate ? (
                                                            listCate.map((cate) => (
                                                                <option
                                                                    key={cate.id}
                                                                    value={cate.categoryName}
                                                                    selected={
                                                                        cate.categoryName === product.categoryName
                                                                    }
                                                                >
                                                                    {cate.categoryName}
                                                                </option>
                                                            ))
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </select>
                                                </div>
                                            )}
                                            {checked && (
                                                <div className="sm:col-span-3">
                                                    <label
                                                        htmlFor="category"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Danh mục phụ
                                                    </label>
                                                    <select
                                                        id="category"
                                                        // value={JSON.stringify(subCate)}
                                                        onChange={(e) => {
                                                            setSubCate(JSON.parse(e.target.value));
                                                            setData({
                                                                ...data,
                                                                subCategoryId: JSON.parse(e.target.value).id,
                                                            });
                                                        }}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    >
                                                        {listSubCate ? (
                                                            listSubCate.map((cate) => (
                                                                <option
                                                                    key={cate.id}
                                                                    value={JSON.stringify({
                                                                        name: cate.categoryName,
                                                                        id: cate.id,
                                                                    })}
                                                                    selected={
                                                                        cate.subCategoryName === product.subCategoryName
                                                                    }
                                                                >
                                                                    {cate.subCategoryName}
                                                                </option>
                                                            ))
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </select>
                                                </div>
                                            )}
                                            {(cateName === 'Lọc' || cateName === 'Đèn') && (
                                                <div className="sm:col-span-6">
                                                    <label
                                                        htmlFor="brand"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Công suất {cateName === 'Lọc' ? '(L/h)' : '(W)'}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="power"
                                                        id="brand"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="Nhập công suất"
                                                        required={true}
                                                        value={data.power ?? 0}
                                                        onChange={(e) =>
                                                            setData({ ...data, power: parseInt(e.target.value) })
                                                        }
                                                    />
                                                </div>
                                            )}
                                            {(cateName === 'Bể' || cateName === 'Layout') && (
                                                <div className="sm:col-span-6">
                                                    <label
                                                        htmlFor="name"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Kích thước
                                                    </label>
                                                    <select
                                                        id="size"
                                                        value={data.size}
                                                        onChange={(e) => setData({ ...data, size: e.target.value })}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    >
                                                        <option value="30x20x20" selected={data.size === '30x20x20'}>
                                                            30x20x20
                                                        </option>
                                                        <option value="40x30x30" selected={data.size === '40x30x30'}>
                                                            40x30x30
                                                        </option>
                                                        <option value="40x40x40" selected={data.size === '40x40x40'}>
                                                            40x40x40
                                                        </option>
                                                        <option value="60x40x40" selected={data.size === '60x40x40'}>
                                                            60x40x40
                                                        </option>
                                                        <option value="80x40x50" selected={data.size === '80x40x50'}>
                                                            80x40x50
                                                        </option>
                                                        <option value="120x50x50" selected={data.size === '120x50x50'}>
                                                            120x50x50
                                                        </option>
                                                    </select>
                                                </div>
                                            )}
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
                                                    placeholder="Nhập mô tả"
                                                    value={data.description}
                                                    required={true}
                                                    onChange={(e) => setData({ ...data, description: e.target.value })}
                                                ></textarea>
                                            </div>
                                            <div className="sm:col-span-6">
                                                <label
                                                    htmlFor="description"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Chọn ảnh
                                                </label>
                                                <input
                                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                                    id="multiple_files"
                                                    type="file"
                                                    multiple
                                                    onChange={(e) => {
                                                        if (e.target.files) {
                                                            setData({ ...data, images: Array.from(e.target.files) });
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-center">
                                            <button
                                                onClick={handleSubmit}
                                                className="text-white inline-flex items-center bg-blackGreen  hover:bg-blackGreenHover focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mt-3 mr-3"
                                            >
                                                {isLoading ? <Loading></Loading> : 'Lưu'}
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setIsModalEditOpen(false);
                                                    setChecked(false);
                                                    setData({
                                                        productName: '',
                                                        description: '',
                                                        cateName: '',
                                                        subCateName: '',
                                                        price: 0,
                                                        quantity: 0,
                                                        subCategoryId: '',
                                                        size: '',
                                                        power: 0,
                                                        images: [],
                                                    });
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
