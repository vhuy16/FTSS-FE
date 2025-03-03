import React from 'react';
import PageBreadcrumb from '@common/PageBreadCrumb';
import ListProductTable from '@components/atom/table/ListProductTable';

export default function ListProduct() {
    return (
        <>
            <PageBreadcrumb pageTitle="Danh sách sản phẩm" />
            <div className="space-y-6">
                <ListProductTable />
            </div>
        </>
    );
}
