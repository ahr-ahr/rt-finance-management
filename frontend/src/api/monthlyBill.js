import api from "./axios";

export const getMonthlyBills = (params) => {
  return api.get("/monthly-bills", { params });
};

export const generateMonthlyBills = (data) => {
  return api.post("/monthly-bills/generate", data);
};
