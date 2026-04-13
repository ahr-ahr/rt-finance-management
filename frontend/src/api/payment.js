import api from "./axios";

export const createPayment = (data) => {
  return api.post("/payments", data);
};

export const getPayments = (params) => {
  return api.get("/payments", { params });
};
