import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { ListItemIcon, ListItemText, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "flowbite";
import { useNavigate } from "react-router-dom";
import { Booking, selectBooking } from "@redux/slices/missionSlide";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import BlockIcon from "@mui/icons-material/Block";
import DoneIcon from "@mui/icons-material/Done";
import ConfirmRefundedBooking from "../popup_modal/ConfirmRefundedBooking";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useAppDispatch } from "@redux/hook";

const ITEM_HEIGHT = 48;
type bookingPopupProps = {
  booking: Booking;
  setIsModalEditOpen: (isOpen: boolean) => void;
  setIsModalDeleteOpen: (isOpen: boolean) => void;
};
export default function BookingPopup({ booking, setIsModalEditOpen, setIsModalDeleteOpen }: bookingPopupProps) {
  const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const open1 = Boolean(anchorEl1);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl1(null);
  };
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [isModalOpenActivate, setIsModalOpenActivate] = React.useState(false);
  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open1 ? "long-menu" : undefined}
        aria-expanded={open1 ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl1}
        open={open1}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "25ch",
            },
          },
        }}
      >
        <div>
          <MenuItem
            onClick={() => {
              navigate(`/listBooking/${booking.id}`);
              handleClose();
            }}
          >
            <ListItemIcon>
              <RemoveRedEyeOutlinedIcon fontSize="small" className="text-green-400" />
            </ListItemIcon>
            <ListItemText>Xem chi tiết</ListItemText>
          </MenuItem>
          {(booking.status === "NOTASSIGN" || booking.status === "NOTDONE") && (
            <MenuItem
              onClick={() => {
                handleClose();
                setIsModalEditOpen(true);
                dispatch(selectBooking(booking));
              }}
            >
              <ListItemIcon>
                <EditOutlinedIcon fontSize="small" className="text-yellow-300" />
              </ListItemIcon>
              <ListItemText>Chỉnh sửa</ListItemText>
            </MenuItem>
          )}
          {(booking.status === "NOTASSIGN" || booking.status === "PROCESSING" || booking.status === "NOTSTARTED") && (
            <MenuItem
              onClick={() => {
                handleClose();
                setIsModalDeleteOpen(true);
                dispatch(selectBooking(booking));
              }}
            >
              <ListItemIcon>
                <BlockIcon fontSize="small" className="text-red-600" />
              </ListItemIcon>
              <ListItemText>Hủy</ListItemText>
            </MenuItem>
          )}
          {((booking.status === "NOTASSIGN" && booking.payment?.paymentStatus === "Completed") ||
            (booking.status === "NOTDONE" && booking.payment?.paymentStatus === "Completed")) && (
            <MenuItem
              onClick={() => {
                navigate(`/addMissionBooking?bookingId=${booking.id}&scheduleDate=${booking.scheduleDate}`);
                handleClose();
              }}
            >
              <ListItemIcon>
                <AddIcon fontSize="small" className="text-yellow-600" />
              </ListItemIcon>
              <ListItemText>Thêm nhiệm vụ</ListItemText>
            </MenuItem>
          )}
          {booking.payment?.paymentStatus === "Refunding" && (
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
        </div>
      </Menu>

      <ConfirmRefundedBooking
        isModalOpenActivate={isModalOpenActivate}
        setIsModalOpenActivate={setIsModalOpenActivate}
        booking={booking}
      />
    </div>
  );
}
