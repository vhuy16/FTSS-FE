import styled from "styled-components";
import { Container } from "@styles/styles";
import Title from "@common/Title";
import Billing from "@components/atom/cart/Billing";
import { breakpoints, defaultTheme } from "@styles/themes/default";

const CheckoutScreenWrapper = styled.main`
  padding: 48px 0;
  .horiz-line-separator {
    height: 1px;
    background-color: ${defaultTheme.color_anti_flash_white};
    max-width: 818px;
    margin: 30px 0;

    @media (max-width: ${breakpoints.sm}) {
      margin: 20px 0;
    }
  }
`;

const CheckoutScreen = () => {
  return (
    <CheckoutScreenWrapper>
      <Container>
        <Title titleText={"Thông tin thanh toán"} />
        <Billing />
      </Container>
    </CheckoutScreenWrapper>
  );
};

export default CheckoutScreen;
