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
          icon: "radix", 
          items: [],
          // href: "/dashboard"
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
