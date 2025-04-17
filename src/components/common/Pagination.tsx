import React from 'react';

export type Props = {
    page: number;
    totalPages: number;
    onClickPage: (page: number) => void;
};

const Pagination = ({ page, totalPages, onClickPage }: Props) => {
    const pageNum = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNum.push(i);
    }

    return (
        <div className="flex justify-center my-6">
            <ul className="flex rounded-full overflow-hidden shadow-md">
                {pageNum.map((num) => (
                    <li 
                        key={num}
                        className={`${
                            page === num 
                                ? "bg-gradient-to-r from-orange-300 to-orange-500 text-white" 
                                : "bg-white text-gray-700 hover:bg-orange-100"
                        } border-r last:border-r-0 border-orange-200 transition-colors`}
                    >
                        <button 
                            onClick={() => onClickPage(num)} 
                            className="px-4 py-2 font-medium focus:outline-none w-full h-full"
                            aria-current={page === num ? "page" : undefined}
                        >
                            {num}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Pagination;