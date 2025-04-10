import React from 'react';
import PageBreadcrumb from '@common/PageBreadCrumb';
import ListIssueCategoryTable from '@components/atom/table/ListIssueCategoryTable';
import ListIssueTable from '@components/atom/table/ListIssueTable';

export default function ListIssue() {
    return (
        <>
            <PageBreadcrumb pageTitle="Danh sách các vấn đề" />
            <div className="space-y-6">
                <ListIssueTable />
            </div>
        </>
    );
}
