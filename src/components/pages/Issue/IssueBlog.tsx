import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Container } from "@styles/styles";
import Breadcrumb from "@common/Breadcrumb";
import IssueCategory from "./IssueCategory";
import { getAllIssue } from "@redux/slices/issueSlice";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "@components/atom/Loading/Loading";
import IssueListPage from "./IssueListPage";
import PaginationIssue from "@components/atom/pagination/PaginationIssue";
const breadcrumbItems = [
  {
    label: "Trang chủ",
    link: "/",
  },
  { label: "Bài viết", link: "issue-post" },
];

const IssueBlog = () => {
  const dispatch = useAppDispatch();
  const listIssue = useAppSelector((state) => state.issue.data?.items);
  const isLoading = useAppSelector((state) => state.issue.isLoading);
  const location = useLocation();
  const k = location.search;
  const queryString = k.split("?")[1];
  const params = new URLSearchParams(queryString);
  const page = params.get("page") ?? "1";
  const size = params.get("size") ?? "6";
  const [isAscending] = useState(false);
  const issueCategoryId = params.get("issueCategoryId") ?? undefined;
  const issueTitle = params.get("issueTitle") ?? undefined;
  const [inputValue, setInputValue] = useState(issueTitle ?? ""); // chỉ để hiển thị
  const [searchQuery, setSearchQuery] = useState(issueTitle ?? ""); // để thực sự gọi API
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      getAllIssue({
        page: parseInt(page as string),
        size: parseInt(size as string),
        isAscending,
        issueCategoryId: searchQuery ? undefined : issueCategoryId || undefined,
        issueTitle: searchQuery,
      })
    );
  }, [page, size, isAscending, issueCategoryId, issueTitle]);

  return (
    <main className="page-py-spacing">
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-7">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="grid md:grid-cols-2 gap-6">
                  {isLoading ? (
                    <Loading></Loading>
                  ) : listIssue && listIssue.length > 0 ? (
                    <IssueListPage issues={listIssue} />
                  ) : (
                    <div>Không có bài viết nào</div>
                  )}
                </div>
                <div className="mt-20 flex justify-center">
                  <PaginationIssue></PaginationIssue>
                </div>
              </div>
              {/* Sidebar */}
              <div className="space-y-8">
                {/* Search Bar */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const updatedParams = new URLSearchParams(location.search);

                          // Cập nhật issueTitle
                          if (inputValue.trim()) {
                            updatedParams.set("issueTitle", inputValue.trim());
                            updatedParams.set("page", "1");
                            updatedParams.delete("issueCategoryId"); // Xoá cate khi search
                          } else {
                            updatedParams.delete("issueTitle");
                            updatedParams.set("page", "1");
                            updatedParams.delete("issueCategoryId");
                          }

                          // Cập nhật lên URL
                          navigate({
                            pathname: location.pathname,
                            search: `?${updatedParams.toString()}`,
                          });

                          // Cập nhật trigger gọi API
                          setSearchQuery(inputValue.trim());
                        }
                      }}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
                {/* Categories */}
                <IssueCategory />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default IssueBlog;
