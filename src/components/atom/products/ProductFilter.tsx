import { useState, ChangeEvent, useEffect } from 'react';
import { FilterTitle, FilterWrap, PriceFilter, ProductCategoryFilter } from '@styles/filter';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { useNavigate } from 'react-router-dom';

const ProductFilter = () => {
    const [isProductFilterOpen, setProductFilterOpen] = useState<boolean>(true);
    const [isPriceFilterOpen, setPriceFilterOpen] = useState<boolean>(true);
    // const dispatch = useAppDispatch();
    // const listCategory = useAppSelector((state) => state.category.categories);
    // const navigate = useNavigate();
    // useEffect(() => {
    //     dispatch(getAllCategory());
    // }, []);
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

    const rangeMin = 100;
    const [minRange, setMinRange] = useState<number>(300);
    const [maxRange, setMaxRange] = useState<number>(700);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const inputName = e.target.name;
        const inputValue = parseInt(e.target.value);

        if (inputName === 'min') {
            setMinRange(inputValue);
            if (maxRange - inputValue < rangeMin) {
                setMaxRange(inputValue + rangeMin);
            }
        } else if (inputName === 'max') {
            setMaxRange(inputValue);
            if (inputValue - minRange < rangeMin) {
                setMinRange(inputValue - rangeMin);
            }
        }
    };

    const calculateRangePosition = (value: number, max: number): string => {
        return (value / max) * 100 + '%';
    };

    return (
        <>
            {/* <ProductCategoryFilter>
                <FilterTitle
                    className="filter-title flex items-center justify-between"
                    onClick={() => toggleFilter('product')}
                >
                    <p className="filter-title-text text-gray-150 text-base font-semibold text-lg">Các Loại Sản Phẩm</p>
                    <span
                        className={`text-gray-150 text-xxl filter-title-icon ${!isProductFilterOpen ? 'rotate' : ''}`}
                    >
                        <i className="bi bi-filter"></i>
                    </span>
                </FilterTitle>
                <FilterWrap className={`${!isProductFilterOpen ? 'hide' : 'show'}`}>
                    {listCategory?.map((category) => {
                        return (
                            <div
                                className="product-filter-item"
                                key={category.category_id}
                                onClick={() => {
                                    dispatch(changeSearchValue(category.name));
                                    navigate(`/search?keyword=${category.name}`);
                                }}
                            >
                                <button
                                    type="button"
                                    className="filter-item-head w-full   flex items-center justify-between"
                                >
                                    <span className="filter-head-title text-base text-gray-150 font-semibold">
                                        {category.name}
                                    </span>
                                    <span className="filter-head-icon text-gray-150">
                                        <i className="bi bi-chevron-right"></i>
                                    </span>
                                </button>
                            </div>
                        );
                    })}
                </FilterWrap>
            </ProductCategoryFilter> */}

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
                                left: calculateRangePosition(minRange, 1000),
                                right: calculateRangePosition(1000 - maxRange, 1000),
                            }}
                        ></span>
                    </div>
                    <div className="range-input">
                        <input
                            type="range"
                            className="min w-full"
                            min="0"
                            max="1000"
                            value={minRange}
                            step="10"
                            name="min"
                            onChange={handleInputChange}
                        />
                        <input
                            type="range"
                            className="min w-full"
                            min="0"
                            max="1000"
                            value={maxRange}
                            step="10"
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
                </FilterWrap>
            </PriceFilter>
        </>
    );
};

export default ProductFilter;
