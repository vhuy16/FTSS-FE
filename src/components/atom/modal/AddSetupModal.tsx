import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { getAllCategory, getAllSubCategoryByCateName } from '@redux/slices/categorySlice';
import { addProducts, getAllCategoryWithProduct } from '@redux/slices/productSlice';
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
            width: 250,
        },
    },
};
export default function AddSetupModal({ isModalAddOpen, setIsModalAddOpen }: ModalAddProps) {
    const dispatch = useAppDispatch();
    const [listProduct, setListProduct] = useState<string[]>([]);
    const isLoadingAdd = useAppSelector((state) => state.setupPackage.loading);
    const isLoadingCate = useAppSelector((state) => state.product.isLoadingGetCateWithProduct);
    const listCateWithProduct = useAppSelector((state) => state.product.listCateAndProduct);

    const [data, setData] = useState<{
        SetupName: string;
        Description: string;
        ProductItemsJson: string;
        ImageFile: File | null;
    }>({
        SetupName: '',
        Description: '',
        ProductItemsJson: '',
        ImageFile: null,
    });
    const handleChange = (event: SelectChangeEvent<string[]>, cateName: string) => {
        const {
            target: { value },
        } = event;
        if (typeof value !== 'string') {
            const checkExit = value.filter((p) => JSON.parse(p).cateName == 'Bể');
            if (checkExit.length > 1) {
                const newValue = value.filter((p) => p != checkExit[0]);
                setListProduct(newValue);
            } else {
                setListProduct(value);
            }
        } else {
            setListProduct(
                // On autofill we get a stringified value.
                typeof value === 'string' ? value.split(',') : value,
            );
        }
    };
    useEffect(() => {
        if (isModalAddOpen) {
            dispatch(getAllCategoryWithProduct());
        } else {
            setListProduct([]);
            setData({
                SetupName: '',
                Description: '',
                ProductItemsJson: '',
                ImageFile: null,
            });
        }
    }, [isModalAddOpen]);

    const handleSubmit = async () => {
        const ProductJson = JSON.stringify(
            listProduct.map((p) => {
                const parsed = JSON.parse(p); // Chỉ parse một lần
                return {
                    ProductId: parsed.ProductId,
                    Quantity: Number(parsed.Quantity), // Đảm bảo Quantity là số
                };
            }),
        );
        if (data.SetupName && data.Description && data.ImageFile && JSON.parse(ProductJson).length >= 3) {
            if (data.SetupName.length < 10) {
                const formData = new FormData();
                formData.append('SetupName', data.SetupName);
                formData.append('Description', data.Description);
                formData.append('ProductItemsJson', ProductJson);
                formData.append('ImageFile', data.ImageFile);

                try {
                    const res = await dispatch(createSetupPackage(formData)).unwrap();
                    if (res.status == 201) {
                        setIsModalAddOpen(false);
                        setData({
                            SetupName: '',
                            Description: '',
                            ProductItemsJson: '',
                            ImageFile: null,
                        });
                        toast.success('Thêm mẫu thiết kế bể cá thành công');
                    }
                } catch (error) {
                    toast.error(error as string);
                }
            } else {
                toast.error('Tên mẫu thiếu kế phải là chữ in hoa và ít hơn 10 kí tự');
            }
        } else {
            toast.error('Vui lòng nhập đủ thông tin! Bể, Lọc, Đèn là 3 thành phần bắt buộc khi tạo bể cá');
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
                                            Thêm mẫu thiết kế
                                        </h3>
                                        <button
                                            type="button"
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                            onClick={() => {
                                                setIsModalAddOpen(false);
                                                setData({
                                                    SetupName: '',
                                                    Description: '',
                                                    ProductItemsJson: '',
                                                    ImageFile: null,
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
                                                    Tên thiết kế
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Nhập tên thiết kế"
                                                    required={true}
                                                    value={data.SetupName}
                                                    onChange={(e) =>
                                                        setData({
                                                            ...data,
                                                            SetupName:
                                                                e.target.value.charAt(0).toUpperCase() +
                                                                e.target.value.slice(1).toLowerCase(),
                                                        })
                                                    }
                                                />
                                            </div>

                                            <label className="block text-sm font-medium text-gray-900 dark:text-white col-span-6">
                                                Lựa chọn các thành phần
                                            </label>
                                            {isLoadingCate ? (
                                                <Loading></Loading>
                                            ) : (
                                                listCateWithProduct &&
                                                listCateWithProduct.length > 0 &&
                                                listCateWithProduct.map((cate) => (
                                                    <div className="sm:col-span-6">
                                                        <div>
                                                            <FormControl sx={{ width: '100%' }}>
                                                                <InputLabel id="demo-multiple-checkbox-label">
                                                                    {cate.categoryName}
                                                                </InputLabel>
                                                                <Select
                                                                    labelId="demo-multiple-checkbox-label"
                                                                    id="demo-multiple-checkbox"
                                                                    multiple
                                                                    value={listProduct}
                                                                    onChange={(event) => {
                                                                        handleChange(event, cate.categoryName);
                                                                    }}
                                                                    input={<OutlinedInput label="Tag" />}
                                                                    renderValue={() => {
                                                                        const listProductByCate = listProduct.filter(
                                                                            (product) =>
                                                                                cate.products.some(
                                                                                    (p) =>
                                                                                        p.id ===
                                                                                        JSON.parse(product).ProductId,
                                                                                ),
                                                                        );
                                                                        return listProductByCate
                                                                            .map(
                                                                                (product) =>
                                                                                    `${JSON.parse(product).name} x ${
                                                                                        JSON.parse(product).Quantity
                                                                                    }`,
                                                                            )
                                                                            .join(', ');
                                                                    }}
                                                                    MenuProps={MenuProps}
                                                                >
                                                                    {cate.products &&
                                                                        cate.products.length > 0 &&
                                                                        cate.products.map((product) => (
                                                                            <MenuItem
                                                                                key={product.id}
                                                                                value={JSON.stringify({
                                                                                    ProductId: product.id,
                                                                                    name: product.productName,
                                                                                    cateName: cate.categoryName,
                                                                                    Quantity: listProduct.find(
                                                                                        (p) =>
                                                                                            JSON.parse(p).ProductId ===
                                                                                            product.id,
                                                                                    )
                                                                                        ? JSON.parse(
                                                                                              listProduct.find(
                                                                                                  (p) =>
                                                                                                      JSON.parse(p)
                                                                                                          .ProductId ===
                                                                                                      product.id,
                                                                                              )!,
                                                                                          ).Quantity
                                                                                        : '1',
                                                                                })}
                                                                            >
                                                                                <Checkbox
                                                                                    checked={listProduct.some(
                                                                                        (p) =>
                                                                                            JSON.parse(p).ProductId ===
                                                                                            product.id,
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
                                                                                {listProduct.some(
                                                                                    (p) =>
                                                                                        JSON.parse(p).ProductId ===
                                                                                        product.id,
                                                                                ) &&
                                                                                    cate.categoryName !== 'Bể' && (
                                                                                        <div
                                                                                            className="max-w-xs ml-auto flex justify-end"
                                                                                            onClick={(e) =>
                                                                                                e.stopPropagation()
                                                                                            }
                                                                                        >
                                                                                            <div className="relative flex items-center max-w-[5rem]">
                                                                                                <button
                                                                                                    type="button"
                                                                                                    id="decrement-button"
                                                                                                    className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 
            hover:bg-gray-200 border border-gray-300 rounded-s-lg p-1 h-6 focus:ring-gray-100 
            dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                                                                                >
                                                                                                    <svg
                                                                                                        className="w-1.5 h-1.5 text-gray-900 dark:text-white"
                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                        fill="none"
                                                                                                        viewBox="0 0 18 2"
                                                                                                    >
                                                                                                        <path
                                                                                                            stroke="currentColor"
                                                                                                            stroke-linecap="round"
                                                                                                            stroke-linejoin="round"
                                                                                                            stroke-width="2"
                                                                                                            d="M1 1h16"
                                                                                                        />
                                                                                                    </svg>
                                                                                                </button>
                                                                                                <input
                                                                                                    type="text"
                                                                                                    id="quantity-input"
                                                                                                    className="w-[3rem] bg-gray-50 border-x-0 border-gray-300 h-6 text-center text-gray-900 text-xs 
            focus:ring-blue-500 focus:border-blue-500 block w-full py-0.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                                                    placeholder="1"
                                                                                                    value={
                                                                                                        listProduct.find(
                                                                                                            (p) =>
                                                                                                                JSON.parse(
                                                                                                                    p,
                                                                                                                )
                                                                                                                    .ProductId ===
                                                                                                                product.id,
                                                                                                        )
                                                                                                            ? JSON.parse(
                                                                                                                  listProduct.find(
                                                                                                                      (
                                                                                                                          p,
                                                                                                                      ) =>
                                                                                                                          JSON.parse(
                                                                                                                              p,
                                                                                                                          )
                                                                                                                              .ProductId ===
                                                                                                                          product.id,
                                                                                                                  )!,
                                                                                                              ).Quantity
                                                                                                            : '1'
                                                                                                    }
                                                                                                    onChange={(e) => {
                                                                                                        const updatedList =
                                                                                                            listProduct.map(
                                                                                                                (
                                                                                                                    item,
                                                                                                                ) => {
                                                                                                                    const obj =
                                                                                                                        JSON.parse(
                                                                                                                            item,
                                                                                                                        );
                                                                                                                    if (
                                                                                                                        obj.name ===
                                                                                                                        product.productName
                                                                                                                    ) {
                                                                                                                        obj.Quantity =
                                                                                                                            e.target.value;
                                                                                                                    }
                                                                                                                    return JSON.stringify(
                                                                                                                        obj,
                                                                                                                    );
                                                                                                                },
                                                                                                            );
                                                                                                        setListProduct(
                                                                                                            updatedList,
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                                <button
                                                                                                    type="button"
                                                                                                    id="increment-button"
                                                                                                    className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 
            hover:bg-gray-200 border border-gray-300 rounded-e-lg p-1 h-6 focus:ring-gray-100 
            dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                                                                                >
                                                                                                    <svg
                                                                                                        className="w-1.5 h-1.5 text-gray-900 dark:text-white"
                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                        fill="none"
                                                                                                        viewBox="0 0 18 18"
                                                                                                    >
                                                                                                        <path
                                                                                                            stroke="currentColor"
                                                                                                            stroke-linecap="round"
                                                                                                            stroke-linejoin="round"
                                                                                                            stroke-width="2"
                                                                                                            d="M9 1v16M1 9h16"
                                                                                                        />
                                                                                                    </svg>
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                            </MenuItem>
                                                                        ))}
                                                                </Select>
                                                            </FormControl>
                                                        </div>
                                                    </div>
                                                ))
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
                                                    placeholder="Viết mô tả sản phẩm tại đây"
                                                    required={true}
                                                    onChange={(e) => setData({ ...data, Description: e.target.value })}
                                                ></textarea>
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
                                                    setData({
                                                        SetupName: '',
                                                        Description: '',
                                                        ProductItemsJson: '',
                                                        ImageFile: null,
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
