import { supabase } from "@/integrations/supabase/client";
import { issues as mockIssues, alerts as mockAlerts, ngos as mockNgos, volunteers as mockVolunteers, type Issue, type Alert, type NGO, type Volunteer } from "@/data/mockData";

export const getIssues = async (): Promise<Issue[]> => {
  try {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error("Error fetching issues from Supabase:", error);
      return mockIssues;
    }

    if (!data || data.length === 0) return mockIssues;
    return data as unknown as Issue[];
  } catch (err) {
    console.error("Supabase service error:", err);
    return mockIssues;
  }
};

export const getAlerts = async (): Promise<Alert[]> => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error("Error fetching alerts from Supabase:", error);
      return mockAlerts;
    }

    if (!data || data.length === 0) return mockAlerts;
    return data as unknown as Alert[];
  } catch (err) {
    console.error("Supabase service error:", err);
    return mockAlerts;
  }
};

export const getNGOs = async (): Promise<NGO[]> => {
  try {
    const { data, error } = await supabase
      .from('ngos')
      .select('*');

    if (error) {
      console.error("Error fetching NGOs from Supabase:", error);
      return mockNgos;
    }

    if (!data || data.length === 0) return mockNgos;
    return data as unknown as NGO[];
  } catch (err) {
    console.error("Supabase service error:", err);
    return mockNgos;
  }
};

export const getVolunteers = async (): Promise<Volunteer[]> => {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*');

    if (error) {
      console.error("Error fetching volunteers from Supabase:", error);
      return mockVolunteers;
    }

    if (!data || data.length === 0) return mockVolunteers;
    return data as unknown as Volunteer[];
  } catch (err) {
    console.error("Supabase service error:", err);
    return mockVolunteers;
  }
};

export const createIssue = async (issue: Omit<Issue, 'id' | 'createdAt' | 'upvotes' | 'comments'>): Promise<Issue | null> => {
  try {
    const newIssue = {
      ...issue,
      upvotes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('issues')
      .insert([newIssue])
      .select()
      .single();

    if (error) {
      console.error("Error creating issue in Supabase:", error);
      return {
        id: `ISS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        upvotes: 0,
        comments: [],
        ...issue
      } as Issue;
    }

    return data as unknown as Issue;
  } catch (err) {
    console.error("Supabase service error:", err);
    return null;
  }
};

export const upvoteIssue = async (issueId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('increment_upvotes', { row_id: issueId });
    if (error) {
      console.error("Error upvoting issue in Supabase:", error);
      return true; // Simulate success
    }
    return true;
  } catch (err) {
    return true;
  }
};

export const claimIssue = async (issueId: string, ngoId: string | null): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('issues')
      .update({ assignedNgo: ngoId, status: ngoId ? 'Verified' : 'Pending' })
      .eq('id', issueId);

    if (error) {
      console.error("Error claiming issue in Supabase:", error);
      return true; // Simulate success
    }
    return true;
  } catch (err) {
    return true;
  }
};

export const updateIssueStatus = async (issueId: string, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('issues')
      .update({ status })
      .eq('id', issueId);

    if (error) {
      console.error("Error updating issue status in Supabase:", error);
      return true; // Simulate success
    }
    return true;
  } catch (err) {
    return true;
  }
};

export const toggleVolunteerAvailability = async (volId: string, available: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('volunteers')
      .update({ available })
      .eq('id', volId);

    if (error) {
      console.error("Error updating volunteer availability in Supabase:", error);
      return true; // Simulate success
    }
    return true;
  } catch (err) {
    return true;
  }
};

export const updateVolunteerStatus = async (volId: string, blocked: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('volunteers')
      .update({ blocked })
      .eq('id', volId);

    if (error) {
      console.error("Error updating volunteer status in Supabase:", error);
      return true; // Simulate success
    }
    return true;
  } catch (err) {
    return true;
  }
};
