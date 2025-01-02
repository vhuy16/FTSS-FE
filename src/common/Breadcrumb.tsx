import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { defaultTheme } from '@styles/themes/default';

// Type definition for breadcrumb items
interface BreadcrumbItemProps {
    label: string;
    link: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItemProps[];
}

const BreadcrumbWrapper = styled.nav`
    margin-bottom: 24px;

    .breadcrumb-separator {
        margin-left: 8px;
        margin-right: 8px;
    }

    .breadcrumb-item {
        transition: ${defaultTheme.default_transition};
        &:hover {
            color: ${defaultTheme.color_outerspace};
        }
    }
`;

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <BreadcrumbWrapper className="flex items-center flex-wrap">
            {items?.map((item, index) => (
                <BreadcrumbItem key={index} item={item} isLast={items.length - 1 === index} />
            ))}
        </BreadcrumbWrapper>
    );
};

export default Breadcrumb;

interface BreadcrumbItemComponentProps {
    item: BreadcrumbItemProps;
    isLast: boolean;
}

const BreadcrumbItem: React.FC<BreadcrumbItemComponentProps> = ({ item, isLast }) => {
    return (
        <>
            <Link
                to={item.link}
                className={`breadcrumb-item text-base ${
                    isLast ? 'text-outerspace font-semibold' : 'text-gray font-medium'
                }`}
            >
                {item.label}
            </Link>
            {!isLast && (
                <span className="breadcrumb-separator inline-flex text-xs">
                    <i className="bi bi-chevron-right"></i>
                </span>
            )}
        </>
    );
};
