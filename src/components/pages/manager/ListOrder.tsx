import PageBreadcrumb from '@common/PageBreadCrumb';
import ListOrderTable from '@components/atom/table/ListOrderTable';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { getDataChartOne, getDataChartTwo } from '@redux/slices/dashboardSlice';
import { useEffect } from 'react';
export default function ListOrder() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0].replace(/-/g, '/');
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - 6);
        const formattedPastDate = pastDate.toISOString().split('T')[0].replace(/-/g, '/');
        dispatch(
            getDataChartOne({
                startDay: formattedPastDate,
                endDay: formattedToday,
            }),
        );
        dispatch(
            getDataChartTwo({
                startDay: formattedPastDate,
                endDay: formattedToday,
            }),
        );
    }, []);
    return (
        <>
            <>
                <PageBreadcrumb pageTitle="Danh sách đơn hàng mua lẻ" />
                <div className="space-y-6">
                    <ListOrderTable />
                </div>
            </>
        </>
    );
}
