import React from "react";
import { Sidebar } from "../../components/sidebar/view";
import { docsConfig } from "@/config/docs";
import { Card, CardDescription } from "@/components/ui/card";

export default function Create() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: "0 0 20%", minWidth: "200px" }}>
        <Sidebar items={docsConfig.sidebarNav} />
      </div>
      <div style={{ flex: "1", padding: "20px" }}>
        <Card style={{ border: "2px solid red" }}>
          <CardDescription>Here are your daily notes</CardDescription>
        </Card>
      </div>
    </div>
  );
}
