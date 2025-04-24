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
import { Issue, selectIssue } from '@redux/slices/issueSlice';
import ConfirmDeleteIssue from '../popup_modal/ConfirmDeleteIssue';
import ConfirmActivateIssue from '../popup_modal/ConfirmActivateIssue';

const ITEM_HEIGHT = 48;
type IssuePopupProps = {
    issue: Issue;
    setIsModalEditOpen: (isOpen: boolean) => void;
};
export default function IssuePopup({ issue, setIsModalEditOpen }: IssuePopupProps) {
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
                        dispatch(selectIssue(issue));
                    }}
                >
                    <ListItemIcon>
                        <EditOutlinedIcon fontSize="small" className="text-yellow-300" />
                    </ListItemIcon>
                    <ListItemText>Chỉnh sửa</ListItemText>
                </MenuItem>
                {issue && issue.isDelete === true ? (
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
            <ConfirmDeleteIssue
                isModalOpenDelete={isModalOpenDelete}
                setIsModalOpenDelete={setIsModalOpenDelete}
                issue={issue}
            />
            <ConfirmActivateIssue
                isModalOpenActivate={isModalOpenActivate}
                setIsModalOpenActivate={setIsModalOpenActivate}
                issue={issue}
            />
        </div>
    );
}
