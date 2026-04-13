import api from "./axios";

export const getHouses = (params) => {
  return api.get("/houses", { params });
};

export const getHouse = (id) => {
  return api.get(`/houses/${id}`);
};

export const createHouse = (data) => {
  return api.post("/houses", data);
};

export const updateHouse = (id, data) => {
  return api.put(`/houses/${id}`, data);
};

export const deleteHouse = (id) => {
  return api.delete(`/houses/${id}`);
};

export const assignResident = (houseId, data) => {
  return api.post(`/houses/${houseId}/assign-resident`, data);
};

export const vacateHouse = (id) => {
  return api.post(`/houses/${id}/vacate`);
};
