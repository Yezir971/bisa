import React from "react";
import { cookies } from "next/headers";
import { getJiraRepository } from "@/repositories/jira-repository";
import { JiraWorkspaceShell } from "@/components/shell/jira-workspace-shell";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const repo = getJiraRepository();
  const snapshot = await repo.getSnapshot();
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("bisa-session-user")?.value;
  const sessionUser = sessionUserId
    ? await repo.getUserById(sessionUserId)
    : null;

  return (
    <JiraWorkspaceShell
      initialData={snapshot}
      initialCurrentUser={sessionUser}
    />
  );
}
