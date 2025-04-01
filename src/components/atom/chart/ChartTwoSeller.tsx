import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAppSelector } from '@redux/hook';

interface ChartTwoState {
    series: {
        name: string;
        data: number[];
    }[];
}

const ChartTwoSeller: React.FC = () => {
    const dataChartTwo = [
        { category: 'Cá Cảnh', productQuantity: 44 },
        { category: 'Thủy Sinh', productQuantity: 55 },
        { category: 'Phụ Kiện', productQuantity: 41 },
        { category: 'Dịch Vụ', productQuantity: 17 },
        { category: 'Thức Ăn', productQuantity: 15 },
    ];
    const categoryLabels = dataChartTwo.map((data) => data.category);
    const series = dataChartTwo.map((data) => data.productQuantity);
    const options: ApexOptions = {
        chart: {
            type: 'donut',
        },
        labels: categoryLabels,
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

    return (
        <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
            <div className="mb-4 justify-between gap-4 sm:flex">
                <div>
                    <h4 className="text-xl font-semibold text-black dark:text-white mb-6 p-4">
                        Biểu đồ biểu thị số sản phẩm bán được
                    </h4>
                </div>
            </div>

            <div>
                <div id="chartTwo" className="-ml-5 -mb-9">
                    <ReactApexChart options={options} series={series} type="donut" height={350} />
                </div>
            </div>
        </div>
    );
};

export default ChartTwoSeller;
