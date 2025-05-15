import React from 'react';
import PageBreadcrumb from '@common/PageBreadCrumb';
import UserMetaCard from '@components/atom/UserProfile/UserMetaCard';
import UserInfoCard from '@components/atom/UserProfile/UserInfoCard';
export default function ManagerProfiles() {
    return (
        <>
            <PageBreadcrumb pageTitle="Thông tin cá nhân" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="space-y-6">
                    <UserMetaCard />
                    <UserInfoCard />
                </div>
            </div>
        </>
    );
}
