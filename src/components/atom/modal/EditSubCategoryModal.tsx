import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import {
    addCategory,
    addSubCategory,
    editSubCategory,
    getAllCategory,
    getAllSubCategoryByCateName,
} from '@redux/slices/categorySlice';
import { toast } from 'react-toastify';
import Loading from '../Loading/Loading';

import 'flowbite';
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
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
export default function EditSubCategoryModal({ isModalEditOpen, setIsModalEditOpen }: ModalEditProps) {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector((state) => state.category.isLoadingEditSubCategory);
    const listCate = useAppSelector((state) => state.category.categories);
    const subCategory = useAppSelector((state) => state.category.selectedSubCategory);
    const [data, setData] = useState<{
        subCategoryName: string;
        description: string;
        categoryId: string;
    }>({
        subCategoryName: subCategory?.subCategoryName as string,
        description: subCategory?.description as string,
        categoryId: subCategory?.categoryId as string,
    });

    useEffect(() => {
        if (!isModalEditOpen) {
            setData({
                subCategoryName: '',
                description: '',
                categoryId: '',
            });
        } else {
            dispatch(getAllCategory());
            setData({
                subCategoryName: subCategory?.subCategoryName as string,
                description: subCategory?.description as string,
                categoryId: subCategory?.categoryId as string,
            });
        }
    }, [isModalEditOpen]);

    const handleSubmit = async () => {
        if (data.subCategoryName && data.description && data.categoryId) {
            const req = {
                subCategoryName: data.subCategoryName,
                categoryId: data.categoryId,
                description: data.description,
            };
            try {
                const res = await dispatch(editSubCategory({ id: subCategory?.id as string, data: req })).unwrap();
                if (res.status == 201 || res.status == 200) {
                    setIsModalEditOpen(false);
                    toast.success('Thêm danh mục phụ thành công');
                } else if (res.status == 400) {
                    setIsModalEditOpen(false);
                    toast.error('Tên danh mục phụ đã tồn tại');
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
                    open={isModalEditOpen}
                    onClose={() => {
                        setIsModalEditOpen(false);
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
                                            Cập nhật danh mục phụ
                                        </h3>
                                        <button
                                            type="button"
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                            onClick={() => {
                                                setIsModalEditOpen(false);
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
                                            <div className="sm:col-span-6">
                                                <label
                                                    htmlFor="name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Tên danh mục phụ
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Nhập tên danh mục phụ"
                                                    required={true}
                                                    value={data.subCategoryName}
                                                    onChange={(e) =>
                                                        setData({ ...data, subCategoryName: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="sm:col-span-6">
                                                <label
                                                    htmlFor="price"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Danh mục
                                                </label>
                                                <select
                                                    id="category"
                                                    onChange={(e) => {
                                                        setData({ ...data, categoryId: JSON.parse(e.target.value).id });
                                                    }}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                >
                                                    {listCate ? (
                                                        listCate.map((cate) => (
                                                            <option
                                                                value={JSON.stringify({
                                                                    name: cate.categoryName,
                                                                    id: cate.id,
                                                                })}
                                                                selected={cate.id === data.categoryId}
                                                            >
                                                                {cate.categoryName}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <></>
                                                    )}
                                                </select>
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
                                                    placeholder="Viết mô tả danh mục phụ tại đây"
                                                    required={true}
                                                    value={data.description}
                                                    onChange={(e) => setData({ ...data, description: e.target.value })}
                                                ></textarea>
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
                                                onClick={() => setIsModalEditOpen(false)}
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
