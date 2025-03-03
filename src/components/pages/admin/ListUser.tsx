import React from 'react';
import PageBreadcrumb from '@common/PageBreadCrumb';
import ListUserTable from '@components/atom/table/ListUserTable';

export default function ListUser() {
    return (
        <>
            <PageBreadcrumb pageTitle="Danh sách người dùng" />
            <div className="space-y-6">
                <ListUserTable />
            </div>
        </>
    );
}
