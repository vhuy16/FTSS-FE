import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { ListItemIcon, ListItemText, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import 'flowbite';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useAppDispatch } from '@redux/hook';
import { categoryType, selectCategory } from '@redux/slices/categorySlice';
import ConfirmActivateCategory from '../popup_modal/ConfirmActivateCategory';
import ConfirmDeleteCategory from '../popup_modal/ConfirmDeleteCategory';

const ITEM_HEIGHT = 48;
type CategoryPopupProps = {
    category: categoryType;
    setIsModalEditOpen: (isOpen: boolean) => void;
};
export default function CategoryPopup({ category, setIsModalEditOpen }: CategoryPopupProps) {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isModalOpenDelete, setIsModalOpenDelete] = React.useState(false);
    const [isModalOpenActivate, setIsModalOpenActivate] = React.useState(false);

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
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
                anchorEl={anchorEl}
                open={open}
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
                        setIsModalEditOpen(true);
                        dispatch(selectCategory(category));
                    }}
                >
                    <ListItemIcon>
                        <EditOutlinedIcon fontSize="small" className="text-yellow-300" />
                    </ListItemIcon>
                    <ListItemText>Chỉnh sửa</ListItemText>
                </MenuItem>
                {category && category.isDelete === true ? (
                    <MenuItem
                        onClick={() => {
                            handleClose();
                            setIsModalOpenActivate(true);
                        }}
                    >
                        <ListItemIcon>
                            <LockOpenIcon fontSize="small" className="text-green-500" />
                        </ListItemIcon>
                        <ListItemText>Kích hoạt</ListItemText>
                    </MenuItem>
                ) : (
                    <MenuItem
                        onClick={() => {
                            handleClose();
                            setIsModalOpenDelete(true);
                        }}
                    >
                        <ListItemIcon>
                            <BlockOutlinedIcon fontSize="small" className="text-red-600" />
                        </ListItemIcon>
                        <ListItemText>Ngưng hoạt động</ListItemText>
                    </MenuItem>
                )}
            </Menu>
            <ConfirmDeleteCategory
                isModalOpenDelete={isModalOpenDelete}
                setIsModalOpenDelete={setIsModalOpenDelete}
                category={category}
            />
            <ConfirmActivateCategory
                isModalOpenActivate={isModalOpenActivate}
                setIsModalOpenActivate={setIsModalOpenActivate}
                category={category}
            />
        </div>
    );
}
