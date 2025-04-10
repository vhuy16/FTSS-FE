import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ListItemIcon, ListItemText, Typography } from '@mui/material';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import AddIcon from '@mui/icons-material/Add';
import { Order } from '@redux/slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import ConfirmEditStatusOrder from '../popup_modal/ConfirmEditStatusOrder';

const ITEM_HEIGHT = 48;
type OrderPopupProps = {
    order: Order;
};
export default function OrderDeliveryPopup({ order }: OrderPopupProps) {
    const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
    const [isModalOpenEditStatus, setIsModalOpenEditStatus] = React.useState(false);
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
                <MenuItem
                    onClick={() => {
                        navigate(`/addMissionOrder?orderId=${order.id}`);
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <AddIcon fontSize="small" className="text-yellow-600" />
                    </ListItemIcon>
                    <ListItemText>Thêm nhiệm vụ</ListItemText>
                </MenuItem>
            </Menu>

            <ConfirmEditStatusOrder
                order={order}
                status={status}
                isModalOpenEditStatus={isModalOpenEditStatus}
                setIsModalOpenEditStatus={setIsModalOpenEditStatus}
            />
        </div>
    );
}
