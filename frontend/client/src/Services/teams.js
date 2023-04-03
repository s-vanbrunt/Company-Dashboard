import api from "./api";

export const getTeams = async (companyId) => {
  const response = await api.get(`/company/${companyId}/teams/`);
  return response.data;
};

export const postTeams = async (
  name,
  description,
  teammates,
  projects,
  username,
  password,
  companyId
) => {
  const response = await api
    .post(`/team/${companyId}`, {
      name,
      description,
      teammates,
      projects,
      credentials: {
        username,
        password,
      },
    })
    .catch((err) => console.log(err));
  return response.data;
};