import api from "./axios";

export const getBillSettings = () => {
  return api.get("/bill-settings");
};

export const createBillSetting = (data) => {
  return api.post("/bill-settings", data);
};
