import { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { getAllUser, updateRoleUser, UserProfile } from '@redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import Loading from '../Loading/Loading';
import { toast } from 'react-toastify';
type ConfirmDeleteProps = {
    isModalOpenEditRole: boolean;
    setIsModalOpenEditRole: (isOpen: boolean) => void;
    user: UserProfile;
    newRole: string;
};
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
};
export default function ConfirmEditRole({
    user,
    newRole,
    isModalOpenEditRole,
    setIsModalOpenEditRole,
}: ConfirmDeleteProps) {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector((state) => state.userProfile.isLoadingEdit);
    const handleEdit = async () => {
        console.log('user', user);
        console.log('role', newRole);
        const data = {
            gender: user.gender == 'Male' ? 0 : 1,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            role: newRole,
        };
        await dispatch(updateRoleUser({ userId: user.userId, userInfo: data }));
        setIsModalOpenEditRole(false);
        toast.success('Cập nhật vai trò cho người dùng thành công');
    };
    return (
        <>
            {/* Modal */}
            <div>
                <Modal
                    open={isModalOpenEditRole}
                    onClose={() => {
                        setIsModalOpenEditRole(false);
                    }}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div className="relative p-4 w-full max-w-md max-h-full">
                            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                                <button
                                    type="button"
                                    className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={() => {
                                        setIsModalOpenEditRole(false);
                                    }}
                                >
                                    <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                                <div className="p-4 md:p-5 text-center">
                                    <svg
                                        className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                        Bạn có muốn thay đổi vai trò của người dùng?
                                    </h3>
                                    <button
                                        type="button"
                                        className="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                        onClick={handleEdit}
                                    >
                                        {isLoading ? <Loading></Loading> : 'Xác nhận'}
                                    </button>
                                    <button
                                        type="button"
                                        className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                        onClick={() => {
                                            setIsModalOpenEditRole(false);
                                        }}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Modal>
            </div>
        </>
    );
}
