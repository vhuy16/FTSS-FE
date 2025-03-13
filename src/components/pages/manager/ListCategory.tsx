import React from 'react';
import PageBreadcrumb from '@common/PageBreadCrumb';
import ListCategoryTable from '@components/atom/table/ListCategoryTable';

export default function ListCategory() {
    return (
        <>
            <PageBreadcrumb pageTitle="Danh sách danh mục" />
            <div className="space-y-6">
                <ListCategoryTable />
            </div>
        </>
    );
}
