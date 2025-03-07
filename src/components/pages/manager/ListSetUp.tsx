import React from 'react';
import PageBreadcrumb from '@common/PageBreadCrumb';
import ListSetupTable from '@components/atom/table/ListSetupTable';

export default function ListSetUp() {
    return (
        <>
            <PageBreadcrumb pageTitle="Danh sách các thiết kế bể cá" />
            <div className="space-y-6">
                <ListSetupTable />
            </div>
        </>
    );
}
