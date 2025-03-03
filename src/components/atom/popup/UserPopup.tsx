import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ListItemIcon, ListItemText, Typography } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BlockIcon from '@mui/icons-material/Block';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Popover from '@mui/material/Popover';
import ConfirmDelete from '../popup_modal/ConfirmDelete';
import 'flowbite';
import ConfirmEditRole from '../popup_modal/ConfirmEditRole';
import { UserProfile } from '@redux/slices/userSlice';

const ITEM_HEIGHT = 48;
type UserPopupProps = {
    user: UserProfile;
};
export default function UserPopup({ user }: UserPopupProps) {
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
                        <BlockIcon fontSize="small" className="text-red-600" />
                    </ListItemIcon>
                    <ListItemText>Chặn</ListItemText>
                </MenuItem>

                <div>
                    <MenuItem onMouseEnter={handlePopoverOpen}>
                        <ListItemIcon>
                            <PersonOutlineIcon fontSize="small" className="text-blue-600" />
                        </ListItemIcon>
                        <ListItemText>Thay đổi vai trò</ListItemText>

                        <ListItemIcon className="flex justify-end">
                            <KeyboardArrowRightIcon fontSize="small" className="text-black" />
                        </ListItemIcon>
                        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}></Typography> */}
                    </MenuItem>
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
                                handleClose();
                                setNewRole('Customer');
                                setIsModalOpenEditRole(true);
                            }}
                        >
                            Customer
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleClose();
                                setNewRole('Manager');
                                setIsModalOpenEditRole(true);
                            }}
                        >
                            Manager
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleClose();
                                setNewRole('Technician');
                                setIsModalOpenEditRole(true);
                            }}
                        >
                            Technician
                        </MenuItem>
                    </Popover>
                </div>
            </Menu>
            <ConfirmDelete isModalOpenBan={isModalOpenBan} setIsModalOpenBan={setIsModalOpenBan} />
            <ConfirmEditRole
                user={user}
                newRole={newRole}
                isModalOpenEditRole={isModalOpenEditRole}
                setIsModalOpenEditRole={setIsModalOpenEditRole}
            />
        </div>
    );
}
