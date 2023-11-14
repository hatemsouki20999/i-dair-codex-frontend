import i18n from "../translation/i18n";

export const getToken = () => {
  return localStorage.getItem("token");
};
export const getEmail = () => {
  return localStorage.getItem("email");
};
export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};
export const translate = (key: string) => {
  return i18n.t(key);
};
