import { useState, ChangeEvent, useEffect } from 'react';
import { FilterSubWrap, FilterTitle, FilterWrap, PriceFilter, ProductCategoryFilter } from '@styles/filter';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { useLocation, useNavigate } from 'react-router-dom';
import { BaseBtnGreen } from '@styles/button';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { getAllCategory } from '@redux/slices/categorySlice';

const ProductFilter = () => {
    const [isProductFilterOpen, setProductFilterOpen] = useState<boolean>(true);
    const [isPriceFilterOpen, setPriceFilterOpen] = useState<boolean>(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    const listCategory = useAppSelector((state) => state.category.categories);
    const navigate = useNavigate();
    const location = useLocation();
    const k = location.search;
    const queryString = k.split('?')[1];
    const params = new URLSearchParams(queryString);
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');
    useEffect(() => {
        dispatch(getAllCategory());
    }, []);
    useEffect(() => {
        if (!minPrice && !maxPrice) {
            setMaxRange(10000000);
            setMinRange(0);
        }
    }, [minPrice, maxPrice]);
    const toggleFilter = (filter: string): void => {
        switch (filter) {
            case 'product':
                setProductFilterOpen(!isProductFilterOpen);
                break;
            case 'price':
                setPriceFilterOpen(!isPriceFilterOpen);
                break;
            default:
                break;
        }
    };

    const rangeMin = 10000;
    const [minRange, setMinRange] = useState<number>(0);
    const [maxRange, setMaxRange] = useState<number>(10000000);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const inputName = e.target.name;
        const inputValue = parseInt(e.target.value);

        if (inputName === 'min') {
            setMinRange(inputValue);
            // if (maxRange - inputValue < rangeMin) {
            //     setMaxRange(inputValue + rangeMin);
            // }
        } else if (inputName === 'max') {
            setMaxRange(inputValue);
            // if (inputValue - minRange < rangeMin) {
            //     setMinRange(inputValue - rangeMin);
            // }
        }
    };

    const calculateRangePosition = (value: number, max: number): string => {
        return (value / max) * 100 + '%';
    };
    const handleFilterPrice = () => {
        if (minRange > maxRange) {
            toast.warning('Giá nhỏ nhất không được lớn hơn giá lớn nhất');
        } else {
            const currentParams = Object.fromEntries(searchParams.entries()); // Lấy các tham số hiện tại
            const updatedParams = {
                ...currentParams, // Giữ nguyên các tham số hiện có
                minPrice: minRange.toString(),
                maxPrice: maxRange.toString(),
                page: '1',
            };
            setSearchParams(updatedParams);
        }
    };
    const handleFilterSubCate = (subCateName: string) => {
        const currentParams = Object.fromEntries(searchParams.entries()); // Lấy các tham số hiện tại
        const updatedParams = {
            ...currentParams, // Giữ nguyên các tham số hiện có
            subcategoryName: subCateName,
            page: '1',
        };
        setSearchParams(updatedParams);
    };
    type OpenFiltersState = {
        [key: string]: boolean; // Các khóa là chuỗi, giá trị là boolean
    };
    const [openFilters, setOpenFilters] = useState<OpenFiltersState>({}); // Khởi tạo trạng thái với kiểu dữ liệu cụ thể

    const toggleCate = (id: string) => {
        setOpenFilters((prev) => ({
            ...prev,
            [id]: !prev[id], // Đảo trạng thái của bộ lọc với `id`
        }));
    };
    return (
        <>
            <ProductCategoryFilter>
                <FilterTitle
                    className="filter-title flex items-center justify-between"
                    onClick={() => toggleFilter('product')}
                >
                    <p className="filter-title-text text-gray text-base font-semibold text-lg">Phân loại</p>
                    <span className={`text-gray text-xxl filter-title-icon ${!isProductFilterOpen ? 'rotate' : ''}`}>
                        <i className="bi bi-filter"></i>
                    </span>
                </FilterTitle>
                <FilterWrap className={`${!isProductFilterOpen ? 'hide' : 'show'}`}>
                    {listCategory?.map((productFilter) => {
                        return (
                            <div>
                                <div className="product-filter-item" key={productFilter.id}>
                                    <button
                                        type="button"
                                        className="filter-item-head w-full flex items-center justify-between"
                                    >
                                        <div className="filter-head-title text-base text-gray font-semibold">
                                            {productFilter.categoryName}
                                        </div>

                                        <span
                                            onClick={() => toggleCate(productFilter.id)}
                                            className={`text-gray text-xl filter-title-icon ${
                                                !openFilters[productFilter.id] ? 'rotate' : ''
                                            }`}
                                        >
                                            <i className="bi bi-chevron-up"></i>
                                        </span>
                                    </button>
                                </div>
                                <FilterSubWrap className={`${!openFilters[productFilter.id] ? 'hide' : 'show'}`}>
                                    {productFilter.subCategories?.map((productFilter) => {
                                        return (
                                            <div
                                                className="product-filter-item"
                                                key={productFilter.id}
                                                onClick={() => {
                                                    handleFilterSubCate(productFilter.subCategoryName);
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    className="filter-item-head w-full flex items-center justify-between"
                                                >
                                                    <div className="filter-head-title text-base text-gray font-semibold">
                                                        {productFilter.subCategoryName}
                                                    </div>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </FilterSubWrap>
                            </div>
                        );
                    })}
                </FilterWrap>
            </ProductCategoryFilter>

            <PriceFilter>
                <FilterTitle
                    className="filter-title flex items-center justify-between"
                    onClick={() => toggleFilter('price')}
                >
                    <p className="filter-title-text text-gray-150 text-base font-semibold text-lg">Giá</p>
                    <span className={`text-gray-150 text-xl filter-title-icon ${!isPriceFilterOpen ? 'rotate' : ''}`}>
                        <i className="bi bi-chevron-up"></i>
                    </span>
                </FilterTitle>
                <FilterWrap className={`range filter-wrap ${!isPriceFilterOpen ? 'hide' : 'show'}`}>
                    <div className="range-slider">
                        <span
                            className="range-selected h-full bg-green-150"
                            style={{
                                left: calculateRangePosition(minRange, 10000000),
                                right: calculateRangePosition(10000000 - maxRange, 10000000),
                            }}
                        ></span>
                    </div>
                    <div className="range-input">
                        <input
                            type="range"
                            className="min w-full"
                            min="0"
                            max="10000000"
                            value={minRange}
                            step="10000"
                            name="min"
                            onChange={handleInputChange}
                        />
                        <input
                            type="range"
                            className="min w-full"
                            min="0"
                            max="10000000"
                            value={maxRange}
                            step="10000"
                            name="max"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="range-price w-full flex items-center">
                        <input
                            type="number"
                            className="text-center"
                            name="min"
                            value={minRange}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            className="text-center"
                            name="max"
                            value={maxRange}
                            onChange={handleInputChange}
                        />
                    </div>
                    <BaseBtnGreen onClick={handleFilterPrice}>Xác nhận</BaseBtnGreen>
                </FilterWrap>
            </PriceFilter>
        </>
    );
};

export default ProductFilter;
