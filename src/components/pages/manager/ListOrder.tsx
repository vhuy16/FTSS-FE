import React from 'react';
import PageBreadcrumb from '@common/PageBreadCrumb';
import ListOrderTable from '@components/atom/table/ListOrderTable';

export default function ListOrder() {
    return (
        <>
            <PageBreadcrumb pageTitle="Danh sách đơn hàng" />
            <div className="space-y-6">
                <ListOrderTable />
            </div>
        </>
    );
}
