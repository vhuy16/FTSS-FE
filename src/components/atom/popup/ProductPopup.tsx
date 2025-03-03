import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { ListItemIcon, ListItemText, Typography } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Popover from '@mui/material/Popover';
import ConfirmDelete from '../popup_modal/ConfirmDelete';
import 'flowbite';
import ConfirmEditRole from '../popup_modal/ConfirmEditRole';
import { UserProfile } from '@redux/slices/userSlice';

const ITEM_HEIGHT = 48;
type UserPopupProps = {
    user: UserProfile;
};
export default function ProductPopup({ user }: UserPopupProps) {
    const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
    const [isModalOpenBan, setIsModalOpenBan] = React.useState(false);
    const [isModalOpenEditRole, setIsModalOpenEditRole] = React.useState(false);
    const [newRole, setNewRole] = React.useState('');
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
                        handleClose();
                        setIsModalOpenBan(true);
                    }}
                >
                    <ListItemIcon>
                        <RemoveRedEyeOutlinedIcon fontSize="small" className="text-green-400" />
                    </ListItemIcon>
                    <ListItemText>Xem chi tiết</ListItemText>
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        handleClose();
                        setIsModalOpenBan(true);
                    }}
                >
                    <ListItemIcon>
                        <EditOutlinedIcon fontSize="small" className="text-yellow-300" />
                    </ListItemIcon>
                    <ListItemText>Chỉnh sửa</ListItemText>
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        handleClose();
                        setIsModalOpenBan(true);
                    }}
                >
                    <ListItemIcon>
                        <BlockOutlinedIcon fontSize="small" className="text-red-600" />
                    </ListItemIcon>
                    <ListItemText>Ngừng bán</ListItemText>
                </MenuItem>
            </Menu>
            {/* <ConfirmDelete isModalOpenBan={isModalOpenBan} setIsModalOpenBan={setIsModalOpenBan} />
            <ConfirmEditRole
                user={user}
                newRole={newRole}
                isModalOpenEditRole={isModalOpenEditRole}
                setIsModalOpenEditRole={setIsModalOpenEditRole}
            /> */}
        </div>
    );
}
