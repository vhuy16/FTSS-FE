import React from 'react';
import { TitleWrapper } from '@styles/styles';

// Định nghĩa kiểu dữ liệu cho props
interface TitleProps {
    titleText: string;
}

const Title: React.FC<TitleProps> = ({ titleText }) => {
    return (
        <TitleWrapper className="title">
            <h3>{titleText}</h3>
        </TitleWrapper>
    );
};

export default Title;
