import type { Metadata } from "next";

import { EmptyState } from "@/components/feedback/EmptyState";

export const metadata: Metadata = { title: "Community — TSUKI" };

export default function CommunityPage() {
  return (
    <div className="tsuki-container py-16">
      <h1 className="mb-6 font-display text-2xl text-foreground md:text-3xl">Community</h1>
      <EmptyState
        title="The sky is still quiet"
        message="Reviews, activity, and following arrive in a later milestone — after accounts and list tracking exist."
      />
    </div>
  );
}
