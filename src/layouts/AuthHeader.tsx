import styled from 'styled-components';
import { HeaderMainWrapper, SiteBrandWrapper } from '@styles/header';
import { Container } from '@styles/styles';
import { staticImages } from '@ultils/images';
import { BaseLinkGreen, BaseLinkOutlineGreen } from '@styles/button';
import { breakpoints } from '@styles/themes/default';
import logo from '@images/logo2.png';

const ButtonGroupWrapper = styled.div`
    gap: 8px;
    @media (max-width: ${breakpoints.sm}) {
        button,
        a {
            min-width: 100px;
        }
    }
`;

const AuthHeader = () => {
    return (
        <HeaderMainWrapper className="flex items-center">
            <Container>
                <div className="header-wrap flex items-center justify-between">
                    <SiteBrandWrapper to="/" className="inline-flex">
                        <div className="brand-img-wrap flex items-center justify-center">
                            <img className="site-brand-img" src={logo} alt="logo" />
                        </div>
                        <span className="site-brand-text">FTSS</span>
                    </SiteBrandWrapper>
                    <div className="flex items-center">
                        <ButtonGroupWrapper className="flex items-center">
                            <BaseLinkGreen to="/login">Đăng nhập</BaseLinkGreen>
                            <BaseLinkOutlineGreen to="/register">Đăng ký</BaseLinkOutlineGreen>
                        </ButtonGroupWrapper>
                    </div>
                </div>
            </Container>
        </HeaderMainWrapper>
    );
};

export default AuthHeader;
