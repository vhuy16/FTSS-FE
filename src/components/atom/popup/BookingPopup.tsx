import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ListItemIcon, ListItemText, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import 'flowbite';
import { useNavigate } from 'react-router-dom';
import { Booking } from '@redux/slices/missionSlide';

const ITEM_HEIGHT = 48;
type bookingPopupProps = {
    booking: Booking;
};
export default function BookingPopup({ booking }: bookingPopupProps) {
    const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const open1 = Boolean(anchorEl1);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl1(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl1(null);
    };
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

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
            {booking.isAssigned === false && (
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
                    <div>
                        {booking.isAssigned === false && (
                            <MenuItem
                                onClick={() => {
                                    navigate(
                                        `/addMission?bookingId=${booking.id}&scheduleDate=${
                                            booking.scheduleDate.split('T')[0]
                                        }`,
                                    );
                                    handleClose();
                                }}
                            >
                                <ListItemIcon>
                                    <AddIcon fontSize="small" className="text-green-600" />
                                </ListItemIcon>
                                <ListItemText>Thêm nhiệm vụ</ListItemText>
                            </MenuItem>
                        )}
                    </div>
                </Menu>
            )}
        </div>
    );
}
