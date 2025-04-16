import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ListItemIcon, ListItemText, Typography } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import Popover from '@mui/material/Popover';
import ConfirmDelete from '../popup_modal/ConfirmDelete';
import 'flowbite';
import ConfirmEditRole from '../popup_modal/ConfirmEditRole';
import { UserProfile } from '@redux/slices/userSlice';

import { useNavigate } from 'react-router-dom';
import Badge from '@components/ui/badge/Badge';
import ConfirmEditStatusOrder from '../popup_modal/ConfirmEditStatusOrder';
import DoneIcon from '@mui/icons-material/Done';
import ConfirmRefundedOrder from '../popup_modal/ConfirmRefundedOrder';
import { Order } from '@redux/slices/orderSlice';

const ITEM_HEIGHT = 48;
type OrderPopupProps = {
    order: Order;
};
export default function OrderPopup({ order }: OrderPopupProps) {
    const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
    const [isModalOpenEditStatus, setIsModalOpenEditStatus] = React.useState(false);
    const [isModalOpenActivate, setIsModalOpenActivate] = React.useState(false);
    const [status, setStatus] = React.useState('');
    const navigate = useNavigate();
    const open1 = Boolean(anchorEl1);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl1(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl1(null);
    };
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open1 ? 'long-menu' : undefined}
                aria-expanded={open1 ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreHorizIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl1}
                open={open1}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '25ch',
                        },
                    },
                }}
            >
                <MenuItem
                    onClick={() => {
                        navigate(`/listOrder/${order.id}`);
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <RemoveRedEyeOutlinedIcon fontSize="small" className="text-green-400" />
                    </ListItemIcon>
                    <ListItemText>Xem chi tiết</ListItemText>
                </MenuItem>
                {order.payment?.paymentStatus === 'Refunding' && (
                    <MenuItem
                        onClick={() => {
                            handleClose();
                            setIsModalOpenActivate(true);
                        }}
                    >
                        <ListItemIcon>
                            <DoneIcon fontSize="small" className="text-gray-400" />
                        </ListItemIcon>
                        <ListItemText>Xác nhận đã hoàn tiền</ListItemText>
                    </MenuItem>
                )}

                <div>
                    {order.status !== 'CANCELLED' &&
                        order.status !== 'RETURNED' &&
                        order.status !== 'RETURNING' &&
                        order.status !== 'COMPLETED' && (
                            <MenuItem onMouseEnter={handlePopoverOpen}>
                                <ListItemIcon>
                                    <UpdateOutlinedIcon fontSize="small" className="text-blue-600" />
                                </ListItemIcon>
                                <ListItemText>Cập nhật trạng thái</ListItemText>

                                <ListItemIcon className="flex justify-end">
                                    <KeyboardArrowRightIcon fontSize="small" className="text-black" />
                                </ListItemIcon>
                            </MenuItem>
                        )}

                    {order.status !== 'CANCELLED' &&
                        order.status !== 'RETURNED' &&
                        order.status !== 'RETURNING' &&
                        order.status !== 'COMPLETED' && (
                            <Popover
                                id="mouse-over-popover"
                                open={Boolean(anchorEl && document.body.contains(anchorEl))}
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right', // Xuất hiện bên phải
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left', // Xuất phát từ bên trái của Popover
                                }}
                                onClose={handlePopoverClose}
                                disableRestoreFocus
                                PaperProps={{
                                    sx: { marginLeft: '4px', marginTop: '4px' }, // Cách menu cha 1rem
                                }}
                                // Đóng Popover khi rời chuột
                            >
                                {order.status === 'PROCESSING' ? (
                                    <>
                                        <MenuItem
                                            onClick={() => {
                                                setStatus('PROCESSED');
                                                setIsModalOpenEditStatus(true);
                                                handleClose();
                                            }}
                                        >
                                            <Badge size="md" color="info">
                                                Đã xử lý
                                            </Badge>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                setStatus('CANCELLED');
                                                setIsModalOpenEditStatus(true);
                                                handleClose();
                                            }}
                                        >
                                            <Badge size="md" color="error">
                                                Hủy
                                            </Badge>
                                        </MenuItem>
                                    </>
                                ) : order.status === 'PROCESSED' ? (
                                    <>
                                        <MenuItem
                                            onClick={() => {
                                                setStatus('PENDING_DELIVERY');
                                                setIsModalOpenEditStatus(true);
                                                handleClose();
                                            }}
                                        >
                                            <Badge size="md" color="primary">
                                                Đang giao
                                            </Badge>
                                        </MenuItem>
                                    </>
                                ) : order.status === 'PENDING_DELIVERY' ? (
                                    <>
                                        <MenuItem
                                            onClick={() => {
                                                setStatus('COMPLETED');
                                                setIsModalOpenEditStatus(true);
                                                handleClose();
                                            }}
                                        >
                                            <Badge size="md" color="success">
                                                Hoàn tất
                                            </Badge>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                setStatus('RETURNED');
                                                setIsModalOpenEditStatus(true);
                                                handleClose();
                                            }}
                                        >
                                            <Badge size="md" color="dark">
                                                Đã hoàn trả
                                            </Badge>
                                        </MenuItem>
                                    </>
                                ) : order.status === 'RETURN_ACCEPTED' ? (
                                    <>
                                        <MenuItem
                                            onClick={() => {
                                                setStatus('RETURNED');
                                                setIsModalOpenEditStatus(true);
                                                handleClose();
                                            }}
                                        >
                                            <Badge size="md" color="dark">
                                                Đã hoàn trả
                                            </Badge>
                                        </MenuItem>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </Popover>
                        )}
                </div>
                <div>
                    {order.status === 'RETURNING' && (
                        <MenuItem onMouseEnter={handlePopoverOpen}>
                            <ListItemIcon>
                                <UpdateOutlinedIcon fontSize="small" className="text-blue-600" />
                            </ListItemIcon>
                            <ListItemText>Xác nhận hoàn trả</ListItemText>

                            <ListItemIcon className="flex justify-end">
                                <KeyboardArrowRightIcon fontSize="small" className="text-black" />
                            </ListItemIcon>
                        </MenuItem>
                    )}

                    {order.status === 'RETURNING' && (
                        <Popover
                            id="mouse-over-popover"
                            open={Boolean(anchorEl && document.body.contains(anchorEl))}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right', // Xuất hiện bên phải
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left', // Xuất phát từ bên trái của Popover
                            }}
                            onClose={handlePopoverClose}
                            disableRestoreFocus
                            PaperProps={{
                                sx: { marginLeft: '4px', marginTop: '4px' }, // Cách menu cha 1rem
                            }}
                            // Đóng Popover khi rời chuột
                        >
                            <MenuItem
                                onClick={() => {
                                    setStatus('RETURN_ACCEPTED');
                                    setIsModalOpenEditStatus(true);
                                    handleClose();
                                }}
                            >
                                <Badge size="md" color="success">
                                    Xác nhận
                                </Badge>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setStatus('COMPLETED');
                                    setIsModalOpenEditStatus(true);
                                    handleClose();
                                }}
                            >
                                <Badge size="md" color="error">
                                    Không xác nhận
                                </Badge>
                            </MenuItem>
                        </Popover>
                    )}
                </div>
            </Menu>

            <ConfirmEditStatusOrder
                order={order}
                status={status}
                isModalOpenEditStatus={isModalOpenEditStatus}
                setIsModalOpenEditStatus={setIsModalOpenEditStatus}
            />
            <ConfirmRefundedOrder
                isModalOpenActivate={isModalOpenActivate}
                setIsModalOpenActivate={setIsModalOpenActivate}
                order={order}
            />
        </div>
    );
}
