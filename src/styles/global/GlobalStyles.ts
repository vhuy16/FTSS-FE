import { createGlobalStyle } from "styled-components";
import { breakpoints, defaultTheme } from "../themes/default";

export const GlobalStyles = createGlobalStyle`
    * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        font-family: inherit;
    }

    html {
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -webkit-text-size-adjust: 100%;
    }
    body{
        min-height: 100vh;
        font-size: 14px;
        font-weight: 400;
        line-height: 1.6;
        font-family: ${defaultTheme.font_family_inter};
        color: ${defaultTheme.color_jet};
    }

    // common reset
    ul {
        list-style-type: none;
    }

    a {
        transition: ${defaultTheme.default_transition};
    }

    button {
        border: none;
        cursor: pointer;
        background-color: transparent;
        transition: ${defaultTheme.default_transition};
    }
    
    /* flexbox and grid */
    .flex {
        display: flex;
        &-col {
            flex-direction: column;
        }
        &-wrap {
            flex-wrap: wrap;
        }
    }

    .inline-flex {
        display: inline-flex;
    }

    .items {
        &-center {
            align-items: center;
        }
        &-start {
            align-items: flex-start;
        }
        &-end {
            align-items: flex-end;
        }
        &-stretch {
            align-items: stretch;
        }
        &-baseline{
            align-items: baseline;
        }
    }

    .justify {
        &-center {
            justify-content: center;
        }
        &-between {
            justify-content: space-between;
        }
        &-start {
            justify-content: flex-start;
        }
        &-end {
            justify-content: flex-end;
        }
    }

    .grid {
        display: grid;
    }
    .block {
        display: block;
    }

    .object-fit-cover {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        object-position: top;
    }
    .no-wrap {
        white-space: nowrap;
    }

    // heights and width
    .h-full {
        height: 100%;
    }

    .w-full {
        width: 100%;
    }


    .maxWidth550 {
        max-width: 550px;
    }
    .w-16 {
       max-width: 64px;
    }

    // font weights
    .font-light {
        font-weight: 300;
    }
    .font-normal {
        font-weight: 400;
    }
    .font-medium {
        font-weight: 500;
    }
    .font-semibold {
        font-weight: 600;
    }
    .font-bold {
        font-weight: 700;
    }
    .font-extrabold {
        font-weight: 800;
    }
    

    // text
    [class^="text"] {
        color: ${defaultTheme.color_outerspace};
    }

    .text-white {
        color: ${defaultTheme.color_white}!important;
    }
    .text-gray {
        color: ${defaultTheme.color_gray};
    }
    .text-black {
        color: ${defaultTheme.color_black};
    }
    .text-sea-green {
        color: ${defaultTheme.color_sea_green};
    }
    .text-red {
        color: ${defaultTheme.color_red};
    }
    .text-yellow {
        color: ${defaultTheme.color_yellow};
    }
    .text-outerspace {
        color: ${defaultTheme.color_outerspace};
    }
    .text-silver {
        color: ${defaultTheme.color_silver};
    }
    .text-green {
        color: ${defaultTheme.color_green_v1};
    }
    .text-start {
        text-align: left;
    }
    .text-end {
        text-align: right;
    }
    .text-underline {
        text-decoration: underline;
    }
    .text-center {
        text-align: center;
    }
    

    .uppercase {
        text-transform: uppercase;
    }
    .capitalize {
        text-transform: capitalize;
    }
    .italic {
        font-style: italic;
    }

    // backgrounds
    .bg-white {
        background-color: ${defaultTheme.color_white};
    }
    .bg-gray {
        background-color: ${defaultTheme.color_gray};
    }
    .bg-black {
        background-color: ${defaultTheme.color_black};
    }
    .bg-sea-green {
        background-color: ${defaultTheme.color_sea_green};
    }
    .bg-transparent {
        background-color: transparent;
    }
    .bg-outerspace {
        background-color: ${defaultTheme.color_outerspace};
    }
    .bg-silver{
        background-color: ${defaultTheme.color_silver};
    }
    .bg-black-50 {
    background-color: rgb(60, 66, 66);
}

    // page
    .page-py-spacing {
        padding-top: 48px !important;
        padding-bottom: 48px !important;

        @media(max-width: ${breakpoints.lg}){
            padding-top: 36px!important;
            padding-bottom: 36px!important;
        }

        @media(max-width: ${breakpoints.sm}){
            padding-top: 24px!important;
            padding-bottom: 24px!important;
        }
    }

    // typography
    a {
        text-decoration: none;
        color: ${defaultTheme.color_jet};
    }

    .text-xs {
        font-size: 12px;
    }
    .text-sm {
        font-size: 13px;
    }
    .text-base {
        font-size: 14px;
    }
    .text-lg {
        font-size: 15px;
    }
    .text-xl {
        font-size: 16px;
    }
    .text-xxl {
        font-size: 18px;
    }
    .text-3xl {
        font-size: 20px;
    }
    .text-4xl{
        font-size: 24px;
    }

    .title-sm{
        font-size: 20px;
        margin-bottom: 16px;
    }
    .text-title-2xsm {
    font-size: 0.63rem; /* Kích thước chữ 10px */
    font-weight: 600;    /* Đậm, nếu bạn muốn kiểu chữ tiêu đề */
    line-height: 3.2;    /* Chiều cao dòng (có thể tùy chỉnh) */
}

     // margin and padding 
    .m-0 { margin: 0; }
    .mt-0 { margin-top: 0; }
    .mr-0 { margin-right: 0; }
    .mb-0 { margin-bottom: 0; }
    .ml-0 { margin-left: 0; }
    .mx-0 { margin-left: 0; margin-right: 0; }
    .my-0 { margin-top: 0; margin-bottom: 0; }

    .m-1 { margin: 4px; }
    .mt-1 { margin-top: 4px; }
    .mr-1 { margin-right: 4px; }
    .mb-1 { margin-bottom: 4px; }
    .ml-1 { margin-left: 4px; }
    .mx-1 { margin-left: 4px; margin-right: 4px; }
    .my-1 { margin-top: 4px; margin-bottom: 4px; }

    .m-2 { margin: 8px; }
    .mt-2 { margin-top: 8px; }
    .mr-2 { margin-right: 8px; }
    .mb-2 { margin-bottom: 8px; }
    .ml-2 { margin-left: 8px; }
    .mx-2 { margin-left: 8px; margin-right: 8px; }
    .my-2 { margin-top: 8px; margin-bottom: 8px; }

    .m-4 { margin: 16px; }
    .mt-4 { margin-top: 16px; }
    .mr-4 { margin-right: 16px; }
    .mb-4 { margin-bottom: 16px; }
    .ml-4 { margin-left: 16px; }
    .mx-4 { margin-left: 16px; margin-right: 16px; }
    .my-4 { margin-top: 16px; margin-bottom: 16px; }

    .p-0 { padding: 0; }
    .pt-0 { padding-top: 0; }
    .pr-0 { padding-right: 0; }
    .pb-0 { padding-bottom: 0; }
    .pl-0 { padding-left: 0; }
    .px-0 { padding-left: 0; padding-right: 0; }
    .py-0 { padding-top: 0; padding-bottom: 0; }

    .p-1 { padding: 4px; }
    .pt-1 { padding-top: 4px; }
    .pr-1 { padding-right: 4px; }
    .pb-1 { padding-bottom: 4px; }
    .pl-1 { padding-left: 4px; }
    .px-1 { padding-left: 4px; padding-right: 4px; }
    .py-1 { padding-top: 4px; padding-bottom: 4px; }

    .p-2 { padding: 8px; }
    .pt-2 { padding-top: 8px; }
    .pr-2 { padding-right: 8px; }
    .pb-2 { padding-bottom: 8px; }
    .pl-2 { padding-left: 8px; }
    .px-2 { padding-left: 8px; padding-right: 8px; }
    .py-2 { padding-top: 8px; padding-bottom: 8px; }

    .p-3 { padding: 12px; }
    .pt-3 { padding-top: 12px; }
    .pr-3 { padding-right: 12px; }
    .pb-3 { padding-bottom: 12px; }
    .pl-3 { padding-left: 12px; }
    .px-3 { padding-left: 12px; padding-right: 12px; }
    .py-3 { padding-top: 12px; padding-bottom: 12px; }

    .p-4 { padding: 16px; }
    .pt-4 { padding-top: 16px; }
    .pr-4 { padding-right: 16px; }
    .pb-4 { padding-bottom: 16px; }
    .pl-4 { padding-left: 16px; }
    .px-4 { padding-left: 16px; padding-right: 16px; }
    .py-4 { padding-top: 16px; padding-bottom: 16px; }

    .mb-10 {
        margin-bottom: 40px;
    }
    .mt-7 {
        margin-top: 28px;
    }
    .ml-12 {
        margin-left: 50px;
    }
    // border styles (tailwind-like)
    .border {
        border: 1px solid ${defaultTheme.color_gray};
    }
    .border-2 {
        border: 2px solid ${defaultTheme.color_gray};
    }
    .border-4 {
        border: 4px solid ${defaultTheme.color_gray};
    }
    .border-gray {
        border-color: ${defaultTheme.color_gray};
    }
    .border-t {
        border-top: 1px solid ${defaultTheme.color_gray};
    }
    .border-b {
        border-bottom: 1px solid ${defaultTheme.color_gray};
    }
    .border-l {
        border-left: 1px solid ${defaultTheme.color_gray};
    }
    .border-r {
        border-right: 1px solid ${defaultTheme.color_gray};
    }
    .rounded {
        border-radius: 4px;
    }
    .rounded-lg {
        border-radius: 8px;
    }
    .rounded-full {
        border-radius: 9999px;
    }

    .border-dashed {
        border-style: dashed;
    }
    .border-solid {
        border-style: solid;
    }
    .border-none {
        border: none;
    }
    .border-gray {
        border-color:rgb(223, 222, 222);
    }
    // gap for flexbox/grid
    .gap-1 {
        gap: 4px;
    }
    .gap-2 {
        gap: 8px;
    }
    .gap-3 {
        gap: 12px;
    }
    .gap-4 {
        gap: 16px;
    }
    .gap-6 {
        gap: 24px;
    }
    .gap-8 {
        gap: 32px;
    }
    .gap-10 {
        gap: 40px;
    }
    // verify class
    .verifyclass {
  max-width: 28rem; /* max-w-md */
  margin-left: auto; /* mx-auto */
  margin-right: auto; /* mx-auto */
  margin-top: 3rem; /* mt-12 */
  margin-bottom: auto; /* my-auto */
  text-align: center; /* text-center */
}
.otpclass {
  width: 3.5rem; 
  height: 3.5rem; 
  text-align: center; 
  font-size: 1.5rem; 
  font-weight: 800; 
  color: #18181b; 
  background-color:rgb(228, 228, 228); 
  border: 1px solid transparent; 
  border-radius: 0.375rem; 
  padding: 1rem;
  outline: none; 
}

.otpclass:hover {
  border-color: #e2e8f0; 
}

.otpclass:focus {
  background-color: #ffffff; 
  border-color: #10ac97; 
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2); 
}
.cursor-pointer {
    cursor: pointer;
}
    @media screen and (max-width: 575.98px){
        .text-xs {
            font-size: 11px !important;
        }
        .text-sm {
            font-size: 12px !important;
        }
        .text-base {
            font-size: 13px !important;
        }
        .text-lg {
            font-size: 14px !important;
        }
        .text-xl {
            font-size: 15px !important;
        }
        .text-xxl {
            font-size: 17px !important;
        }
        .text-3xl {
            font-size: 19px !important;
        }
        .text-4xl{
            font-size: 22px!important;
        }
    }

    @media screen and (max-width: 420px) {
        .text-xs {
            font-size: 10px !important;
        }
        .text-sm {
            font-size: 11px !important;
        }
        .text-base {
            font-size: 12px !important;
        }
        .text-lg {
            font-size: 13px !important;
        }
        .text-xl {
            font-size: 14px !important;
        }
        .text-xxl {
            font-size: 16px !important;
        }
        .text-3xl {
            font-size: 18px !important;
        }
        .text-4xl{
            font-size: 20px!important;
        }
    }
`;
