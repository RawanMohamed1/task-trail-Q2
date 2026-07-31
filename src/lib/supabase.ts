import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Not using the generic Database type here: the generated types add complexity
// disproportionate to a two-table schema, and the Enquiry/Consultant interfaces
// in database.types.ts already give us type safety at the call sites that matter.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
