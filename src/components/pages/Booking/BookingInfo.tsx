import styled from "styled-components";
import { Input } from "@styles/form";
import { BaseButtonGreen } from "@styles/button";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { useEffect, useState } from "react";
import { getAllDistrict, getAllProvince, getAllWard } from "@redux/slices/addressSlice";
import { CartItem } from "@redux/slices/cartSlice";
// import { createPayment } from '@redux/slices/paymentSlice';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "@redux/slices/userSlice";
import { createOrder } from "@redux/slices/orderSlice";
import { createShipment } from "@redux/slices/shipmentSlice";

const BillingOrderWrapper = styled.div`
  gap: 60px;

  @media (max-width: ${breakpoints.xl}) {
    gap: 40px;
  }
  @media (max-width: ${breakpoints.lg}) {
    gap: 30px;
    grid-template-columns: 100%;
  }
`;

const BillingDetailsWrapper = styled.div`
  @media (max-width: ${breakpoints.lg}) {
    order: 2;
  }

  .checkout-form {
    margin-top: 24px;

    .input-elem {
      margin-bottom: 16px;

      @media (max-width: ${breakpoints.xs}) {
        margin-bottom: 10px;
      }

      label {
        margin-bottom: 8px;
        display: block;
      }

      input,
      select {
        height: 45px;
        border-radius: 4px;
        /* background: ${defaultTheme.color_whitesmoke}; */
        padding-left: 12px;
        padding-right: 12px;
        width: 100%;
        border: 1px solid ${defaultTheme.color_platinum};
        font-size: 12px;

        &::placeholder {
          font-size: 12px;
        }
      }
    }

    .elem-col-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      column-gap: 24px;

      @media (max-width: ${breakpoints.lg}) {
        column-gap: 12px;
      }
      @media (max-width: ${breakpoints.sm}) {
        grid-template-columns: 100%;
      }
    }

    .elem-col-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 24px;

      @media (max-width: ${breakpoints.lg}) {
        column-gap: 12px;
      }
      @media (max-width: ${breakpoints.sm}) {
        grid-template-columns: 100%;
      }
    }

    .input-check-group {
      column-gap: 10px;
      margin-top: 16px;
    }
    .contd-delivery-btn {
      margin-top: 20px;

      @media (max-width: ${breakpoints.sm}) {
        width: 100%;
      }
    }
  }
`;
const isEmptyValue = (value: string) => {
  return !value || value.trim().length < 1;
};
const isPhoneNumberValid = (phone: string) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};
const BookingInfo = () => {
  const dispatch = useAppDispatch();
  const listProvince = useAppSelector((state) => state.address.listProvince);
  const listDistrict = useAppSelector((state) => state.address.listDistrict);
  const listWard = useAppSelector((state) => state.address.listWard);
  const isLoadingOrder = useAppSelector((state) => state.order.isLoading);
  const cart = useAppSelector((state) => state.cart.cartselected);
  const ship = useAppSelector((state) => state.shipment.ship);
  const [idProvice, setIdProvince] = useState({ id: "0", name: "chon tinh" });
  const [district, setDistrict] = useState({ id: "0", name: "", city_id: "" });
  const [ward, setWard] = useState({ id: "0", name: "" });

  const initFormValue = {
    phone: "",
    customer_name: "",
    street: "",
    district: "",
    province: "",
    ward: "",
    CartItem: [],
    ShipCost: 0,
    VoucherId: null,
    Address: "",
    PaymentMethod: "VnPay",
  };
  type DataCheckOut = {
    cartItem: string[];
    shipCost: number;
    address: string;
    voucherId: string | null;
    paymentMethod: string;
    phoneNumber: string;
    name: string;
  };
  const [formValue, setFormValue] = useState(initFormValue);
  const [formError, setFormError] = useState({
    name: "",
    phone: "",
    street: "",
    province: "",
    district: "",
    ward: "",
  });
  useEffect(() => {
    dispatch(getAllProvince());
    if (idProvice.id != "0") {
      dispatch(getAllDistrict(idProvice.id));
    }
    if (district.id != "0") {
      dispatch(getAllWard(district.id));
    }
  }, [idProvice.id, district.id]);
  const validateForm = () => {
    const errors = {
      name: "",
      phone: "",
      street: "",
      province: "",
      district: "",
      ward: "",
    };
    let check = true;
    if (isEmptyValue(formValue.customer_name)) {
      errors.name = "Tên không được để trống !";
      check = false;
    }

    if (isEmptyValue(formValue.phone)) {
      errors.phone = "Số điện thoại không được bỏ trống";
      check = false;
    } else if (!isPhoneNumberValid(formValue.phone)) {
      errors.phone = "Vui lòng nhập đúng số điện thoại !";
      check = false;
    }
    if (isEmptyValue(formValue.street)) {
      errors.street = "Tên đường không được để trống !";
      check = false;
    }
    if (!formValue.province) {
      errors.province = "Vui lòng chọn Tỉnh !";
      check = false;
    }
    if (!formValue.district) {
      errors.district = "Vui lòng chọn Huyện !";
      check = false;
    }
    if (!formValue.ward) {
      errors.district = "Vui lòng chọn Phường !";
      check = false;
    }
    setFormError(errors);
    return check;
  };
  return (
    <BillingOrderWrapper className="billing-and-order grid items-start">
      <BillingDetailsWrapper>
        <h4 className="text-xxl font-bold text-outerspace">Thông tin khách hàng</h4>
        <div className="checkout-form">
          <div className="input-elem-group elem-col-2">
            <div className="input-elem">
              <label htmlFor="" className="text-base text-outerspace font-semibold">
                Tên*
              </label>
              <Input
                type="text"
                placeholder="Tên"
                value={formValue.customer_name}
                onChange={(e) => setFormValue({ ...formValue, customer_name: e.target.value })}
              />
              {formError.name && <div className="text-red text-sm">{formError.name}</div>}
            </div>
            <div className="input-elem">
              <label htmlFor="" className="text-base text-outerspace font-semibold">
                SĐT*
              </label>
              <Input
                type="text"
                placeholder="SĐT"
                value={formValue.phone}
                onChange={(e) => setFormValue({ ...formValue, phone: e.target.value })}
              />
              {formError.phone && <div className="text-red text-sm">{formError.phone}</div>}
            </div>
          </div>
          <div className="input-elem-group elem-col-3">
            <div className="input-elem">
              <label htmlFor="" className="text-base text-outerspace font-semibold">
                Tỉnh*
              </label>
              <select
                id="Tinh"
                value={JSON.stringify(idProvice)}
                onChange={(e) => {
                  setIdProvince(JSON.parse(e.target.value));
                  setFormValue({ ...formValue, province: JSON.parse(e.target.value).name });
                }}
                className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Chọn tỉnh ...</option>
                {listProvince.map((province, index) => {
                  return (
                    <option
                      key={index}
                      value={JSON.stringify({
                        id: province.id,
                        name: province.name,
                      })}
                    >
                      {province.name}
                    </option>
                  );
                })}
              </select>
              {formError.province && <div className="text-red text-sm">{formError.province}</div>}
            </div>
            <div className="input-elem">
              <label htmlFor="" className="text-base text-outerspace font-semibold">
                Huyện/Thành phố*
              </label>
              <select
                id="huyen"
                value={JSON.stringify(district)}
                onChange={(e) => {
                  setDistrict(JSON.parse(e.target.value));
                  setFormValue({ ...formValue, district: JSON.parse(e.target.value).name });
                  dispatch(
                    createShipment({
                      district: JSON.parse(e.target.value).id,
                      city: JSON.parse(e.target.value).city_id,
                      amount: cart.reduce((a: number, b: CartItem) => a + b.price, 0),
                    })
                  );
                }}
                className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Chọn huyện ...</option>
                {listDistrict.map((district, index) => {
                  return (
                    <option
                      key={index}
                      value={JSON.stringify({
                        id: district.id,
                        name: district.name,
                        city_id: district.city_id,
                      })}
                    >
                      {district.name}
                    </option>
                  );
                })}
              </select>
              {formError.district && <div className="text-red text-sm">{formError.district}</div>}
            </div>
            <div className="input-elem">
              <label htmlFor="" className="text-base text-outerspace font-semibold">
                Phường/Xã*
              </label>
              <select
                id="Phuong"
                value={JSON.stringify(ward)}
                onChange={(e) => {
                  setWard(JSON.parse(e.target.value));
                  setFormValue({ ...formValue, ward: JSON.parse(e.target.value).name });
                }}
                className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Chọn phường ...</option>
                {listWard.map((ward, index) => {
                  return (
                    <option
                      key={index}
                      value={JSON.stringify({
                        id: ward.id,
                        name: ward.name,
                      })}
                    >
                      {ward.name}
                    </option>
                  );
                })}
              </select>
              {formError.ward && <div className="text-red text-sm">{formError.ward}</div>}
            </div>
          </div>
          <div className="input-elem-group elem-col-1">
            <div className="input-elem">
              <label htmlFor="" className="text-base text-outerspace font-semibold">
                Số nhà, tên đường*
              </label>
              <Input
                type="text"
                placeholder="Đường"
                value={formValue.street}
                onChange={(e) => setFormValue({ ...formValue, street: e.target.value })}
              />
              {formError.street && <div className="text-red text-sm">{formError.street}</div>}
            </div>
          </div>
        </div>
      </BillingDetailsWrapper>
    </BillingOrderWrapper>
  );
};

export default BookingInfo;
