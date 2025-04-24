import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { ListItemIcon, ListItemText, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import 'flowbite';
import { Product, selectProduct } from '@redux/slices/productSlice';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ConfirmDeleteProduct from '../popup_modal/ConfirmDeleteProduct';
import ConfirmActivateProduct from '../popup_modal/ConfirmActivateProduct';
import { useAppDispatch } from '@redux/hook';

const ITEM_HEIGHT = 48;
type ProductPopupProps = {
    product: Product;
    setIsModalEditOpen: (isOpen: boolean) => void;
};
export default function ProductPopup({ product, setIsModalEditOpen }: ProductPopupProps) {
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
                        dispatch(selectProduct(product));
                    }}
                >
                    <ListItemIcon>
                        <EditOutlinedIcon fontSize="small" className="text-yellow-300" />
                    </ListItemIcon>
                    <ListItemText>Chỉnh sửa</ListItemText>
                </MenuItem>
                {product && product.status === 'Unavailable' ? (
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
                        <ListItemText>Ngừng bán</ListItemText>
                    </MenuItem>
                )}
            </Menu>
            <ConfirmDeleteProduct
                isModalOpenDelete={isModalOpenDelete}
                setIsModalOpenDelete={setIsModalOpenDelete}
                product={product}
            />
            <ConfirmActivateProduct
                isModalOpenActivate={isModalOpenActivate}
                setIsModalOpenActivate={setIsModalOpenActivate}
                product={product}
            />
        </div>
    );
}
