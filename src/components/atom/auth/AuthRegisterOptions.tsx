import styled from "styled-components";
import { staticImages } from "@ultils/images";
import { defaultTheme } from "@styles/themes/default";
import { useAppDispatch } from "@redux/hook";
import { googleSignin } from "@redux/slices/registerSlice";

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
    .sign-opt-text {
      font-size: 14px;
    }
  }
`;

const AuthRegisterOptions = () => {
  const dispatch = useAppDispatch();
  const handleGoogleSignin = async () => {
    try {
      const res = await dispatch(googleSignin()).unwrap();
      console.log("Google Sign-In success:", res);
    } catch (error) {
      console.error("Google Sign-In failed:", error);
    }
  };

  return (
    <SignOptions className="grid">
      <button className="sign-option flex items-center justify-center" onClick={handleGoogleSignin}>
        <span className="sign-opt-icon flex items-center justify-center">
          <img src={staticImages.google} />
        </span>
        <span className="sign-opt-text font-medium">Đăng ký với Google</span>
      </button>
    </SignOptions>
  );
};

export default AuthRegisterOptions;
