import { DEFAULT_TUCK_BOX } from "../constants/tuckbox";
import { createClient } from "@supabase/supabase-js";
import type { DesignTokens, OrderInfo, OrderStatus } from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type CloudProject = {
  id: string;
  user_id: string;
  name: string;
  design_tokens: DesignTokens;
  order_info: OrderInfo;
  active_preset: string;
  custom_presets: Record<string, DesignTokens>;
  status: OrderStatus;
  proof_token: string;
  proof_response: string | null;
  proof_response_note: string | null;
  created_at: string;
  updated_at: string;
};

export async function listProjects(): Promise<CloudProject[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data as CloudProject[];
}

export async function getProject(id: string): Promise<CloudProject> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as CloudProject;
}

export async function saveProject(project: {
  id?: string;
  name: string;
  design_tokens: DesignTokens;
  order_info: OrderInfo;
  active_preset: string;
  custom_presets: Record<string, DesignTokens>;
}): Promise<CloudProject> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const payload = { ...project, user_id: user.id };

  if (project.id) {
    const { data, error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", project.id)
      .select()
      .single();
    if (error) throw error;
    return data as CloudProject;
  } else {
    // New projects start on the Retail box. Old projects without a saved box
    // (UM Domino) keep drawing the Simple default, so nothing printed changes.
    if (!payload.design_tokens.tuckBox) {
      payload.design_tokens = { ...payload.design_tokens, tuckBox: { ...DEFAULT_TUCK_BOX, frontStyle: "retail" } };
    }
    const { data, error } = await supabase
      .from("projects")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as CloudProject;
  }
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function updateProjectStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase
    .from("projects")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function getProjectByProofToken(token: string): Promise<CloudProject | null> {
  const { data, error } = await supabase.rpc("get_project_by_proof_token", { token });
  if (error) throw error;
  return (data as CloudProject[])?.[0] ?? null;
}

export async function submitProofResponse(
  token: string,
  response: "approved" | "changes_requested",
  note?: string
): Promise<void> {
  const { error } = await supabase.rpc("submit_proof_response", {
    p_token: token,
    p_response: response,
    p_note: note ?? null,
  });
  if (error) throw error;
}

/** A custom-deck request from the form at callenueve.com/custom. */
export type Inquiry = {
  id: string;
  created_at: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  quantity: string | null;
  deck_type: string | null;
  message: string | null;
  source: string | null;
  handled: boolean;
};

export async function listInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return data as Inquiry[];
}

export async function setInquiryHandled(id: string, handled: boolean): Promise<void> {
  const { error } = await supabase.from("inquiries").update({ handled }).eq("id", id);
  if (error) throw error;
}

/** Save order details (used by the quote dialog on the projects screen). */
export async function updateOrderInfo(id: string, order_info: OrderInfo): Promise<void> {
  const { error } = await supabase
    .from("projects")
    .update({ order_info, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

/**
 * Copy a project as a fresh draft with a new order number: same design, presets
 * and customer, no proof response, today's date. For repeat orders.
 */
export async function duplicateProject(source: CloudProject, orderNumber: string): Promise<CloudProject> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { quote: _quote, ...rest } = source.order_info ?? ({} as OrderInfo);
  const order_info: OrderInfo = {
    ...rest,
    orderNumber,
    exportDate: new Date().toISOString().slice(0, 10),
    notes: `Reorder of ${source.order_info?.orderNumber || source.name}.${rest.notes ? `\n${rest.notes}` : ""}`,
  };
  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: `${source.name} (reorder ${orderNumber})`,
      design_tokens: source.design_tokens,
      order_info,
      active_preset: source.active_preset,
      custom_presets: source.custom_presets ?? {},
      status: "draft",
    })
    .select()
    .single();
  if (error) throw error;
  return data as CloudProject;
}
