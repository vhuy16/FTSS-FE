import React, { useRef, useEffect, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FormGridWrapper, FormTitle } from "styles/form_grid";
import { Container } from "styles/styles";
import { staticImages } from "@ultils/images";
import { BaseButtonGreen } from "@styles/button";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { verifyAccount, verifyForgotPassword } from "../../../redux/slices/verifyAccountSlice";
import Loading from "@components/atom/Loading/Loading";

const VerificationScreenWrapper = styled.section``;
const VerifyOTP: React.FC = () => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.forgotPassword.data);
  const isLoading = useAppSelector((state) => state.verifyAccount.isLoading);
  const [countdown, setCountdown] = useState(30);
  const [isDisabled, setIsDisabled] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const inputs = inputsRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement;
      const index = inputs.indexOf(target);

      // Allow both numbers and letters (alphanumeric)
      if (
        !/^[a-zA-Z0-9]{1}$/.test(e.key) &&
        e.key !== "Backspace" &&
        e.key !== "Delete" &&
        e.key !== "Tab" &&
        !e.metaKey
      ) {
        e.preventDefault();
      }

      if (e.key === "Backspace") {
        if (target.value) {
          target.value = "";
        } else if (index > 0 && inputs[index - 1]) {
          inputs[index - 1]!.value = "";
          inputs[index - 1]!.focus();
        }
        e.preventDefault();
      }

      if (e.key === "Delete") {
        if (index < inputs.length - 1 && inputs[index + 1]) {
          inputs[index + 1]!.focus();
        }
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      target.value = target.value.toUpperCase(); // Automatically convert to uppercase
      const index = inputs.indexOf(target);
      if (target.value && index < inputs.length - 1 && inputs[index + 1]) {
        inputs[index + 1]!.focus();
      }
    };

    const handleFocus = (e: FocusEvent) => {
      (e.target as HTMLInputElement).select();
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData("text").toUpperCase(); // Convert pasted text to uppercase
      if (!new RegExp(`^[A-Z0-9]{${inputs.length}}$`).test(text || "")) {
        return;
      }
      const digits = text?.split("");
      inputs.forEach((input, index) => {
        if (input && digits) input.value = digits[index] || "";
      });
    };

    inputs.forEach((input) => {
      if (input) {
        input.addEventListener("input", handleInput);
        input.addEventListener("keydown", handleKeyDown);
        input.addEventListener("focus", handleFocus);
        input.addEventListener("paste", handlePaste);
      }
    });

    return () => {
      inputs.forEach((input) => {
        if (input) {
          input.removeEventListener("input", handleInput);
          input.removeEventListener("keydown", handleKeyDown);
          input.removeEventListener("focus", handleFocus);
          input.removeEventListener("paste", handlePaste);
        }
      });
    };
  }, []);
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsDisabled(false);
    }
  }, [countdown]);

  const handleResend = () => {
    setCountdown(30);
    setIsDisabled(true);
    // Gọi API gửi lại mã OTP ở đây
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const otpCode = inputsRef.current.map((input) => input?.value || "").join("");

    try {
      const data = {
        userId: userId as string,
        otp: otpCode,
      };
      const res = await dispatch(verifyForgotPassword(data)).unwrap();
      localStorage.setItem("access_token", res.data.token);
      const messenger = res.message;
      if (messenger && messenger === "Xác thực thành công") {
        toast.success("Xác thực thành công !!");
        navigate("/reset-password");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <VerificationScreenWrapper>
      <FormGridWrapper>
        <Container>
          <div className="form-grid-content">
            <div className="form-grid-left">
              <img src={staticImages.login_image} className="object-fit-cover" />
            </div>
            <div className="form-grid-right">
              <FormTitle>
                <div className="verifyclass">
                  <header className="mb-10">
                    <h1 className="text-2xl font-bold mb-4">Xác minh tài khoản</h1>
                    <p className="text-[15px] mb-4">Nhập mã xác minh gồm 6 kí tự đã được gửi tới email của bạn.</p>
                  </header>
                  <form id="otp-form">
                    <div className="flex items-center justify-center gap-3">
                      {[...Array(6)].map((_, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (inputsRef.current[idx] = el)}
                          type="text"
                          className="otpclass"
                          maxLength={1}
                        />
                      ))}
                    </div>
                    <div className="max-w-[260px] mx-auto mt-7">
                      <BaseButtonGreen
                        type="submit"
                        className="w-full inline-flex justify-center  px-3.5 py-2.5 text-sm font-medium text-white"
                        onClick={handleSubmit}
                      >
                        {isLoading == true ? <Loading /> : "Xác minh"}
                      </BaseButtonGreen>
                    </div>
                  </form>
                </div>
              </FormTitle>
              <div className="mt-6 flex">
                <p className="text-[15px] mr-2">Bạn chưa nhận được mã?</p>
                <button
                  className={`text-[15px] mr-3 transition-opacity duration-300 ${
                    isDisabled
                      ? "text-gray-400 opacity-50 cursor-not-allowed"
                      : "text-blue-600 font-bold underline cursor-pointer"
                  }`}
                  onClick={handleResend}
                  disabled={isDisabled}
                >
                  Gửi lại {isDisabled && `(${countdown} giây)`}
                </button>
              </div>
            </div>
          </div>
        </Container>
      </FormGridWrapper>
    </VerificationScreenWrapper>
  );
};

export default VerifyOTP;
