import styled from 'styled-components';
import { Container } from '@styles/styles';
import Breadcrumb from '@common/Breadcrumb';
import { UserContent, UserDashboardWrapper } from '@styles/user';
import UserMenu from '@atom/user/UserMenu';
import Title from '@common/Title';
import { FormElement, Input } from '@styles/form';
import { BaseLinkGreen } from '@styles/button';
import { Link } from 'react-router-dom';
import { breakpoints, defaultTheme } from '@styles/themes/default';
import { useAppSelector } from '@redux/hook';

const AccountScreenWrapper = styled.main`
    .address-list {
        margin-top: 20px;
        grid-template-columns: repeat(2, 1fr);
        gap: 25px;

        @media (max-width: ${breakpoints.lg}) {
            grid-template-columns: repeat(1, 1fr);
        }
    }

    .address-item {
        border-radius: 12px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        padding: 25px;
        row-gap: 8px;
    }

    .address-tags {
        gap: 12px;

        li {
            height: 28px;
            border-radius: 8px;
            padding: 2px 12px;
            background-color: ${defaultTheme.color_whitesmoke};
        }
    }

    .address-btns {
        margin-top: 12px;
        .btn-separator {
            width: 1px;
            border-radius: 50px;
            background: ${defaultTheme.color_platinum};
            margin: 0 10px;
        }
    }
`;

const breadcrumbItems = [
    {
        label: 'Trang chủ',
        link: '/',
    },
    { label: 'Hồ sơ', link: '/account' },
];

const Account = () => {
    const user = useAppSelector((state) => state.userProfile.user);

    return (
        <AccountScreenWrapper className="page-py-spacing">
            <Container>
                <Breadcrumb items={breadcrumbItems} />
                <UserDashboardWrapper>
                    <UserMenu />
                    <UserContent>
                        <Title titleText={'Hồ sơ của tôi'} />
                        <h4 className="title-sm">Thông tin chi tiết</h4>
                        <form>
                            <div className="form-wrapper">
                                <FormElement className="form-elem">
                                    <label htmlFor="" className="form-label font-semibold text-base">
                                        Tên
                                    </label>
                                    <div className="form-input-wrapper flex items-center">
                                        <Input
                                            type="text"
                                            className="form-elem-control text-outerspace font-semibold"
                                            value={user?.fullName}
                                            readOnly
                                        />
                                        <button type="button" className="form-control-change-btn">
                                            Chỉnh sửa
                                        </button>
                                    </div>
                                </FormElement>
                                <FormElement className="form-elem">
                                    <label htmlFor="" className="form-label font-semibold text-base">
                                        Email
                                    </label>
                                    <div className="form-input-wrapper flex items-center">
                                        <Input
                                            type="email"
                                            className="form-elem-control text-outerspace font-semibold"
                                            value={user?.email}
                                            readOnly
                                        />
                                        <button type="button" className="form-control-change-btn">
                                            Chỉnh sửa
                                        </button>
                                    </div>
                                </FormElement>
                                <FormElement className="form-elem">
                                    <label htmlFor="" className="form-label font-semibold text-base">
                                        Số điện thoại
                                    </label>
                                    <div className="form-input-wrapper flex items-center">
                                        <Input
                                            type="text"
                                            className="form-elem-control text-outerspace font-semibold"
                                            value={user?.phoneNumber}
                                            readOnly
                                        />
                                        <button type="button" className="form-control-change-btn">
                                            Chỉnh sửa
                                        </button>
                                    </div>
                                </FormElement>
                                <FormElement className="form-elem">
                                    <label htmlFor="" className="form-label font-semibold text-base">
                                        Mật Khẩu
                                    </label>
                                    <div className="form-input-wrapper flex items-center">
                                        <Input
                                            type="password"
                                            className="form-elem-control text-outerspace font-semibold"
                                            value="Pass Key"
                                            readOnly
                                        />
                                        <button type="button" className="form-control-change-btn">
                                            Chỉnh sửa
                                        </button>
                                    </div>
                                </FormElement>
                            </div>
                        </form>
                        <div>
                            <h4 className="title-sm">Địa chỉ</h4>
                            <BaseLinkGreen to="/account/add">Thêm địa chỉ</BaseLinkGreen>
                            <div className="address-list grid">
                                <div className="address-item grid">
                                    <p className="text-outerspace text-lg font-semibold address-title">
                                        {user?.address}
                                    </p>

                                    <ul className="address-tags flex flex-wrap">
                                        <li className="text-gray text-base font-medium inline-flex items-center justify-center">
                                            Địa chỉ nhận hàng mặc định
                                        </li>
                                    </ul>
                                    <div className="address-btns flex">
                                        <Link to="/" className="text-base text-outerspace font-semibold">
                                            Xóa
                                        </Link>
                                        <div className="btn-separator"></div>
                                        <Link to="/" className="text-base text-outerspace font-semibold">
                                            Sửa
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </UserContent>
                </UserDashboardWrapper>
            </Container>
        </AccountScreenWrapper>
    );
};

export default Account;
