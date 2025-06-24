"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserGroupTabContent from "./schedule-group-tab-content";
import { $Enums } from "@prisma/client";

const scheduleTabs = [
  { value: $Enums.ScheduleStatus.PENDING, label: "Pending" },
  { value: $Enums.ScheduleStatus.APPROVED, label: "Approved" },
  { value: $Enums.ScheduleStatus.REJECTED, label: "Rejected" },
];

export default function AdminScheduleTabs() {
  const [activeTab, setActiveTab] = useState<$Enums.ScheduleStatus>(
    $Enums.ScheduleStatus.PENDING
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as $Enums.ScheduleStatus)}
      className="flex flex-col gap-6"
    >
      <TabsList className="flex gap-2">
        {scheduleTabs.map(({ value, label }) => (
          <TabsTrigger key={value} value={value} className="capitalize">
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {scheduleTabs.map(({ value }) => (
        <TabsContent key={value} value={value}>
          {activeTab === value && <UserGroupTabContent status={value} />}
        </TabsContent>
      ))}
    </Tabs>
  );
}
