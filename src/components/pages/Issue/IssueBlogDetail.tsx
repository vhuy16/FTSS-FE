import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { FaUser, FaCalendar, FaShare } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { formatDate } from "@ultils/helper";
import { getDetailIssue } from "@redux/slices/issueSlice";
import LoadingPage from "@components/atom/Loading/LoadingPage";

const IssueBlogDetail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const issueDetail = useAppSelector((state) => state.issue.issueDetail);
  const isLoadingDetail = useAppSelector((state) => state.issue.isLoading);
  const [imageLoaded, setImageLoaded] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getDetailIssue(id as string));
  }, [dispatch, id]);
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      {isLoadingDetail ? (
        <LoadingPage />
      ) : (
        <article className="min-h-screen bg-gray-50">
          <div className="relative h-[80vh] w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
            <img
              src={issueDetail?.issueImage}
              alt="Header"
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 transition-all duration-300">
                  {issueDetail?.title}
                </h1>
                <div className="flex items-center space-x-6 text-gray-200">
                  <div className="flex items-center">
                    <FaUser className="mr-2" />
                    <span>{issueDetail?.issueCategoryName}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="mr-2" />
                    <span>{issueDetail?.modifiedDate ? formatDate(issueDetail.modifiedDate) : "Chưa cập nhật"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <main className="max-w-6xl mx-auto px-3 py-12">
            {issueDetail?.solutions.map((solution, index) => (
              <div key={solution.id} className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 hover:text-indigo-600 transition-all">
                  {solution.solutionName}
                </h2>
                {/* Render HTML từ backend */}
                <div
                  className="text-gray-700 mb-2 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: solution.description }}
                />
              </div>
            ))}
          </main>
        </article>
      )}
    </>
  );
};

export default IssueBlogDetail;
