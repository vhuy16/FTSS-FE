import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { formatDate } from "@ultils/helper";

import { Issue } from "@redux/slices/issueSlice";

interface IssueItemProps {
  issue: Issue;
}

const IssueItem: React.FC<IssueItemProps> = ({ issue }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
      onClick={() => navigate(`/issue-post/${issue.id}`)}
    >
      <div className="relative overflow-hidden">
        <img
          src={issue.issueImage}
          alt={issue.title}
          className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300 ease-in-out"
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <h2 className="text-4xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300 mb-2">
          {issue.title}
        </h2>
        <div
          className="text-lg text-gray-600 mb-4 flex-1"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 5,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {issue.description}
        </div>
        <div className="text-sm text-gray-800 mb-4">
          <span className="mr-1">Ngày tạo:</span>
          <span>{formatDate(issue.createDate)}</span>
        </div>
        <div className="text-sm bg-gray-100 inline-block px-3 py-1 rounded-full">{issue.issueCategoryName}</div>
      </div>
    </div>
  );
};

export default IssueItem;
