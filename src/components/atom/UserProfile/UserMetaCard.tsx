import React from 'react';
import { useAppSelector } from '@redux/hook';
import Avatar from '../header/Avatar';

export default function UserMetaCard() {
    const user = useAppSelector((state) => state.userProfile.user);

    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <Avatar name={user?.username as string}></Avatar>
                        <div className="order-3 xl:order-2">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                {user?.username}
                            </h4>
                            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
