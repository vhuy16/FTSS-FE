import PageBreadcrumb from '@common/PageBreadCrumb';
import ListOrderDeliveryTable from '@components/atom/table/ListOrderDeliveryTable';

export default function ListOrderDelivery() {
    return (
        <>
            <>
                <PageBreadcrumb pageTitle="Danh sách đơn hàng mua theo bộ" />
                <div className="space-y-6">
                    <ListOrderDeliveryTable />
                </div>
            </>
        </>
    );
}
