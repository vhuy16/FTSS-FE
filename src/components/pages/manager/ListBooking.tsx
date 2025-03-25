import React from 'react';
import PageBreadcrumb from '@common/PageBreadCrumb';
import ListBookingTable from '@components/atom/table/ListBookingTable';

export default function ListBooking() {
    return (
        <>
            <PageBreadcrumb pageTitle="Danh sách đơn bảo trì" />
            <div className="space-y-6">
                <ListBookingTable />
            </div>
        </>
    );
}
