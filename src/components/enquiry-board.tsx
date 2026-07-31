"use client";

import { useMemo, useState, useTransition } from "react";
import { supabase } from "@/lib/supabase";
import { StatusBadge } from "@/components/status-badge";
import type { Consultant, Enquiry, EnquiryStatus } from "@/lib/database.types";

const STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  placed: "Placed",
  closed: "Closed",
};

const STATUS_ORDER: EnquiryStatus[] = ["new", "contacted", "placed", "closed"];

function formatSalary(value: number | null) {
  if (value === null) return "—";
  return `£${value.toLocaleString("en-GB")}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

interface EnquiryBoardProps {
  initialEnquiries: Enquiry[];
  consultants: Consultant[];
}

export function EnquiryBoard({ initialEnquiries, consultants }: EnquiryBoardProps) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | "all">("all");
  const [consultantFilter, setConsultantFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const consultantById = useMemo(() => {
    const map = new Map<string, Consultant>();
    for (const c of consultants) map.set(c.id, c);
    return map;
  }, [consultants]);

  const statusCounts = useMemo(() => {
    const counts: Record<EnquiryStatus, number> = {
      new: 0,
      contacted: 0,
      placed: 0,
      closed: 0,
    };
    for (const e of enquiries) counts[e.status]++;
    return counts;
  }, [enquiries]);

  const filtered = enquiries.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;

    if (consultantFilter === "unassigned" && e.consultant_id !== null) return false;
    if (
      consultantFilter !== "all" &&
      consultantFilter !== "unassigned" &&
      e.consultant_id !== consultantFilter
    )
      return false;

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const consultant = e.consultant_id ? consultantById.get(e.consultant_id) : undefined;
      const haystack = [
        e.contact_name,
        e.company,
        e.role_sought,
        e.location,
        consultant?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });

  function handleStatusChange(id: string, nextStatus: EnquiryStatus) {
    // Optimistic update: the UI reflects the change immediately rather than waiting
    // on the network round-trip, then reconciles quietly if the write fails. For a
    // small internal tool with one or two people touching a record at a time, the
    // odds of a conflicting write are low enough that this trade-off favors feeling
    // instant over being maximally defensive.
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: nextStatus } : e))
    );

    startTransition(async () => {
      const { error } = await supabase
        .from("enquiries")
        .update({ status: nextStatus })
        .eq("id", id);

      if (error) {
        // Roll back on failure — the enquiry reverts to its prior status and the
        // consultant can tell something didn't stick and try again.
        setEnquiries((prev) =>
          prev.map((e) =>
            e.id === id ? initialEnquiries.find((i) => i.id === id) ?? e : e
          )
        );
      }
    });
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
            statusFilter === "all"
              ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
              : "border-neutral-200 text-neutral-600 hover:border-neutral-300 dark:border-neutral-800 dark:text-neutral-400"
          }`}
        >
          All ({enquiries.length})
        </button>
        {STATUS_ORDER.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              statusFilter === s
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                : "border-neutral-200 text-neutral-600 hover:border-neutral-300 dark:border-neutral-800 dark:text-neutral-400"
            }`}
          >
            {STATUS_LABELS[s]} ({statusCounts[s]})
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.35 4.35a7.5 7.5 0 0012.3 12.3z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, company, role, location..."
            className="w-72 rounded-md border border-neutral-300 bg-white py-1.5 pl-9 pr-3 text-sm placeholder:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>

        <select
          value={consultantFilter}
          onChange={(e) => setConsultantFilter(e.target.value)}
          className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="all">All consultants</option>
          <option value="unassigned">Unassigned</option>
          {consultants.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <span className="ml-auto text-sm text-neutral-400">
          {filtered.length} of {enquiries.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60">
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Budget</th>
              <th className="px-4 py-3 font-medium">Consultant</th>
              <th className="px-4 py-3 font-medium">Received</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((enquiry) => {
              const consultant = enquiry.consultant_id
                ? consultantById.get(enquiry.consultant_id)
                : undefined;

              return (
                <tr
                  key={enquiry.id}
                  className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/40"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{enquiry.contact_name}</div>
                    {enquiry.company && (
                      <div className="text-neutral-400">{enquiry.company}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                    {enquiry.role_sought ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                    {enquiry.location ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                    {formatSalary(enquiry.salary_budget)}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                    {consultant ? consultant.name : "Unassigned"}
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    {formatDate(enquiry.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={enquiry.status} />
                      <select
                        value={enquiry.status}
                        onChange={(e) =>
                          handleStatusChange(enquiry.id, e.target.value as EnquiryStatus)
                        }
                        disabled={isPending}
                        aria-label={`Change status for ${enquiry.contact_name}`}
                        className="rounded-md border border-neutral-300 bg-white px-1.5 py-0.5 text-xs dark:border-neutral-700 dark:bg-neutral-900"
                      >
                        {STATUS_ORDER.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-neutral-400">
                  No enquiries match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
