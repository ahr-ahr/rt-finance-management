import api from "./axios";

export const getResidents = (params) => {
  return api.get("/residents", { params });
};

export const createResident = (data) => {
  return api.post("/residents", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateResident = (id, data) => {
  return api.post(`/residents/${id}?_method=PUT`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteResident = (id) => {
  return api.delete(`/residents/${id}`);
};
