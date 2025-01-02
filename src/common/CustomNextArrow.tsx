import { CustomNextArrowWrapper } from '@styles/slider';
import { BsChevronRight } from 'react-icons/bs';

// Định nghĩa kiểu props cho component
interface CustomNextArrowProps {
    onClick?: () => void;
}

const CustomNextArrow: React.FC<CustomNextArrowProps> = ({ onClick }) => {
    return (
        <CustomNextArrowWrapper className="custom-next-arrow" onClick={onClick}>
            <BsChevronRight />
        </CustomNextArrowWrapper>
    );
};

export default CustomNextArrow;
