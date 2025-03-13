import React from 'react';
import PageBreadcrumb from '@common/PageBreadCrumb';
import ListSubCategoryTable from '@components/atom/table/ListSubCategoryTable';

export default function ListSubCategory() {
    return (
        <>
            <PageBreadcrumb pageTitle="Danh sách danh mục phụ" />
            <div className="space-y-6">
                <ListSubCategoryTable />
            </div>
        </>
    );
}
