import React, { ReactNode } from 'react';

interface CardDataDashboardProps {
    title: string;
    total: string;
}

const CardDataDashboard: React.FC<CardDataDashboardProps> = ({ title, total }) => {
    return (
        <div className="rounded-sm border border-stroke bg-white py-5 pr-10 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="mt-4 ml-6 flex items-end justify-between">
                <div>
                    <h4 className="text-title-md font-bold text-black dark:text-white">{total}</h4>
                    <span className="text-title-xsm font-semibold text-bodydark">{title}</span>
                </div>
            </div>
        </div>
    );
};

export default CardDataDashboard;
