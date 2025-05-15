import { Section } from "@styles/styles";
import Title from "@common/Title";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { useEffect } from "react";
import SetupListShopPage from "./SetupListShopPage";
import { getAllSetupPackagesSimilar } from "@redux/slices/setupSlice";

const SetupSimilar = () => {
  const setupData = useAppSelector((state) => state.setupPackageDetail.data);
  const listSetupShop = useAppSelector((state) => state.setupPackage.setupPackages);

  let listSetupSimilar;
  if (setupData) {
    listSetupSimilar = listSetupShop?.filter((s) => s.setupPackageId !== setupData.setupPackageId);
  }
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllSetupPackagesSimilar());
  }, []);
  return (
    <Section>
      <Title titleText={"Các sản phẩm liên quan"} />
      {Array.isArray(listSetupSimilar) && listSetupSimilar.length > 0 ? (
        <SetupListShopPage setups={listSetupSimilar} />
      ) : (
        <>Không có sản phẩm nào</>
      )}
    </Section>
  );
};

export default SetupSimilar;
