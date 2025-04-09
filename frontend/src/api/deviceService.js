import axios from "../utils/axios";

export const getDevices = async () => {
  const res = await axios.get("/api/device/all"); // 예: 관리자용 API
  return res.data;
};

export const approveDevice = async (deviceId, approved) => {
  return await axios.put(`/api/device/approve`, {
    deviceId,
    approved,
  });
};
