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
import { resetPassword } from "@redux/slices/resetPassword";

const ResetScreenWrapper = styled.section``;

export type resetPasswordType = {
  newPassword: string;
  comfirmPassword: string;
};
const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const isLoading = useAppSelector((state) => state.forgotPassword.loading);
  const isError = useAppSelector((state) => state.forgotPassword.error);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Xóa lỗi cũ trước

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không giống nhau!");
      return;
    }

    const data: resetPasswordType = {
      newPassword: newPassword,
      comfirmPassword: confirmPassword,
    };
    try {
      const res = await dispatch(resetPassword(data)).unwrap();
      toast.success("Thay đổi mật khẩu thành công ! Vui lòng đăng nhập lại.");
      navigate("/login");
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
              </FormTitle>

              <form onSubmit={handleSubmit}>
                <FormElement>
                  <label htmlFor="password" className="form-elem-label">
                    Mật khẩu
                  </label>
                  <Input
                    type="password"
                    placeholder="Nhập mật khẩu mới của bạn"
                    name="password"
                    className="form-elem-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </FormElement>
                <FormElement>
                  <label htmlFor="confirmPassword" className="form-elem-label">
                    Xác nhận mật khẩu
                  </label>
                  <Input
                    type="password"
                    placeholder="Xác nhận mật khẩu mới của bạn"
                    name="confirmPassword"
                    className="form-elem-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </FormElement>
                {error && <p className="error-text text-red">{error}</p>}
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

export default ResetPassword;
