import { createClient } from "@supabase/supabase-js";
import type { DesignTokens, OrderInfo } from "../types";

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
