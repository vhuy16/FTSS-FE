import React from 'react';
import PageBreadcrumb from '@common/PageBreadCrumb';
import ListIssueCategoryTable from '@components/atom/table/ListIssueCategoryTable';

export default function ListIssueCategory() {
    return (
        <>
            <PageBreadcrumb pageTitle="Danh sách danh mục vấn đề" />
            <div className="space-y-6">
                <ListIssueCategoryTable />
            </div>
        </>
    );
}
