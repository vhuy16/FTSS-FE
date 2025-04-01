import React from 'react';
import PageBreadcrumb from '@common/PageBreadCrumb';
import ListVoucherTable from '@components/atom/table/ListVoucherTable';

export default function ListVoucher() {
    return (
        <>
            <PageBreadcrumb pageTitle="Danh sách mã khuyến mãi" />
            <div className="space-y-6">
                <ListVoucherTable />
            </div>
        </>
    );
}
