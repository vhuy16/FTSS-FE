import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import logo from '@images/logo.png';

// Assume these icons are imported from an icon library
import { useSidebar } from '@context/SidebarContext';
import {
    BoxCubeIcon,
    CalenderIcon,
    ChevronDownIcon,
    GridIcon,
    HorizontaLDots,
    ListIcon,
    PageIcon,
    PieChartIcon,
    PlugInIcon,
    TableIcon,
    UserCircleIcon,
} from '@icons/admin_icon';
import { Link } from 'react-router-dom';

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
    {
        icon: <CalenderIcon />,
        name: 'Danh sách công việc',
        path: '/calenderIcon',
    },
    {
        icon: <ListIcon />,
        name: 'Danh sách đơn hàng',
        path: '/listOrder',
    },
    {
        icon: <TableIcon />,
        name: 'Danh sách sản phẩm',
        path: '/listProduct',
    },

    {
        icon: <BoxCubeIcon />,
        name: 'Các thiết kế bể cá',
        path: '/listSetup',
    },
];

const othersItems: NavItem[] = [
    {
        icon: <PieChartIcon />,
        name: 'Charts',
        subItems: [
            { name: 'Line Chart', path: '/line-chart', pro: false },
            { name: 'Bar Chart', path: '/bar-chart', pro: false },
        ],
    },
    {
        icon: <BoxCubeIcon />,
        name: 'UI Elements',
        subItems: [
            { name: 'Alerts', path: '/alerts', pro: false },
            { name: 'Avatar', path: '/avatars', pro: false },
            { name: 'Badge', path: '/badges', pro: false },
            { name: 'Buttons', path: '/buttons', pro: false },
            { name: 'Images', path: '/images', pro: false },
            { name: 'Videos', path: '/videos', pro: false },
        ],
    },
    {
        icon: <PlugInIcon />,
        name: 'Authentication',
        subItems: [
            { name: 'Sign In', path: '/signin', pro: false },
            { name: 'Sign Up', path: '/signup', pro: false },
        ],
    },
];

const ManagerSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const location = useLocation();

    const [openSubmenu, setOpenSubmenu] = useState<{
        type: 'main' | 'others';
        index: number;
    } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

    useEffect(() => {
        let submenuMatched = false;
        ['main', 'others'].forEach((menuType) => {
            const items = menuType === 'main' ? navItems : othersItems;
            items.forEach((nav, index) => {
                if (nav.subItems) {
                    nav.subItems.forEach((subItem) => {
                        if (isActive(subItem.path)) {
                            setOpenSubmenu({
                                type: menuType as 'main' | 'others',
                                index,
                            });
                            submenuMatched = true;
                        }
                    });
                }
            });
        });

        if (!submenuMatched) {
            setOpenSubmenu(null);
        }
    }, [location, isActive]);

    useEffect(() => {
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prevHeights) => ({
                    ...prevHeights,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = (index: number, menuType: 'main' | 'others') => {
        setOpenSubmenu((prevOpenSubmenu) => {
            if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
                return null;
            }
            return { type: menuType, index };
        });
    };

    const renderMenuItems = (items: NavItem[], menuType: 'main' | 'others') => (
        <ul className="flex flex-col gap-4">
            {items.map((nav, index) => (
                <li key={nav.name}>
                    {nav.subItems ? (
                        <button
                            onClick={() => handleSubmenuToggle(index, menuType)}
                            className={`menu-item group ${
                                openSubmenu?.type === menuType && openSubmenu?.index === index
                                    ? 'menu-item-active'
                                    : 'menu-item-inactive'
                            } cursor-pointer ${!isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'}`}
                        >
                            <span
                                className={`${
                                    openSubmenu?.type === menuType && openSubmenu?.index === index
                                        ? 'menu-item-icon-active'
                                        : 'menu-item-icon-inactive'
                                }`}
                            >
                                {nav.icon}
                            </span>
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <span className="menu-item-text">{nav.name}</span>
                            )}
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <ChevronDownIcon
                                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                                        openSubmenu?.type === menuType && openSubmenu?.index === index
                                            ? 'rotate-180 text-brand-500'
                                            : ''
                                    }`}
                                />
                            )}
                        </button>
                    ) : (
                        nav.path && (
                            <Link
                                to={nav.path}
                                className={`menu-item group ${
                                    isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'
                                }`}
                            >
                                <span
                                    className={`${
                                        isActive(nav.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive'
                                    }`}
                                >
                                    {nav.icon}
                                </span>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <span className="menu-item-text">{nav.name}</span>
                                )}
                            </Link>
                        )
                    )}
                    {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                        <div
                            ref={(el) => {
                                subMenuRefs.current[`${menuType}-${index}`] = el;
                            }}
                            className="overflow-hidden transition-all duration-300"
                            style={{
                                height:
                                    openSubmenu?.type === menuType && openSubmenu?.index === index
                                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                                        : '0px',
                            }}
                        >
                            <ul className="mt-2 space-y-1 ml-9">
                                {nav.subItems.map((subItem) => (
                                    <li key={subItem.name}>
                                        <Link
                                            to={subItem.path}
                                            className={`menu-dropdown-item ${
                                                isActive(subItem.path)
                                                    ? 'menu-dropdown-item-active'
                                                    : 'menu-dropdown-item-inactive'
                                            }`}
                                        >
                                            {subItem.name}
                                            <span className="flex items-center gap-1 ml-auto">
                                                {subItem.new && (
                                                    <span
                                                        className={`ml-auto ${
                                                            isActive(subItem.path)
                                                                ? 'menu-dropdown-badge-active'
                                                                : 'menu-dropdown-badge-inactive'
                                                        } menu-dropdown-badge`}
                                                    >
                                                        new
                                                    </span>
                                                )}
                                                {subItem.pro && (
                                                    <span
                                                        className={`ml-auto ${
                                                            isActive(subItem.path)
                                                                ? 'menu-dropdown-badge-active'
                                                                : 'menu-dropdown-badge-inactive'
                                                        } menu-dropdown-badge`}
                                                    >
                                                        pro
                                                    </span>
                                                )}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-whiteBlue dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`py-8 flex  ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}`}>
                <Link to="/" className="flex items-center">
                    {isExpanded || isHovered || isMobileOpen ? (
                        <>
                            <img className="dark:hidden inline-block " src={logo} alt="Logo" width={40} height={40} />
                            <span className="font-bold text-2xl ml-2 dark:hidden">FTSS</span>
                            <img
                                className="hidden dark:block inline-block"
                                src={logo}
                                alt="Logo"
                                width={40}
                                height={40}
                            />
                            <span className="hidden font-bold text-2xl ml-2 dark:block text-white">FTSS</span>
                        </>
                    ) : (
                        <img src={logo} alt="Logo" width={32} height={32} />
                    )}
                </Link>
            </div>
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                    !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
                                }`}
                            >
                                {isExpanded || isHovered || isMobileOpen ? 'Menu' : <HorizontaLDots />}
                            </h2>
                            {renderMenuItems(navItems, 'main')}
                        </div>
                    </div>
                </nav>
                {isExpanded || isHovered || isMobileOpen ? <></> : null}
            </div>
        </aside>
    );
};

export default ManagerSidebar;
