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
          title: "Notes",
          icon: "radix", // using the icon key string
          items: [],
        },
        {
          title: "Tags",
          items: [],
        },
        {
          title: "Tasks",
          items: [],
        },
      ],
    },
  ],
};
