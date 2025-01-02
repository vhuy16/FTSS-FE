import { CustomPrevArrowWrapper } from '@styles/slider';
import { BsChevronLeft } from 'react-icons/bs';

// Định nghĩa kiểu props cho component
interface CustomPreArrowProps {
    onClick?: () => void;
}

const CustomPrevArrow: React.FC<CustomPreArrowProps> = ({ onClick }) => {
    return (
        <CustomPrevArrowWrapper className="custom-prev-arrow" onClick={onClick}>
            <BsChevronLeft />
        </CustomPrevArrowWrapper>
    );
};

export default CustomPrevArrow;
