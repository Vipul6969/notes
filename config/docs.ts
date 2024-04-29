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
          title: "NOTES / TODO",
          icon: "radix",
          items: [],
          href: "/dashboard",
        },
        {
          title: "TAGS",
          items: [],
          href: "/notes/tags",
        },
      ],
    },
  ],
};
