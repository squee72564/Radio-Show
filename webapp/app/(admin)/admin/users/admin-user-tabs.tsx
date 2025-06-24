"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserGroupTabContent from "./user-group-tab-content";
import { $Enums } from "@prisma/client";

const userTabs = [
  { value: $Enums.Role.ADMIN, label: "Admins" },
  { value: $Enums.Role.STREAMER, label: "Streamers" },
  { value: $Enums.Role.USER, label: "Users" },
];

export default function AdminUserTabs({isOwnerViewing} : {isOwnerViewing: boolean}) {
  const [activeTab, setActiveTab] = useState<$Enums.Role>(
    $Enums.Role.ADMIN
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as $Enums.Role)}
      className="space-y-6"
    >
      <TabsList className="flex space-x-2">
        {userTabs.map(({ value, label }) => (
          <TabsTrigger key={value} value={value} className="capitalize">
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {userTabs.map(({ value }) => (
        <TabsContent key={value} value={value} className="space-y-4">
          {activeTab === value && <UserGroupTabContent status={value} isOwnerViewing={isOwnerViewing} />}
        </TabsContent>
      ))}
    </Tabs>
  );
}
