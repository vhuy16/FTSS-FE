import styled from "styled-components";
import { Input } from "@styles/form";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { useEffect, useState } from "react";
import { getAllDistrict, getAllProvince, getAllWard } from "@redux/slices/addressSlice";
import { Order } from "@redux/slices/orderSlice";

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
type BookingInfoProps = {
  setFormValues: (value: any) => void;
  formValues: {
    Address: string;
    phone: string;
    street: string;
    district: string;
    province: string;
    ward: string;
  };
  orderDetail: Order | null;
  setInfoDefault: (value: boolean) => void; // Hàm truyền từ cha
  infoDefault: boolean; // Giá trị infoDefault từ cha
};
const BookingInfo: React.FC<BookingInfoProps> = ({
  setFormValues,
  formValues,
  orderDetail,
  setInfoDefault,
  infoDefault,
}) => {
  const dispatch = useAppDispatch();
  const listProvince = useAppSelector((state) => state.address.listProvince);
  const listDistrict = useAppSelector((state) => state.address.listDistrict);
  const listWard = useAppSelector((state) => state.address.listWard);
  const [idProvice, setIdProvince] = useState({ id: "700000", name: "Hồ Chí Minh" });
  const [district, setDistrict] = useState({ id: "0", name: "", city_id: "" });
  const [ward, setWard] = useState({ id: "0", name: "" });

  const [formError, setFormError] = useState({
    name: "",
    phone: "",
    street: "",
    province: "",
    district: "",
    ward: "",
  });
  useEffect(() => {
    dispatch(getAllProvince()).then(() => {
      const defaultProvince = { id: "700000", name: "Hồ Chí Minh" };
      setIdProvince(defaultProvince);
      setFormValues((prev: any) => ({ ...prev, province: defaultProvince.name }));
    });
  }, []);

  useEffect(() => {
    if (idProvice.id != "0") {
      dispatch(getAllDistrict(idProvice.id));
    }
    if (district.id != "0") {
      dispatch(getAllWard(district.id));
    }
  }, [idProvice.id, district.id]);

  useEffect(() => {
    // Cập nhật formValues.province ngay khi component mount
    setFormValues((prev: any) => ({ ...prev, province: idProvice.name }));
  }, []);

  useEffect(() => {
    if (!infoDefault) {
      setFormValues({ ...formValues, customer_name: "", phone: "", Address: "", province: idProvice.name });
    } else {
      setFormValues({
        ...formValues,
        customer_name: orderDetail?.buyerName as string,
        phone: orderDetail?.phoneNumber as string,
        Address: orderDetail?.address as string,
      });
    }
  }, [infoDefault]);

  return (
    <BillingOrderWrapper className="billing-and-order grid items-start">
      <BillingDetailsWrapper>
        <h4 className="text-xxl font-bold text-outerspace">Thông tin khách hàng</h4>
        <div className="input-check-group flex items-center flex-wrap mt-2">
          <input
            id="default-checkbox"
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked={infoDefault}
            onChange={(e) => setInfoDefault(e.target.checked)}
          />
          <p className="text-base ml-4">Sử dụng thông tin mặc định của tài khoản</p>
        </div>
        <div className="checkout-form">
          <div className="input-elem-group elem-col-2">
            <div className="input-elem">
              <label htmlFor="" className="text-base text-outerspace font-semibold">
                SĐT*
              </label>
              <Input
                type="text"
                placeholder="SĐT"
                value={formValues.phone}
                onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
              />
              {formError.phone && <div className="text-red text-sm">{formError.phone}</div>}
            </div>
          </div>
          {/* //check in4 default  */}
          {!infoDefault ? (
            <div>
              <div className="input-elem-group elem-col-3">
                <div className="input-elem">
                  <label htmlFor="" className="text-base text-outerspace font-semibold">
                    Tỉnh*
                  </label>
                  <select
                    id="Tinh"
                    value={JSON.stringify(idProvice)}
                    onChange={(e) => {
                      const selectedProvince = JSON.parse(e.target.value);
                      setIdProvince(selectedProvince);
                      setFormValues((prev: any) => ({ ...prev, province: selectedProvince.name }));
                    }}
                    className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value={JSON.stringify(idProvice)}>{idProvice.name}</option>
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
                      setFormValues({ ...formValues, district: JSON.parse(e.target.value).name });
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
                      setFormValues({ ...formValues, ward: JSON.parse(e.target.value).name });
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
                    value={formValues.street}
                    onChange={(e) => setFormValues({ ...formValues, street: e.target.value })}
                  />
                  {formError.street && <div className="text-red text-sm">{formError.street}</div>}
                </div>
              </div>
            </div>
          ) : (
            <div className="input-elem-group elem-col-1">
              <div className="input-elem">
                <label htmlFor="" className="text-base text-outerspace font-semibold">
                  Địa chỉ*
                </label>
                <Input type="text" placeholder="Địa chỉ" value={formValues.Address} />
              </div>
            </div>
          )}
        </div>
      </BillingDetailsWrapper>
    </BillingOrderWrapper>
  );
};

export default BookingInfo;
