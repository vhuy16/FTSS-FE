import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { getAllCategory, getAllSubCategoryByCateName } from '@redux/slices/categorySlice';
import { addProducts } from '@redux/slices/productSlice';
import { toast } from 'react-toastify';
import Loading from '../Loading/Loading';
import { addVoucher, editVoucher } from '@redux/slices/voucherSlice';
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
export default function EditVoucherModal({ isModalEditOpen, setIsModalEditOpen }: ModalEditProps) {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector((state) => state.voucher.isLoadingEdit);
    const voucher = useAppSelector((state) => state.voucher.selectedVoucher);
    const [data, setData] = useState<{
        discount: number;
        quantity: number;
        maximumOrderValue: number;
        expiryDate: string;
        discountType: string;
        description: string;
    }>({
        discount: voucher?.discount,
        quantity: voucher?.quantity,
        maximumOrderValue: voucher?.maximumOrderValue,
        expiryDate: voucher.expiryDate,
        discountType: voucher.discountType,
        description: voucher.description,
    });
    useEffect(() => {
        if (isModalEditOpen && voucher.voucherCode) {
            setData({
                discount: voucher?.discount,
                quantity: voucher?.quantity,
                maximumOrderValue: voucher?.maximumOrderValue,
                expiryDate: voucher.expiryDate,
                discountType: voucher.discountType,
                description: voucher.description,
            });
        }
    }, [isModalEditOpen]);
    console.log('data', data);

    const handleSubmit = async () => {
        if (data.discountType === 'Percentage') {
            if (
                data.discount != 0 &&
                data.quantity != 0 &&
                data.maximumOrderValue != 0 &&
                data.expiryDate &&
                data.discountType &&
                data.description
            ) {
                const expiryDate = new Date(data.expiryDate);
                const today = new Date();
                expiryDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);
                if (expiryDate >= today) {
                    const dataAdd = {
                        discount: data.discount,
                        quantity: data.quantity,
                        maximumOrderValue: data.maximumOrderValue,
                        expiryDate: data.expiryDate,
                        discountType: data.discountType,
                        description: data.description,
                    };

                    try {
                        const res = await dispatch(editVoucher({ id: voucher.id, data: dataAdd })).unwrap();
                        setIsModalEditOpen(false);
                        setData({
                            discount: 0,
                            quantity: 0,
                            maximumOrderValue: 0,
                            expiryDate: '',
                            discountType: '',
                            description: '',
                        });
                        toast.success('Cập nhật mã khuyến mãi thành công');
                    } catch (error) {
                        toast.error(error as string);
                    }
                } else {
                    toast.error('Ngày hết hạn không được trước ngày phát hành');
                }
            } else {
                toast.error('Vui lòng nhập đủ thông tin');
            }
        } else {
            if (data.discount != 0 && data.quantity != 0 && data.expiryDate && data.discountType && data.description) {
                const expiryDate = new Date(data.expiryDate);
                const today = new Date();
                expiryDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);
                if (expiryDate >= today) {
                    const dataAdd = {
                        discount: data.discount,
                        quantity: data.quantity,
                        maximumOrderValue: data.maximumOrderValue,
                        expiryDate: data.expiryDate,
                        discountType: data.discountType,
                        description: data.description,
                    };
                    try {
                        const res = await dispatch(editVoucher({ id: voucher.id, data: dataAdd })).unwrap();
                        setIsModalEditOpen(false);
                        setData({
                            discount: 0,
                            quantity: 0,
                            maximumOrderValue: 0,
                            expiryDate: '',
                            discountType: '',
                            description: '',
                        });
                        toast.success('Cập nhật mã khuyến mãi thành công');
                    } catch (error) {
                        toast.error(error as string);
                    }
                } else {
                    toast.error('Ngày hết hạn không được trước ngày phát hành');
                }
            } else {
                toast.error('Vui lòng nhập đủ thông tin');
            }
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
                        setData({
                            discount: 0,
                            quantity: 0,
                            maximumOrderValue: 0,
                            expiryDate: '',
                            discountType: '',
                            description: '',
                        });
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
                                            Chỉnh sửa mã giảm giá
                                        </h3>
                                        <button
                                            type="button"
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                            onClick={() => {
                                                setIsModalEditOpen(false);
                                                setData({
                                                    discount: 0,
                                                    quantity: 0,
                                                    maximumOrderValue: 0,
                                                    expiryDate: '',
                                                    discountType: '',
                                                    description: '',
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
                                            <div className="sm:col-span-3">
                                                <label
                                                    htmlFor="category"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Phân loại
                                                </label>
                                                <select
                                                    id="discountType"
                                                    onChange={(e) => {
                                                        setData({
                                                            ...data,
                                                            discountType: e.target.value,
                                                        });
                                                    }}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                >
                                                    <option
                                                        selected={data.discountType === 'Percentage'}
                                                        value="Percentage"
                                                    >
                                                        Phần trăm
                                                    </option>
                                                    <option
                                                        selected={data.discountType.trim() === 'Fixed'}
                                                        value="Fixed"
                                                    >
                                                        Cố định
                                                    </option>
                                                </select>
                                            </div>
                                            <div className="sm:col-span-3">
                                                <label
                                                    htmlFor="brand"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Ngày hết hạn
                                                </label>
                                                <input
                                                    type="date"
                                                    name="expiryDate"
                                                    id="brand"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Nhập ngày hết hạn"
                                                    required={true}
                                                    value={data.expiryDate.split('T')[0]}
                                                    onChange={(e) => setData({ ...data, expiryDate: e.target.value })}
                                                />
                                            </div>

                                            <div
                                                className={
                                                    data.discountType === 'Percentage'
                                                        ? 'sm:col-span-2'
                                                        : 'sm:col-span-3'
                                                }
                                            >
                                                <label
                                                    htmlFor="name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Giảm giá {data.discountType === 'Percentage' ? '(%)' : '(₫)'}
                                                </label>
                                                <input
                                                    type="number"
                                                    name="discount"
                                                    id="name"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Nhập mức giảm giá"
                                                    required={true}
                                                    value={data.discount}
                                                    onChange={(e) =>
                                                        setData({ ...data, discount: parseInt(e.target.value) })
                                                    }
                                                />
                                            </div>
                                            {data.discountType === 'Percentage' && (
                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="brand"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Giảm giá tối đa (₫)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="maximumOrderValue"
                                                        id="brand"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="Nhập mức giảm giá tối đa"
                                                        required={true}
                                                        value={data.maximumOrderValue}
                                                        onChange={(e) =>
                                                            setData({
                                                                ...data,
                                                                maximumOrderValue: parseInt(e.target.value),
                                                            })
                                                        }
                                                    />
                                                </div>
                                            )}
                                            <div
                                                className={
                                                    data.discountType === 'Percentage'
                                                        ? 'sm:col-span-2'
                                                        : 'sm:col-span-3'
                                                }
                                            >
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
                                                    required={true}
                                                    value={data.quantity}
                                                    onChange={(e) =>
                                                        setData({ ...data, quantity: parseInt(e.target.value) })
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
                                                    placeholder="Viết mô tả khuyến mãi tại đây"
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
                                                onClick={() => {
                                                    setIsModalEditOpen(false);
                                                    setData({
                                                        discount: 0,
                                                        quantity: 0,
                                                        maximumOrderValue: 0,
                                                        expiryDate: '',
                                                        discountType: '',
                                                        description: '',
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
