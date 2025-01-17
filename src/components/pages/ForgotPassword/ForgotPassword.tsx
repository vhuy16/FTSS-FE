import styled from "styled-components";
import resetpass from "@images/Login-image.jpg";
import { Link, useNavigate } from "react-router-dom";
import { FormGridWrapper, FormTitle } from "styles/form_grid";
import { Container } from "styles/styles";
import { FormElement, Input } from "styles/form";
import { BaseButtonGreen } from "styles/button";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { useState } from "react";
import { forgotPassword } from "@redux/slices/forgotPasswordSlice";
import Loading from "../../atom/Loading/Loading";
import { toast } from "react-toastify";

const ResetScreenWrapper = styled.section``;

export type ForgotPassWord = {
  email: string;
};
const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const isLoading = useAppSelector((state) => state.forgotPassword.loading);
  const isError = useAppSelector((state) => state.forgotPassword.error);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data: ForgotPassWord = {
      email: email,
    };
    try {
      const res = await dispatch(forgotPassword(data)).unwrap();
      const messenger = res.message;
      if (messenger && messenger === "send otp successful") {
        toast.success("Mã xác minh đã được gửi đến địa chỉ email !!");
        navigate("/verify-forgot-password");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ResetScreenWrapper>
      <FormGridWrapper>
        <Container>
          <div className="form-grid-content">
            <div className="form-grid-left">
              <img src={resetpass} className="object-fit-cover" />
            </div>
            <div className="form-grid-right">
              <FormTitle>
                <h3>Thay đổi mật khẩu</h3>
                <p>Nhập email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.</p>
              </FormTitle>

              <form onSubmit={handleSubmit}>
                <FormElement>
                  <label htmlFor="email" className="form-elem-label">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Nhập email của bạn"
                    name="email"
                    className="form-elem-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormElement>
                <BaseButtonGreen type="submit" className="form-submit-btn">
                  {isLoading ? <Loading /> : <>Tiếp tục</>}
                </BaseButtonGreen>
              </form>
              {isError && <p className="error-text">Có lỗi xảy ra: {isError}</p>}
              <p className="flex flex-wrap account-rel-text">
                <Link to="/login" className="font-medium">
                  Quay lại đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </FormGridWrapper>
    </ResetScreenWrapper>
  );
};

export default ForgotPassword;
