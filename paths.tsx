const ROOTS = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  REGISTER: "/register",
  LOGOUT: "/logout",
  NOTES: "/notes",
};

export const paths = {
  login: {
    root: ROOTS.LOGIN,
  },
  logout: {
    root: ROOTS.LOGOUT,
  },
  register: {
    root: ROOTS.REGISTER,
  },
  dashboard: {
    root: ROOTS.DASHBOARD,
  },
  create: {
    root: `${ROOTS.NOTES}/create`,
  },
};
