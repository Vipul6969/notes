import { create } from "domain";

const ROOTS = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  REGISTER: "/register"
};

export const paths = {
  login: {
    root: ROOTS.LOGIN,
  },
  register: {
    root: ROOTS.REGISTER,
  },
  dashboard: {
    root: ROOTS.DASHBOARD,
    create: `${ROOTS.DASHBOARD}/notes/create`,
  },
};
