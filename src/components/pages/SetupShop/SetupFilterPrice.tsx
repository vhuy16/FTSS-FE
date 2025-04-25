import { useState, ChangeEvent, useEffect } from "react";
import { FilterTitle, FilterWrap, PriceFilter } from "@styles/filter";
import { useLocation } from "react-router-dom";
import { BaseBtnGreen } from "@styles/button";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

const SetupFilterPrice = () => {
  const [isSetupFilterOpen, setSetupFilterOpen] = useState<boolean>(true);
  const [isPriceFilterOpen, setPriceFilterOpen] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const k = location.search;
  const queryString = k.split("?")[1];
  const params = new URLSearchParams(queryString);
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  useEffect(() => {
    if (!minPrice && !maxPrice) {
      setMaxRange(10000000);
      setMinRange(0);
    }
  }, [minPrice, maxPrice]);
  const toggleFilter = (filter: string): void => {
    switch (filter) {
      case "product":
        setSetupFilterOpen(!isSetupFilterOpen);
        break;
      case "price":
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

    if (inputName === "min") {
      setMinRange(inputValue);
      // if (maxRange - inputValue < rangeMin) {
      //     setMaxRange(inputValue + rangeMin);
      // }
    } else if (inputName === "max") {
      setMaxRange(inputValue);
      // if (inputValue - minRange < rangeMin) {
      //     setMinRange(inputValue - rangeMin);
      // }
    }
  };

  const calculateRangePosition = (value: number, max: number): string => {
    return (value / max) * 100 + "%";
  };
  const handleFilterPrice = () => {
    if (minRange > maxRange) {
      toast.warning("Giá nhỏ nhất không được lớn hơn giá lớn nhất");
    } else {
      const currentParams = Object.fromEntries(searchParams.entries()); // Lấy các tham số hiện tại
      const updatedParams = {
        ...currentParams, // Giữ nguyên các tham số hiện có
        minPrice: minRange.toString(),
        maxPrice: maxRange.toString(),
        page: "1",
      };
      setSearchParams(updatedParams);
    }
  };
  return (
    <>
      <PriceFilter>
        <FilterTitle className="filter-title flex items-center justify-between" onClick={() => toggleFilter("price")}>
          <p className="filter-title-text text-gray-150 text-base font-semibold text-lg">Giá</p>
          <span className={`text-gray-150 text-xl filter-title-icon ${!isPriceFilterOpen ? "rotate" : ""}`}>
            <i className="bi bi-chevron-up"></i>
          </span>
        </FilterTitle>
        <FilterWrap className={`range filter-wrap ${!isPriceFilterOpen ? "hide" : "show"}`}>
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
            <input type="number" className="text-center" name="min" value={minRange} onChange={handleInputChange} />
            <input type="number" className="text-center" name="max" value={maxRange} onChange={handleInputChange} />
          </div>
          <BaseBtnGreen onClick={handleFilterPrice}>Xác nhận</BaseBtnGreen>
        </FilterWrap>
      </PriceFilter>
    </>
  );
};

export default SetupFilterPrice;
