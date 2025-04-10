import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { getAllCategory, getAllSubCategoryByCateName } from '@redux/slices/categorySlice';
import { addProducts } from '@redux/slices/productSlice';
import { toast } from 'react-toastify';
import Loading from '../Loading/Loading';
import { editIssueCategory } from '@redux/slices/issueCategorySlice';
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
export default function EditIssueCategoryModal({ isModalEditOpen, setIsModalEditOpen }: ModalEditProps) {
    const dispatch = useAppDispatch();
    const isLoadingEdit = useAppSelector((state) => state.issueCategory.isLoadingEdit);
    const issueCategory = useAppSelector((state) => state.issueCategory.selectedIssueCategory);
    const [data, setData] = useState<{
        issueCategoryName: string;
        description: string;
    }>({
        issueCategoryName: issueCategory.issueCategoryName,
        description: issueCategory.description,
    });
    useEffect(() => {
        if (isModalEditOpen && issueCategory.id) {
            setData({
                issueCategoryName: issueCategory?.issueCategoryName,
                description: issueCategory.description,
            });
        }
    }, [isModalEditOpen]);

    const handleSubmit = async () => {
        try {
            const res = await dispatch(editIssueCategory({ id: issueCategory.id, data: data })).unwrap();
            if (res.status == 201 || res.status == 200) {
                setIsModalEditOpen(false);
                toast.success('Cập nhật danh mục thành công');
            }
        } catch (error) {
            setIsModalEditOpen(false);
            toast.error(error as string);
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
                                            Cập nhật danh mục vấn đề
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
                                                    Tên danh mục vấn đề
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Nhập tên danh mục"
                                                    required={true}
                                                    value={data.issueCategoryName}
                                                    onChange={(e) =>
                                                        setData({ ...data, issueCategoryName: e.target.value })
                                                    }
                                                />
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
                                                    placeholder="Viết mô tả sản phẩm tại đây"
                                                    value={data.description}
                                                    required={true}
                                                    onChange={(e) => setData({ ...data, description: e.target.value })}
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="flex justify-center">
                                            <button
                                                onClick={handleSubmit}
                                                className="text-white inline-flex items-center bg-blackGreen  hover:bg-blackGreenHover focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mt-3 mr-3"
                                            >
                                                {isLoadingEdit ? <Loading></Loading> : 'Lưu'}
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
