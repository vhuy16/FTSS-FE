import * as React from "react";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { getAllProduct } from "@redux/slices/productSlice";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { useLocation, useSearchParams } from "react-router-dom";

export default function PaginationSetup() {
  const [pages, setPages] = React.useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const total_page = useAppSelector((state) => state.setupPackage.setupPackagesShop.totalPages);
  const location = useLocation();
  const k = location.search;
  const queryString = k.split("?")[1];
  const params = new URLSearchParams(queryString);
  const pageCurrent = params.get("page");
  useEffect(() => {
    if (!pageCurrent) {
      setPages(1);
    }
  }, [pageCurrent]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const currentParams = Object.fromEntries(searchParams.entries()); // Lấy các tham số hiện tại
    const updatedParams = {
      ...currentParams, // Giữ nguyên các tham số hiện có
      page: value.toString(),
      size: "6",
    };
    setSearchParams(updatedParams);
    // dispatch(getAllProduct({ page: value, size: 6 }));
    setPages(value);
    console.log("pagevalue", value);
  };

  return (
    <Stack spacing={2} style={{ marginTop: "5rem" }}>
      <Pagination count={total_page} page={pages} onChange={handleChange} />
    </Stack>
  );
}
