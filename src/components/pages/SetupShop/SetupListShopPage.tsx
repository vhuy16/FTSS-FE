import styled from "styled-components";
import { breakpoints } from "@styles/themes/default";
import { SetupPackage } from "@redux/slices/setupSlice";
import SetupItem from "./SetupItem";

type SetupListProps = {
  setups: SetupPackage[];
};

const SetupListWrapper = styled.div`
  column-gap: 20px;
  row-gap: 40px;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));

  @media (max-width: ${breakpoints.sm}) {
    gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

const SetupListShopPage: React.FC<SetupListProps> = ({ setups }) => {
  return (
    <div>
      <SetupListWrapper className="grid">
        {setups?.map((setup) => {
          return <SetupItem key={setup.setupPackageId} setup={setup} />;
        })}
      </SetupListWrapper>
    </div>
  );
};

export default SetupListShopPage;
