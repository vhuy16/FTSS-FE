import styled from 'styled-components';
import { FormGridWrapper, FormTitle } from '@styles/form_grid';
import { Container } from '../../../styles/styles';
import { staticImages } from '@ultils/images';
import AuthOptions from '@components/atom/auth/AuthOptions';
import { FormElement, Input } from '../../../styles/form';
import PasswordInput from '@components/atom/auth/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { BaseButtonGreen } from '@styles/button';
import { breakpoints, defaultTheme } from '@styles/themes/default';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { loginUser } from '@redux/slices/loginSlice';
import Loading from '@components/atom/Loading/Loading';
import { toast } from 'react-toastify';

const SignInScreenWrapper = styled.section`
    .form-separator {
        margin: 32px 0;
        column-gap: 18px;

        @media (max-width: ${breakpoints.lg}) {
            margin: 24px 0;
        }

        .separator-text {
            border-radius: 50%;
            min-width: 36px;
            height: 36px;
            background-color: ${defaultTheme.color_sea_green};
            position: relative;
        }

        .separator-line {
            width: 100%;
            height: 1px;
            background-color: ${defaultTheme.color_platinum};
        }
    }

    .form-elem-text {
        margin-top: -16px;
        display: block;
    }
`;

export type LoginType = {
    username: string;
    password: string;
};
const Login = () => {
    const initFormValue = {
        username: '',
        password: '',
    };

    const isEmptyValue = (value: string) => {
        return !value || value.trim().length < 1;
    };
    const [formValue, setFormValue] = useState(initFormValue);
    const [formError, setFormError] = useState({
        username: '',
        password: '',
    });
    const dispatch = useAppDispatch();
    const messageLogin = useAppSelector((state) => state.login.message);
    const isLoadingLogin = useAppSelector((state) => state.login.isLoading);
    const navigate = useNavigate();
    const validateForm = () => {
        const errors = {
            username: '',
            password: '',
        };
        let check = true;
        if (isEmptyValue(formValue.username)) {
            errors.username = '*Tên đăng nhập không được bỏ trống.';
            check = false;
        }
        if (isEmptyValue(formValue.password)) {
            errors.password = '*Mật khẩu không được bỏ trống.';
            check = false;
        }
        setFormError(errors);
        return check;
    };
    const handleLogin = async () => {
        const check = validateForm();
        if (check) {
            const data: LoginType = {
                username: formValue.username,
                password: formValue.password,
            };
            try {
                const res = await dispatch(loginUser(data)).unwrap();
                const messenger = res.message;
                if (messenger && messenger === 'Login successful.') {
                    localStorage.setItem('access_token', res.data.token);
                    localStorage.setItem('role', res.data.roleEnum);
                    localStorage.setItem('userId', res.data.userId);
                    if (res.data.roleEnum === 'Customer') {
                        window.location.href = '/';
                    }
                    if (res.data.roleEnum === 'Admin') {
                        window.location.href = '/listUser';
                    }
                    if (res.data.roleEnum === 'Manager') {
                        window.location.href = '/dashboard';
                    }
                }
            } catch (error) {
                toast.error(error as string);
            }
        } else {
            console.log('Form invalid');
        }
    };
    return (
        <SignInScreenWrapper>
            <FormGridWrapper>
                <Container>
                    <div className="form-grid-content">
                        <div className="form-grid-left">
                            <img src={staticImages.login_image} className="object-fit-cover" />
                        </div>
                        <div className="form-grid-right">
                            <FormTitle>
                                <h3>Đăng nhập</h3>
                            </FormTitle>
                            <AuthOptions />
                            <div className="form-separator flex items-center justify-center">
                                <span className="separator-line"></span>
                                <span className="separator-text inline-flex items-center justify-center text-white">
                                    Or
                                </span>
                                <span className="separator-line"></span>
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault(); // Ngăn reload trang
                                    handleLogin();
                                }}
                            >
                                <FormElement>
                                    {messageLogin && messageLogin != 'Login successful.' && (
                                        <span className="form-elem-error text-end font-medium">*{messageLogin}</span>
                                    )}
                                    <label htmlFor="" className="form-elem-label">
                                        Tên đăng nhập
                                    </label>
                                    <Input
                                        type="text"
                                        name=""
                                        placeholder="Nhập tên đăng nhập"
                                        className="form-elem-control"
                                        onChange={(e) => {
                                            setFormValue({ ...formValue, username: e.target.value });
                                        }}
                                    />
                                    {formError.username && (
                                        <span className="form-elem-error text-end font-medium">
                                            {formError.username}
                                        </span>
                                    )}
                                </FormElement>
                                <PasswordInput
                                    fieldName="Mật khẩu"
                                    name="password"
                                    errorMsg={formError.password}
                                    formValue={formValue}
                                    setFormValue={setFormValue}
                                />
                                <Link to="/forgot-password" className="form-elem-text text-end font-medium">
                                    Quên mật khẩu ?
                                </Link>
                                <BaseButtonGreen className="form-submit-btn" onClick={handleLogin}>
                                    {isLoadingLogin ? <Loading /> : <>Đăng nhập</>}
                                </BaseButtonGreen>
                            </form>
                            <p className="flex flex-wrap account-rel-text">
                                Chưa có tài khoản?
                                <Link to="/register" className="font-medium">
                                    Đăng kí
                                </Link>
                            </p>
                        </div>
                    </div>
                </Container>
            </FormGridWrapper>
        </SignInScreenWrapper>
    );
};

export default Login;
