import { supabase } from "@/lib/supabase";
import { EnquiryBoard } from "@/components/enquiry-board";
import type { Consultant, Enquiry } from "@/lib/database.types";

// Always fetch fresh on load rather than caching this page — a small internal
// tool where consultants expect to see the latest status changes is a case
// where correctness matters more than the performance win of static caching.
export const revalidate = 0;

export default async function Home() {
  const [{ data: enquiries }, { data: consultants }] = await Promise.all([
    supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<Enquiry[]>(),
    supabase.from("consultants").select("*").order("name").returns<Consultant[]>(),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-xl font-semibold">Enquiries</h1>
        <p className="text-sm text-neutral-500">
          Everything that&apos;s come in through email, the web form, and the chat widget.
        </p>
      </header>

      <EnquiryBoard
        initialEnquiries={enquiries ?? []}
        consultants={consultants ?? []}
      />
    </main>
  );
}
