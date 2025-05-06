import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllProvince, getAllDistrict, getAllWard } from "../../../redux/slices/addressSlice";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FormGridWrapper, FormTitle } from "styles/form_grid";
import { Container } from "styles/styles";
import { staticImages } from "@ultils/images";
import { Input } from "@styles/form";
import { BaseButtonBlack } from "@styles/button";
import { createAccount } from "../../../redux/slices/registerSlice";
import Loading from "@components/atom/Loading/Loading";
import { breakpoints, defaultTheme } from "@styles/themes/default";

const SignUpScreenWrapper = styled.section`
  .form-separator {
    margin: 32px 0;
    column-gap: 18px;

    @media (max-width: ${breakpoints.lg}) {
      margin: 24px 0;
    }

    .separator-text {
      border-radius: 50%;
      min-width: 36px;
      height: 36px;
      background-color: ${defaultTheme.color_purple};
      position: relative;
    }

    .separator-line {
      width: 100%;
      height: 1px;
      background-color: ${defaultTheme.color_platinum};
    }
  }

  .form-elem-text {
    margin-top: -16px;
    display: block;
  }
`;

const initFormValue = {
  email: "",
  password: "",
  phoneNumber: "",
  first_name: "",
  last_name: "",
  province: "",
  district: "",
  street: "",
  gender: 0,
  userName: "",
  ward: "",
};

// Check empty
const isEmptyValue = (value: string) => {
  return !value || value.trim().length < 1;
};

// Check email
const isEmailValid = (email: string) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

const isPhoneNumberValid = (phone: string) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};
const isValidPassword = (password: string): boolean => {
  // Kiểm tra mật khẩu có ít nhất 8 ký tự, chứa ít nhất một chữ cái viết hoa và một chữ số
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

const Register = () => {
  const dispatch = useAppDispatch();
  const listProvince = useAppSelector((state) => state.address.listProvince);
  const listDistrict = useAppSelector((state) => state.address.listDistrict);
  const listWard = useAppSelector((state) => state.address.listWard);
  const isLoading = useAppSelector((state) => state.address.isLoading);
  const isError = useAppSelector((state) => state.address.isError);
  const isLoadingRegister = useAppSelector((state) => state.register.isLoading);
  const isErrorRegister = useAppSelector((state) => state.register.isError);
  const message = useAppSelector((state) => state.register.message);
  const [idProvice, setIdProvince] = useState({ id: "0", name: "chon tinh" });
  const [district, setDistrict] = useState({ id: "0", name: "", city_id: "" });
  const [ward, setWard] = useState({ id: "0", name: "" });
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getAllProvince());
    dispatch(getAllDistrict(idProvice.id));
  }, [idProvice.id]);
  useEffect(() => {
    dispatch(getAllProvince());
    if (idProvice.id != "0") {
      dispatch(getAllDistrict(idProvice.id));
    }
    if (district.id != "0") {
      dispatch(getAllWard(district.id));
    }
  }, [idProvice.id, district.id]);

  const [formValue, setFormValue] = useState(initFormValue);
  const [formError, setFormError] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    first_name: "",
    last_name: "",
    province: "",
    district: "",
    street: "",
    gender: 0,
    userName: "",
    ward: "",
  });

  // Xử lý validate
  const validateForm = () => {
    const errors = {
      email: "",
      password: "",
      phoneNumber: "",
      first_name: "",
      last_name: "",
      province: "",
      district: "",
      street: "",
      gender: 0,
      userName: "",
      ward: "",
    };
    let check = true;
    if (isEmptyValue(formValue.userName)) {
      errors.userName = "User Name không được bỏ trống !";
      check = false;
    }
    if (isEmptyValue(formValue.email)) {
      errors.email = "Email không được bỏ trống !";
      check = false;
    } else if (!isEmailValid(formValue.email)) {
      errors.email = "Vui lòng nhập đúng định dạng email !";
      check = false;
    }
    if (isEmptyValue(formValue.password)) {
      errors.password = "Mật khẩu không được bỏ trống";
      check = false;
    }
    // } else if (!isValidPassword(formValue.password)) {
    //   errors.password = "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm một chữ cái viết hoa và một chữ số";
    //   check = false;
    // }
    if (isEmptyValue(formValue.phoneNumber)) {
      errors.phoneNumber = "Số điện thoại không được bỏ trống";
      check = false;
    } else if (!isPhoneNumberValid(formValue.phoneNumber)) {
      errors.phoneNumber = "Vui lòng nhập đúng số điện thoại !";
      check = false;
    }
    if (isEmptyValue(formValue.first_name)) {
      errors.first_name = "Họ và tên đệm không được bỏ trống !";
      check = false;
    }
    if (isEmptyValue(formValue.last_name)) {
      errors.last_name = "Tên không được bỏ trống !";
      check = false;
    }
    if (isEmptyValue(formValue.street)) {
      errors.street = "Tên đường không được bỏ trống !";
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
      errors.ward = "Vui lòng chọn Phường/XãXã !";
      check = false;
    }
    setFormError(errors);
    return check;
  };

  const handleRegister = async () => {
    const check = validateForm();
    if (check) {
      const data = {
        email: formValue.email,
        address: formValue.street + ", " + formValue.ward + ", " + formValue.district + ", " + formValue.province,
        phoneNumber: formValue.phoneNumber,
        password: formValue.password,
        userName: formValue.userName,
        fullName: formValue.first_name + " " + formValue.last_name,
        gender: formValue.gender,
        cityId: idProvice.id,
        districtId: district.id,
        wardId: ward.id,
      };
      try {
        const res = await dispatch(createAccount(data)).unwrap();
        console.log("res", res);
        const userId = res.data.id;
        localStorage.setItem("userId", userId);
        if (res.message === "Customer account created successfully") {
          await toast.success("Vui lòng kiểm tra email của bạn để xác minh tài khoản");
          setTimeout(() => {
            navigate("/verify");
          }, 3000);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Form invalid");
    }
  };
  return (
    <SignUpScreenWrapper>
      <FormGridWrapper>
        <Container>
          <div className="form-grid-content">
            <div className="brand-img-wrap flex items-center justify-center">
              <img src={staticImages.login_image} className="object-fit-cover" />
            </div>
            <div className="form-grid-right">
              <FormTitle>
                <h3>Đăng ký</h3>
              </FormTitle>
              <div>
                <div className="w-full flex flex-col maxWidth550">
                  {message != "Customer account created successfully" ? (
                    <div className="text-red text-lg">{message}</div>
                  ) : (
                    <div className="text-green text-lg">Vui lòng kiểm tra email của bạn để xác minh tài khoản</div>
                  )}
                  <div className="w-full flex flex-col">
                    <Input
                      type="text"
                      name="userName"
                      onChange={(e) => {
                        setFormValue({ ...formValue, userName: e.target.value });
                      }}
                      placeholder="Tên đăng nhập"
                      className="w-full text-black py-3 my-2 bg-transparent border-b border-gray outline-none focus:outline-none"
                      required
                    />
                    <Input
                      type="email"
                      name="email"
                      onChange={(e) => {
                        setFormValue({ ...formValue, email: e.target.value });
                      }}
                      placeholder="Email"
                      className="w-full text-black py-3 my-2 bg-transparent border-b border-gray outline-none focus:outline-none"
                      required
                    />
                    {formError.email && <div className="text-red text-sm">{formError.email}</div>}
                    <Input
                      type="password"
                      name="password"
                      onChange={(e) => {
                        setFormValue({ ...formValue, password: e.target.value });
                      }}
                      placeholder="Mật khẩu"
                      className="w-full text-black py-3 my-2 bg-transparent border-b border-gray outline-none focus:outline-none"
                      required
                    />
                    {formError.password && <div className="text-red text-sm">{formError.password}</div>}
                    <Input
                      type="tel"
                      name="phoneNumber"
                      onChange={(e) => {
                        setFormValue({ ...formValue, phoneNumber: e.target.value });
                      }}
                      placeholder="Số điện thoại"
                      className="w-full text-black py-3 my-2 bg-transparent border-b border-gray outline-none focus:outline-none"
                      required
                    />
                    {formError.phoneNumber && <div className="text-red text-sm">{formError.phoneNumber}</div>}
                    <Input
                      type="text"
                      name="first_name"
                      onChange={(e) => {
                        setFormValue({ ...formValue, first_name: e.target.value });
                      }}
                      placeholder="Họ và tên đệm"
                      className="w-full text-black py-3 my-2 bg-transparent border-b border-gray outline-none focus:outline-none"
                      required
                    />
                    {formError.first_name && <div className="text-red text-sm">{formError.first_name}</div>}
                    <Input
                      type="text"
                      name="last_name"
                      id="last_name"
                      onChange={(e) => {
                        setFormValue({ ...formValue, last_name: e.target.value });
                      }}
                      placeholder="Tên"
                      className="w-full text-black py-3 my-2 bg-transparent border-b border-gray outline-none focus:outline-none"
                      required
                    />
                    {formError.last_name && <div className="text-red text-sm">{formError.last_name}</div>}

                    <label
                      htmlFor="gioiTinh"
                      className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
                    >
                      Giới Tính
                    </label>
                    <select
                      id="gioiTinh"
                      value={formValue.gender}
                      onChange={(e) => {
                        setFormValue({ ...formValue, gender: parseInt(e.target.value) });
                      }}
                      className="block w-full px-4 py-3 mb-2 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="0">Nam</option>
                      <option value="1">Nữ</option>
                    </select>
                    <label htmlFor="Tinh" className="form-elem-label">
                      Tỉnh
                    </label>
                    <select
                      id="Tinh"
                      value={JSON.stringify(idProvice)}
                      onChange={(e) => {
                        setIdProvince(JSON.parse(e.target.value));
                        setFormValue({
                          ...formValue,
                          province: JSON.parse(e.target.value).name,
                        });
                      }}
                      className="block w-full px-4 py-3 mb-2 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                    <label htmlFor="huyen" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">
                      Huyện
                    </label>
                    <select
                      id="huyen"
                      value={JSON.stringify(district)}
                      onChange={(e) => {
                        setDistrict(JSON.parse(e.target.value));
                        setFormValue({
                          ...formValue,
                          district: JSON.parse(e.target.value).name,
                        });
                      }}
                      className="block w-full px-4 py-3 mb-2 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option
                        value={JSON.stringify({
                          id: "",
                          name: "",
                        })}
                      >
                        Chọn huyện ...
                      </option>
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
                    <label htmlFor="phuong" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">
                      Phường/Xã*
                    </label>
                    <select
                      id="Phuong"
                      value={JSON.stringify(ward)}
                      onChange={(e) => {
                        setWard(JSON.parse(e.target.value));
                        setFormValue({ ...formValue, ward: JSON.parse(e.target.value).name });
                      }}
                      className="block w-full px-4 py-3 mb-2 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option
                        value={JSON.stringify({
                          id: "",
                          name: "",
                        })}
                      >
                        Chọn phường ...
                      </option>
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
                    <Input
                      type="text"
                      name="street"
                      id="street"
                      onChange={(e) => {
                        setFormValue({
                          ...formValue,
                          street: e.target.value,
                        });
                      }}
                      placeholder="Số nhà ,Tên đường"
                      className="w-full text-black py-3 my-2 bg-transparent border-b border-gray outline-none focus:outline-none  "
                      required
                    />
                    {formError.street && <div className="text-red text-sm">{formError.street}</div>}
                    <div className="w-full flex flex-col my-4">
                      <BaseButtonBlack type="submit" className="form-submit-btn" onClick={() => handleRegister()}>
                        {isLoadingRegister == true ? <Loading /> : "Đăng ký"}
                      </BaseButtonBlack>
                    </div>
                  </div>
                </div>
              </div>
              <p className="flex flex-wrap account-rel-text">
                Bạn đã có tài khoản ?
                <div
                  className="font-medium"
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Đăng nhập ngay tại đây !!
                </div>
              </p>
            </div>
          </div>
        </Container>
      </FormGridWrapper>
    </SignUpScreenWrapper>
  );
};
export default Register;
