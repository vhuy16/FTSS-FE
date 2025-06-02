import styled from 'styled-components';
import { Container } from '@styles/styles';
import image from '@images/confirmed_img.svg';
import { BaseBtnGreen } from '@styles/button';
import { defaultTheme } from '@styles/themes/default';

const ConfirmScreenWrapper = styled.main`
    margin: 24px 0;

    .confirm-img {
        width: 240px;
        overflow: hidden;
    }

    .confirm-msg {
        border: 2px solid ${defaultTheme.color_outerspace};
        border-radius: 6px;
        padding: 24px 0;
        margin-top: 16px;
        max-width: 400px;
        gap: 12px;
    }
`;

const ConfirmScreen = () => {
    return (
        <ConfirmScreenWrapper className="page-py-spacing">
            <Container>
                <div className="confirm-content flex items-center justify-center flex-col">
                    <div className="confirm-img">
                        <img src={image} alt="" className="object-fit-cover" />
                    </div>
                    <div className="confirm-msg w-full flex flex-col justify-center items-center">
                        <p className="text-4xl font-semibold text-outerspace">Bạn đã thanh toán thành công</p>
                        <BaseBtnGreen
                            onClick={async () => {
                                window.location.href = '/';
                            }}
                        >
                            Tiếp tục mua hàng
                        </BaseBtnGreen>
                    </div>
                </div>
            </Container>
        </ConfirmScreenWrapper>
    );
};

export default ConfirmScreen;
