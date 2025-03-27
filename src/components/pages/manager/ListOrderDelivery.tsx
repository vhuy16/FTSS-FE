import PageBreadcrumb from '@common/PageBreadCrumb';
import ListOrderDeliveryTable from '@components/atom/table/ListOrderDeliveryTable';
import { useAppDispatch } from '@redux/hook';

export default function ListOrderDelivery() {
    return (
        <>
            <>
                <PageBreadcrumb pageTitle="Danh sách đơn hàng cần giao và lắp đặt" />
                <div className="space-y-6">
                    <ListOrderDeliveryTable />
                </div>
            </>
        </>
    );
}
