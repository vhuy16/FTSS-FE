import styled from "styled-components";
import { breakpoints, defaultTheme } from "./themes/default";

// common styles components

export const PageWrapper = styled.div`
  overflow: hidden !important;
`;

export const Container = styled.div`
  max-width: 1460px;
  padding: 0 16px !important;
  margin: 0 auto;
  width: 100%;
`;

export const Section = styled.section`
  padding: 40px 0;

  @media (max-width: ${breakpoints.lg}) {
    padding: 32px 0;
  }
`;

export const TitleWrapper = styled.div`
  margin-bottom: 24px;
  position: relative;
  padding-left: 32px;
  display: flex;
  align-items: center;
  font-family: "Inter", sans-serif;

  h2,
  h3,
  h4 {
    font-weight: 600;
    margin-bottom: 0 !important;
  }

  @media (max-width: ${breakpoints.lg}) {
    padding-left: 24px;
  }

  @media (max-width: ${breakpoints.sm}) {
    padding-left: 20px;
  }
  h3 {
    font-size: 28px;
    margin-bottom: 4px;
    @media (max-width: ${breakpoints.lg}) {
      font-size: 24px;
    }

    @media (max-width: ${breakpoints.sm}) {
      font-size: 20px;
    }
  }

  p {
    font-size: 18px;
  }
`;
export const HorizontalLine = styled.hr`
  border: none;
  height: 1px;
  background-color: #0000001a;
  margin: 24px 0;
`;
export const ContentStylings = styled.div`
  color: ${defaultTheme.color_gray};
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 16px 0 12px 0;
  }
  p {
    margin: 8px 0;
  }
  a {
    color: ${defaultTheme.color_sea_green};
    font-weight: 600;
  }
  span,
  p,
  ul,
  a {
    @media (max-width: ${breakpoints.lg}) {
      font-size: 13px !important;
    }
    @media (max-width: ${breakpoints.sm}) {
      font-size: 12px !important;
    }
  }
  h1,
  h2 {
    @media (max-width: ${breakpoints.lg}) {
      font-size: 17px !important;
    }
    @media (max-width: ${breakpoints.sm}) {
      font-size: 16px !important;
    }
  }
  h3,
  h4 {
    @media (max-width: ${breakpoints.lg}) {
      font-size: 16px !important;
    }
    @media (max-width: ${breakpoints.sm}) {
      font-size: 15px !important;
    }
  }
  h5,
  h6 {
    @media (max-width: ${breakpoints.lg}) {
      font-size: 15px !important;
    }
    @media (max-width: ${breakpoints.sm}) {
      font-size: 14px !important;
    }
  }
`;
