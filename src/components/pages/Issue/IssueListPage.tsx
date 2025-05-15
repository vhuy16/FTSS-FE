import { Issue } from "@redux/slices/issueSlice";
import IssueItem from "./IssueItem";

type IssueListProps = {
  issues: Issue[];
};

const IssueListPage: React.FC<IssueListProps> = ({ issues }) => {
  return (
    <>
      {issues?.map((issue) => {
        return <IssueItem key={issue.id} issue={issue} />;
      })}
    </>
  );
};

export default IssueListPage;
