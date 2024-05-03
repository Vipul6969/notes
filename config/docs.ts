import { SidebarNavItem } from "@/types/nav";

interface DocsConfig {
  sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  sidebarNav: [
    {
      title: "Say Hello!",
      items: [
        {
          title: "NOTES | TODO",
          items: [],
          href: "/dashboard",
        },
        // {
        //   title: "TAGS",
        //   items: [],
        //   href: "/notes/tags",
        // },
      ],
    },
  ],
};
