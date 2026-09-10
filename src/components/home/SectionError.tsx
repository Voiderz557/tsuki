import { toFriendlyError } from "@/lib/anilist/client";
import { ErrorState } from "@/components/feedback/ErrorState";

/** Wraps ErrorState with the same heading/spacing rhythm as the other homepage sections. */
export function SectionError({ title, error }: { title: string; error: unknown }) {
  const { title: errorTitle, message } = toFriendlyError(error);

  return (
    <section className="tsuki-container py-8 md:py-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold text-foreground md:text-2xl">{title}</h2>
      </div>
      <ErrorState title={errorTitle} message={message} />
    </section>
  );
}
