export type EnquiryStatus = "new" | "contacted" | "placed" | "closed";
export type EnquirySource = "email" | "webform" | "chat";

export interface Consultant {
  id: string;
  name: string;
  email: string;
}

export interface Enquiry {
  id: string;
  contact_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  company: string | null;
  role_sought: string | null;
  location: string | null;
  salary_budget: number | null;
  urgency: string | null;
  source: EnquirySource;
  status: EnquiryStatus;
  consultant_id: string | null;
  summary: string | null;
  raw_text: string | null;
  created_at: string;
}

