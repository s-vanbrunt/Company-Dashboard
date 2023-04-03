import api from "./api";

export const login = async (username, password) => {
    const response = await api.post("/users/login", {
        username: username,
        password: password,
    });
    return response.data;
};

export const getCompanyUsers = async (companyId) => {
    return api.get(`/company/${companyId}/users`);
};

export const postUser = async (
    companyId,
    addUserRequestDto = {}
) => {
    const response = await api
        .post(`/users/${companyId}`, {...addUserRequestDto})
        .catch((err) => console.log(err));
    return response.data;
};
