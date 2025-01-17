import styled from "styled-components";
import { staticImages } from "@ultils/images";
import { Link, useNavigate } from "react-router-dom";
import { defaultTheme } from "@styles/themes/default";
import { toast } from "react-toastify";

const SignOptions = styled.div`
  row-gap: 12px;

  .sign-option {
    column-gap: 12px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid ${defaultTheme.color_platinum};
    transition: ${defaultTheme.default_transition};

    &:hover {
      transform: translateY(2px);
      border-color: ${defaultTheme.color_white};
    }

    .sign-opt-icon {
      img {
        width: 18px;
      }
    }
  }
`;

const AuthOptions = () => {
  const navigate = useNavigate();

  const handleGoogleSignin = () => {
    const width = 500; // Chiều rộng của popup
    const height = 600; // Chiều cao của popup
    const left = Math.max((window.innerWidth - width) / 2, 0); // Căn giữa theo chiều ngang
    const top = Math.max((window.innerHeight - height) / 2, 0); // Căn giữa theo chiều dọc
    const popup = window.open(
      `https://ftss.id.vn/api/v1/google-auth/login`,
      "google-signin",
      `width=${width},height=${height},top=${top},resizable=yes,scrollbars=yes`
    );

    // Lắng nghe sự kiện 'message' từ popup
    window.addEventListener(
      "message",
      (event) => {
        if (event.origin !== "https://ftss.id.vn") {
          console.error("Nguồn không hợp lệ:", event.origin);
          return;
        }

        try {
          const { accessToken } = event.data;

          if (accessToken) {
            // Lưu token vào localStorage
            localStorage.setItem("access_token", accessToken);
            console.log(accessToken);
            navigate("/");
          }
        } catch (error) {
          console.error("Lỗi xử lý dữ liệu sau đăng nhập:", error);
          toast.error("Đã xảy ra lỗi khi xử lý dữ liệu sau đăng nhập.");
        }
      },
      false
    );
  };

  return (
    <SignOptions className="grid">
      <button className="sign-option flex items-center justify-center" onClick={handleGoogleSignin}>
        <span className="sign-opt-icon flex items-center justify-center">
          <img src={staticImages.google} />
        </span>
        <span className="sign-opt-text font-medium">Đăng nhập với Google</span>
      </button>
    </SignOptions>
  );
};

export default AuthOptions;
