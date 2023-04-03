import api from "./api";

export const getProjects = async (companyId, teamId) => {
  const response = await api.get(
    `/company/${companyId}/teams/${teamId}/projects`
  );
  return response.data;
};

export const postProject = async (
  name,
  description,
  teamId,
  username,
  password
) => {
  const response = await api
    .post(`/projects/${teamId}`, {
      name,
      description,
      credentials: {
        username,
        password,
      },
    })
    .catch((err) => console.log(err));
  return response.data;
};

export const patchProject = async (
  projectId,
  name,
  description,
  active,
  teamObj,
  username,
  password
) => {
  const response = await api
    .patch(`/projects/${projectId}`, {
      name,
      description,
      active,
      team: teamObj,
      credentials: {
        username,
        password,
      },
    })
    .catch((err) => console.log(err));
  return response.data;
};

export const deleteProject = async (projectId, credentials) => {
  const response = await api
    .delete(`/projects/${projectId}`, { data: credentials })
    .catch((err) => console.log(err));
  return response.data;
};
