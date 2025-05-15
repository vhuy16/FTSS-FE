import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { CSVLink } from 'react-csv';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Loading from '../Loading/Loading';
import Button from '@components/ui/button/Button';
import dayjs, { Dayjs } from 'dayjs';
import { getDataChartTwo } from '@redux/slices/dashboardSlice';

interface ChartTwoState {
    series: {
        name: string;
        data: number[];
    }[];
}

const ChartTwoSeller: React.FC = () => {
    const dataChartTwo = useAppSelector((state) => state.dashboard.dataChartTwo);
    const categoryLabels = dataChartTwo.map((data) => data.category);
    const series = dataChartTwo.map((data) => data.productQuantity);
    const isLoading = useAppSelector((state) => state.dashboard.isLoadingChartTwo);
    const options: ApexOptions = {
        chart: {
            type: 'donut',
        },
        labels: categoryLabels,
        colors: ['#775dd0', '#008ffb', '#00e396', '#feb019', '#ff4560', '#009688'], // Màu sắc cố định
        dataLabels: {
            enabled: true,
            formatter: (val: number | string) => {
                const num = typeof val === 'number' ? val : parseFloat(val);
                return `${num.toFixed(2)}%`; // Hiển thị phần trăm với 2 số thập phân
            },
        },
        // plotOptions: {
        //     pie: {
        //         dataLabels: {
        //             minAngleToShowLabel: 1, // Hiển thị nhãn ngay cả khi góc nhỏ
        //         },
        //     },
        // },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 350,
                    },
                    legend: {
                        position: 'top',
                        horizontalAlign: 'center',
                    },
                },
            },
        ],
        legend: {
            position: 'top',
            horizontalAlign: 'center',
        },
    };
    const today = dayjs(); // Dùng dayjs() trực tiếp, không cần new Date()
    const pastDate = today.subtract(6, 'day'); // Lùi 6 ngày

    const [startDay, setStartDay] = React.useState<Dayjs | null>(pastDate);
    const [endDay, setEndDay] = React.useState<Dayjs | null>(today);
    const dispatch = useAppDispatch();
    return (
        <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
            <div className="mb-4 justify-between gap-4 sm:flex">
                <div>
                    <h4 className="text-xl font-semibold text-black dark:text-white mb-6 p-4">
                        Biểu đồ biểu thị số sản phẩm bán được theo từng danh mục
                    </h4>
                </div>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="flex justify-between w-full items-center">
                    <div>
                        <div className="mb-4">
                            <DatePicker
                                label="Ngày bắt đầu"
                                value={startDay}
                                onChange={(newValue) => setStartDay(newValue)}
                            />
                        </div>
                        <div className="mb-4">
                            <DatePicker
                                label="Ngày kết thúc"
                                value={endDay}
                                onChange={(newValue) => setEndDay(newValue)}
                            />
                        </div>
                    </div>
                    <div>
                        <Button
                            size="ssm"
                            variant="primary"
                            onClick={() => {
                                dispatch(
                                    getDataChartTwo({
                                        startDay: startDay?.format('YYYY/MM/DD') as string,
                                        endDay: endDay?.format('YYYY/MM/DD') as string,
                                    }),
                                );
                            }}
                        >
                            {isLoading ? <Loading></Loading> : <>Xem</>}
                        </Button>
                    </div>
                </div>
            </LocalizationProvider>
            <div>
                <div id="chartTwo" className="-ml-5 -mb-9">
                    <ReactApexChart options={options} series={series} type="donut" height={350} />
                </div>
            </div>
        </div>
    );
};

export default ChartTwoSeller;
