"use client";

import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { UserProfile, UserRole } from "@/lib/types";

type AuthState = {
    user: User | null;
    session: Session | null;
    profile: UserProfile | null;
    role: UserRole;
    isLoading: boolean;
    initialized: boolean;

    initAuth: () => Promise<void>;
    fetchProfile: (userId: string, email?: string) => Promise<UserProfile | null>;
    signOut: () => Promise<void>;
    setProfile: (profile: UserProfile | null) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    session: null,
    profile: null,
    role: "customer",
    isLoading: true,
    initialized: false,

    initAuth: async () => {
        if (get().initialized) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                set({ user: session.user, session });
                await get().fetchProfile(session.user.id, session.user.email);
            } else {
                set({ user: null, session: null, profile: null, role: "customer", isLoading: false });
            }

            // Listen for Auth changes
            supabase.auth.onAuthStateChange(async (event, newSession) => {
                if (newSession?.user) {
                    set({ user: newSession.user, session: newSession });
                    await get().fetchProfile(newSession.user.id, newSession.user.email);
                } else {
                    set({ user: null, session: null, profile: null, role: "customer", isLoading: false });
                }
            });
        } catch (err) {
            console.error("Auth init error:", err);
            set({ isLoading: false });
        } finally {
            set({ initialized: true, isLoading: false });
        }
    },

    fetchProfile: async (userId: string, email?: string) => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .maybeSingle();

            if (error && error.code !== "PGRST116") {
                console.error("Error fetching profile:", error);
            }

            if (data) {
                const userProfile: UserProfile = {
                    id: data.id,
                    email: data.email || email || "",
                    name: data.name || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    role: (data.role as UserRole) || "customer",
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                };
                set({ profile: userProfile, role: userProfile.role, isLoading: false });
                return userProfile;
            }

            // Fallback profile if record doesn't exist yet
            const fallbackProfile: UserProfile = {
                id: userId,
                email: email || "",
                name: "",
                phone: "",
                address: "",
                role: "customer",
            };
            set({ profile: fallbackProfile, role: "customer", isLoading: false });
            return fallbackProfile;
        } catch (err) {
            console.error("Profile fetch error:", err);
            set({ isLoading: false });
            return null;
        }
    },

    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null, profile: null, role: "customer", isLoading: false });
    },

    setProfile: (profile) => {
        set({ profile, role: profile?.role || "customer" });
    },
}));
