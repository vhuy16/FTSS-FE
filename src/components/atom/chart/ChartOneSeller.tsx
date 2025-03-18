import { useAppDispatch, useAppSelector } from '@redux/hook';

import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { CSVLink } from 'react-csv';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { getDataChartOne } from '@redux/slices/dashboardSlice';
import Button from '@components/ui/button/Button';
import { DownloadIcon, EyeIcon } from '@icons/admin_icon';
import Loading from '../Loading/Loading';

interface ChartOneState {
    series: {
        name: string;
        data: number[];
    }[];
}

const ChartOneSeller: React.FC = () => {
    const dispatch = useAppDispatch();
    const dataChartOne = useAppSelector((state) => state.dashboard.dataChartOne);
    const isLoading = useAppSelector((state) => state.dashboard.isLoadingChartOne);
    const dayChartOne = dataChartOne.map((data) => data.day);
    const valueChartOne = dataChartOne.map((data) => data.revenue);
    const options: ApexOptions = {
        legend: {
            show: false,
            position: 'top',
            horizontalAlign: 'left',
        },
        colors: ['#3C50E0', '#80CAEE'],
        chart: {
            fontFamily: 'Satoshi, sans-serif',
            height: 335,
            type: 'area',
            dropShadow: {
                enabled: true,
                color: '#623CEA14',
                top: 10,
                blur: 4,
                left: 0,
                opacity: 0.1,
            },

            toolbar: {
                show: false,
            },
        },
        responsive: [
            {
                breakpoint: 1024,
                options: {
                    chart: {
                        height: 300,
                    },
                },
            },
            {
                breakpoint: 1366,
                options: {
                    chart: {
                        height: 350,
                    },
                },
            },
        ],
        stroke: {
            width: [2, 2],
            curve: 'straight',
        },

        grid: {
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        markers: {
            size: 4,
            colors: '#fff',
            strokeColors: ['#3056D3', '#80CAEE'],
            strokeWidth: 3,
            strokeOpacity: 0.9,
            strokeDashArray: 0,
            fillOpacity: 1,
            discrete: [],
            hover: {
                size: undefined,
                sizeOffset: 5,
            },
        },
        xaxis: {
            type: 'category',
            categories: dayChartOne,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            title: {
                style: {
                    fontSize: '0px',
                },
            },
            min: 0,
            // max: 500000,
        },
        tooltip: {
            marker: {
                show: false, // Ẩn chấm xanh
            },
        },
    };

    let series = [
        {
            name: 'Doanh Thu',
            data: valueChartOne,
        },
    ];

    const [startDay, setStartDay] = React.useState<Dayjs | null>(
        dayjs(dayjs(dayChartOne[0], 'DD/MM/YYYY').format('YYYY/MM/DD')),
    );
    const [endDay, setEndDay] = React.useState<Dayjs | null>(
        dayjs(dayjs(dayChartOne[dayChartOne.length - 1], 'DD/MM/YYYY').format('YYYY/MM/DD')),
    );
    const data = dataChartOne.map((order) => {
        const [day, month, year] = order.day.split('/'); // Tách ngày, tháng, năm
        const formattedDate = `${month}/${day}/${year}`; // Chuyển thành MM/DD/YYYY
        return [formattedDate, order.revenue];
    });

    const dataCSV = [['Ngày', 'Doanh thu'], ...data, ['', 10]];

    return (
        <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7 xl:col-span-8">
            {/* <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
                <div className="flex w-full flex-wrap gap-3 sm:gap-7 3xl:gap-8">
                    <div className="flex min-w-47">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Ngày Bắt Đầu
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Ngày Bắt Đầu"
                            required
                        />
                    </div>
                    <div className="flex min-w-47">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Ngày Kết Thúc
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Ngày Kết Thúc"
                            required
                        />
                    </div>

                    <button
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                        Xem
                    </button>
                </div>
                <div className="flex w-full max-w-45 items-end flex-col">
                    <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
                        <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
                            Ngày
                        </button>
                        <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
                            Tuần
                        </button>
                        <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
                            Tháng
                        </button>
                    </div>
                    <button className="text-white bg-green-700 hover:bg-green-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Xuất File
                    </button>
                </div>
            </div> */}
            <div className="mb-4 justify-between gap-4 sm:flex">
                <div>
                    <h4 className="text-xl font-semibold text-black dark:text-white mb-6 p-4">Biểu đồ doanh thu</h4>
                </div>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                    <DatePicker label="Ngày bắt đầu" value={startDay} onChange={(newValue) => setStartDay(newValue)} />
                    <DatePicker label="Ngày kết thúc" value={endDay} onChange={(newValue) => setEndDay(newValue)} />
                    <div className="flex justify-between items-center w-full">
                        <Button
                            size="ssm"
                            variant="primary"
                            onClick={() => {
                                dispatch(
                                    getDataChartOne({
                                        startDay: startDay?.format('YYYY/MM/DD') as string,
                                        endDay: endDay?.format('YYYY/MM/DD') as string,
                                    }),
                                );
                            }}
                        >
                            {isLoading ? <Loading></Loading> : <>Xem</>}
                        </Button>
                        <Button size="ssm" variant="primary" startIcon={<DownloadIcon />}>
                            <CSVLink data={dataCSV} filename="Doanhthu">
                                Tải về
                            </CSVLink>
                        </Button>
                    </div>
                </DemoContainer>
            </LocalizationProvider>

            <div>
                <div id="chartOne" className="-ml-5">
                    <ReactApexChart options={options} series={series} type="area" height={350} />
                </div>
            </div>
        </div>
    );
};

export default ChartOneSeller;
