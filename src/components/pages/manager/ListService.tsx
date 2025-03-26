import React from 'react';
import PageBreadcrumb from '@common/PageBreadCrumb';
import ListServiceTable from '@components/atom/table/ListServiceTable';

export default function ListService() {
    return (
        <>
            <PageBreadcrumb pageTitle="Danh sách dịch vụ" />
            <div className="space-y-6">
                <ListServiceTable />
            </div>
        </>
    );
}
