import { useAppDispatch, useAppSelector } from "@redux/hook";
import { getAllIssue } from "@redux/slices/issueSlice";
import React, { useEffect } from "react";
const IssueRecentPost = () => {
  const dispatch = useAppDispatch();
  const listIssuess = useAppSelector((state) => state.issue.data?.items);
  useEffect(() => {
    dispatch(
      getAllIssue({
        page: 0,
        size: 10,
        isAscending: false,
      })
    );
  }, []);
  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4">Các bài viết gần đây</h3>
        <div className="space-y-3">
          {listIssuess?.slice(0, 5).map((issues) => (
            <a
              key={issues.id}
              href="#"
              className="block text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-300"
            >
              {issues.title}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default IssueRecentPost;
