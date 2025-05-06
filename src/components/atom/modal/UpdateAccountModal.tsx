import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import Label from "@components/atom/form/Label";
import { Input } from "@styles/form";
import { getAllBank, updateBankInfo } from "@redux/slices/bankSlice";
import { toast } from "react-toastify";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import { updateProfile, UserProfile } from "@redux/slices/userSlice";
import Loading from "../Loading/Loading";
import { BaseBtnGreen, BaseButtonOuterspace } from "@styles/button";
import { getAllDistrict, getAllProvince, getAllWard } from "@redux/slices/addressSlice";

interface UpdateAccountModal {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
}

export const UpdateAccountModal = ({ isOpen, onClose, user }: UpdateAccountModal) => {
  const isLoadingUpdate = useAppSelector((state) => state.userProfile.isLoadingUpdate);
  const dispatch = useAppDispatch();
  const listProvince = useAppSelector((state) => state.address.listProvince);
  const listDistrict = useAppSelector((state) => state.address.listDistrict);
  const listWard = useAppSelector((state) => state.address.listWard);
  const [idProvice, setIdProvince] = useState({ id: "0", name: "" });
  const [district, setDistrict] = useState({ id: "0", name: "", city_id: "" });
  const [ward, setWard] = useState({ id: "0", name: "", district_id: "" });
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    role: "Customer",
    status: "available",
    isDelete: false,
    cityId: "",
    districtId: "",
    wardId: "",
    gender: "",
    address: "",
  });

  const [formValue, setFormValue] = useState({
    street: user?.address ? user.address.split(",")[0].trim() : "",
    province: "",
    provinceId: user?.cityId || null,
    district: "",
    districtId: user?.districtId || null,
    ward: "",
    wardId: user?.wardId || null,
  });

  // Load initial data for provinces
  useEffect(() => {
    dispatch(getAllProvince());
  }, [dispatch]);

  // Load districts when province changes
  useEffect(() => {
    if (idProvice.id !== "0") {
      dispatch(getAllDistrict(idProvice.id));
    }
  }, [idProvice.id, dispatch]);

  // Load wards when district changes
  useEffect(() => {
    if (district.id !== "0") {
      dispatch(getAllWard(district.id));
    }
  }, [district.id, dispatch]);

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        email: user.email || "",
        gender: user.gender || "",
        role: "Customer",
        status: "available",
        isDelete: false,
        cityId: user.cityId || "",
        districtId: user.districtId || "",
        wardId: user.wardId || "",
        address: user.address,
      });

      // Initialize province, district, and ward
      if (user.cityId && listProvince.length > 0) {
        const province = listProvince.find((p) => p.id === user.cityId);
        if (province) {
          setIdProvince(province);
          setFormValue((prev) => ({ ...prev, province: province.name, provinceId: province.id }));
        }
      }
    }
  }, [user, listProvince]);

  // Update district when user.districtId changes
  useEffect(() => {
    if (user?.districtId && listDistrict.length > 0) {
      const selectedDistrict = listDistrict.find((d) => d.id === user.districtId);
      if (selectedDistrict) {
        setDistrict(selectedDistrict);
        setFormValue((prev) => ({ ...prev, district: selectedDistrict.name, districtId: selectedDistrict.id }));
      }
    }
  }, [user?.districtId, listDistrict]);

  // Update ward when user.wardId changes
  useEffect(() => {
    if (user?.wardId && listWard.length > 0) {
      const selectedWard = listWard.find((w) => w.id.toString() === user.wardId);
      if (selectedWard) {
        setWard(selectedWard);
        setFormValue((prev) => ({ ...prev, ward: selectedWard.name, wardId: selectedWard.id }));
      }
    }
  }, [user?.wardId, listWard]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    onClose();
  };

  const handleSave = async () => {
    if (!user?.userId) return;

    try {
      const updatedData = {
        ...formData,
        address: formValue.street + ", " + formValue.ward + ", " + formValue.district + ", " + formValue.province,
        cityId: idProvice.id,
        districtId: district.id,
        wardId: ward.id,
      };

      const res = await dispatch(updateProfile({ userId: user.userId, updatedData }));
      const data = res.payload;
      if (res.meta.requestStatus === "fulfilled" && (data?.status === "200" || data?.status === "201")) {
        toast.success("Cập nhật thông tin thành công");
        onClose();
      } else {
        toast.error(res.payload as string);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi lưu thông tin.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Cập nhật thông tin tài khoản</h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7"></p>
        </div>
        <div className="flex flex-col">
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">Thông tin tài khoản</h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>Họ và tên</Label>
                  <Input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Điện thoại</Label>
                  <Input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Địa chỉ email</Label>
                  <Input type="text" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Giới tính</Label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Địa chỉ */}
            <div>
              <div className="input-elem-group elem-col-3">
                <div className="input-elem">
                  <label htmlFor="Tinh" className="text-base text-outerspace font-semibold mb-2">
                    Tỉnh*
                  </label>
                  <select
                    id="Tinh"
                    value={idProvice.id}
                    onChange={(e) => {
                      const selectedProvince = listProvince.find((p) => p.id === e.target.value);
                      if (selectedProvince) {
                        setIdProvince(selectedProvince);
                        setFormValue((prev) => ({
                          ...prev,
                          province: selectedProvince.name,
                          provinceId: selectedProvince.id,
                          district: "", // Reset district
                          districtId: null,
                          ward: "", // Reset ward
                          wardId: null,
                        }));
                        setDistrict({ id: "0", name: "", city_id: "" }); // Reset district
                        setWard({ id: "0", name: "", district_id: "" }); // Reset ward
                        setFormData((prev) => ({
                          ...prev,
                          cityId: selectedProvince.id,
                          districtId: "",
                          wardId: "",
                        }));
                      }
                    }}
                    className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="0">Chọn tỉnh</option>
                    {listProvince.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-elem">
                  <label htmlFor="Huyen" className="text-base text-outerspace font-semibold mb-2">
                    Huyện/Thành phố*
                  </label>
                  <select
                    id="Huyen"
                    value={district.id}
                    onChange={(e) => {
                      const selectedDistrict = listDistrict.find((d) => d.id === e.target.value);
                      if (selectedDistrict) {
                        setDistrict(selectedDistrict);
                        setFormValue((prev) => ({
                          ...prev,
                          district: selectedDistrict.name,
                          districtId: selectedDistrict.id,
                          ward: "", // Reset ward
                          wardId: null,
                        }));
                        setWard({ id: "0", name: "", district_id: "" }); // Reset ward
                        setFormData((prev) => ({
                          ...prev,
                          districtId: selectedDistrict.id,
                          wardId: "",
                        }));
                      }
                    }}
                    className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="0">Chọn huyện</option>
                    {listDistrict.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-elem">
                  <label htmlFor="Phuong" className="text-base text-outerspace font-semibold mb-2">
                    Phường/Xã*
                  </label>
                  <select
                    id="Phuong"
                    value={ward.id}
                    onChange={(e) => {
                      const selectedWard = listWard.find((w) => w.id.toString() === e.target.value);
                      if (selectedWard) {
                        setWard(selectedWard);
                        setFormValue((prev) => ({
                          ...prev,
                          ward: selectedWard.name,
                          wardId: selectedWard.id,
                        }));
                        setFormData((prev) => ({
                          ...prev,
                          wardId: selectedWard.id,
                        }));
                      }
                    }}
                    className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="0">Chọn phường xã</option>
                    {listWard.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="input-elem-group elem-col-1">
                <div className="input-elem">
                  <label htmlFor="Street" className="text-base text-outerspace font-semibold mb-2">
                    Số nhà, tên đường*
                  </label>
                  <input
                    type="text"
                    id="Street"
                    placeholder="Đường"
                    value={formValue.street}
                    onChange={(e) => setFormValue({ ...formValue, street: e.target.value })}
                    className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <BaseButtonOuterspace onClick={handleClose}>Hủy</BaseButtonOuterspace>
            <BaseBtnGreen onClick={handleSave}>{isLoadingUpdate ? <Loading /> : "Xác nhận"}</BaseBtnGreen>
          </div>
        </div>
      </div>
    </Modal>
  );
};
