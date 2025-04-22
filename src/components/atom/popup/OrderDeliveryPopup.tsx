import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ListItemIcon, ListItemText, Typography } from '@mui/material';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import AddIcon from '@mui/icons-material/Add';
import { Order, selectOrder } from '@redux/slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import ConfirmEditStatusOrder from '../popup_modal/ConfirmEditStatusOrder';
import DoneIcon from '@mui/icons-material/Done';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import Popover from '@mui/material/Popover';
import Badge from '@components/ui/badge/Badge';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ConfirmRefundedOrder from '../popup_modal/ConfirmRefundedOrder';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useAppDispatch } from '@redux/hook';

const ITEM_HEIGHT = 48;
type OrderPopupProps = {
    order: Order;
    setIsModalEditOpen: (isOpen: boolean) => void;
};
export default function OrderDeliveryPopup({ order, setIsModalEditOpen }: OrderPopupProps) {
    const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
    const [isModalOpenEditStatus, setIsModalOpenEditStatus] = React.useState(false);
    const [isModalOpenActivate, setIsModalOpenActivate] = React.useState(false);
    const [status, setStatus] = React.useState('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
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
                {order.isAssigned === false && (
                    <MenuItem
                        onClick={() => {
                            handleClose();
                            setIsModalEditOpen(true);
                            dispatch(selectOrder(order));
                        }}
                    >
                        <ListItemIcon>
                            <EditOutlinedIcon fontSize="small" className="text-yellow-300" />
                        </ListItemIcon>
                        <ListItemText>Chỉnh sửa</ListItemText>
                    </MenuItem>
                )}
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
                    {(order.status === 'PROCESSING' || order.status === 'RETURN_ACCEPTED') && (
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

                    {(order.status === 'PROCESSING' || order.status === 'RETURN_ACCEPTED') && (
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
                {order.installationDate && order.status === 'PROCESSED' && (
                    <MenuItem
                        onClick={() => {
                            navigate(`/addMissionOrder?orderId=${order.id}&scheduleDate=${order.installationDate}`);
                            handleClose();
                        }}
                    >
                        <ListItemIcon>
                            <AddIcon fontSize="small" className="text-yellow-600" />
                        </ListItemIcon>
                        <ListItemText>Thêm nhiệm vụ</ListItemText>
                    </MenuItem>
                )}
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
