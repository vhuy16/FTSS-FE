import styled from 'styled-components';
import { staticImages } from '@ultils/images';
import { Link } from 'react-router-dom';
import { defaultTheme } from '@styles/themes/default';

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
    return (
        <SignOptions className="grid">
            <Link to="/" className="sign-option flex items-center justify-center">
                <span className="sign-opt-icon flex items-center justify-center">
                    <img src={staticImages.google} />
                </span>
                <span className="sign-opt-text font-medium">Continue With Google</span>
            </Link>
        </SignOptions>
    );
};

export default AuthOptions;
