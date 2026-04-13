import api from "./axios";

export const getSummaryReport = (params) => {
  return api.get("/reports/summary", { params });
};

export const getMonthlyReport = (params) => {
  return api.get("/reports/monthly", { params });
};
