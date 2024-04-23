

const ROOTS = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  REGISTER: "/register",
  LOGOUT: "/logout",
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
    create: `${ROOTS.DASHBOARD}/notes/create`,
  },
};
