"use-client";

import { Badge } from "./ui/badge";

export default function LiveTag({
  liveStart,
  liveEnd
}: {
  liveStart: Date;
  liveEnd: Date;
}) {
  const now = new Date();

  if (liveStart <= now && liveEnd >= now) {
    return <Badge variant={"secondary"}>Live</Badge>;
  }

  return null;
}