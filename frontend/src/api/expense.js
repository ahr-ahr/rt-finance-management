import api from "./axios";

export const getExpenses = (params) => {
  return api.get("/expenses", { params });
};

export const createExpense = (data) => {
  return api.post("/expenses", data);
};

export const updateExpense = (id, data) => {
  return api.put(`/expenses/${id}`, data);
};

export const deleteExpense = (id) => {
  return api.delete(`/expenses/${id}`);
};
