"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { Client } from "@/types/database.types";
import { toast } from "sonner";
import {
  Settings,
  User,
  Building2,
  Briefcase,
  DollarSign,
  Clock,
  Link2,
  Save,
  Loader2,
  LogOut,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Settings Page                                                      */
/* ------------------------------------------------------------------ */

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [bookingLink, setBookingLink] = useState("");

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    business_name: "",
    service_type: "",
    hourly_rate: "",
    default_session_duration: "30",
  });

  // Password change
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get client
      const { data: clientData } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (clientData) {
        const c = clientData as Client;
        setClient(c);
        setForm({
          name: c.name || "",
          email: c.email || "",
          business_name: c.business_name || "",
          service_type: c.service_type || "",
          hourly_rate: c.hourly_rate?.toString() || "",
          default_session_duration:
            c.default_session_duration?.toString() || "30",
        });

        // Get booking link from client_settings
        const { data: settingsData } = await supabase
          .from("client_settings")
          .select("setting_value")
          .eq("client_id", c.id)
          .eq("setting_key", "booking_link")
          .single();

        if (settingsData?.setting_value) {
          setBookingLink(
            (settingsData.setting_value as { url?: string })?.url || ""
          );
        }
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    if (!client) return;
    setSaving(true);

    try {
      // Update client record
      const { error: clientError } = await supabase
        .from("clients")
        .update({
          name: form.name,
          email: form.email,
          business_name: form.business_name || null,
          service_type: form.service_type || null,
          hourly_rate: form.hourly_rate ? parseFloat(form.hourly_rate) : null,
          default_session_duration: form.default_session_duration
            ? parseInt(form.default_session_duration)
            : 30,
          updated_at: new Date().toISOString(),
        })
        .eq("id", client.id);

      if (clientError) throw clientError;

      // Upsert booking link in client_settings
      if (bookingLink.trim()) {
        const { error: settingsError } = await supabase
          .from("client_settings")
          .upsert(
            {
              client_id: client.id,
              setting_key: "booking_link",
              setting_value: { url: bookingLink.trim() },
              updated_at: new Date().toISOString(),
            },
            { onConflict: "client_id,setting_key" }
          );

        if (settingsError) {
          console.error("Booking link save error:", settingsError);
          // Try insert if upsert fails (no unique constraint)
          const { data: existing } = await supabase
            .from("client_settings")
            .select("id")
            .eq("client_id", client.id)
            .eq("setting_key", "booking_link")
            .single();

          if (existing) {
            await supabase
              .from("client_settings")
              .update({
                setting_value: { url: bookingLink.trim() },
                updated_at: new Date().toISOString(),
              })
              .eq("id", existing.id);
          } else {
            await supabase.from("client_settings").insert({
              client_id: client.id,
              setting_key: "booking_link",
              setting_value: { url: bookingLink.trim() },
            });
          }
        }
      }

      toast.success("Settings saved!");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) throw error;

      toast.success("Password updated!");
      setPasswordForm({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Password change error:", err);
      toast.error("Failed to update password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Settings
        </h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 animate-pulse h-48"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your profile and business configuration
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-medium px-5 py-2.5 rounded-xl transition-all duration-200 text-sm disabled:opacity-50 cursor-pointer shadow-lg shadow-orange-500/20"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Profile Section */}
      <Section icon={<User className="w-4 h-4 text-violet-400" />} title="Profile">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Full Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            placeholder="Your name"
          />
          <Field
            label="Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            placeholder="you@example.com"
            type="email"
          />
        </div>
      </Section>

      {/* Business Section */}
      <Section
        icon={<Building2 className="w-4 h-4 text-teal-400" />}
        title="Business"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Business Name"
            value={form.business_name}
            onChange={(v) => setForm({ ...form, business_name: v })}
            placeholder="e.g. Sarah's Design Studio"
          />
          <Field
            label="Service Type"
            value={form.service_type}
            onChange={(v) => setForm({ ...form, service_type: v })}
            placeholder="e.g. tutoring, design, photography"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Hourly Rate ($)"
            value={form.hourly_rate}
            onChange={(v) => setForm({ ...form, hourly_rate: v })}
            placeholder="25"
            type="number"
            icon={<DollarSign className="w-3.5 h-3.5" />}
          />
          <Field
            label="Session Duration (min)"
            value={form.default_session_duration}
            onChange={(v) => setForm({ ...form, default_session_duration: v })}
            placeholder="30"
            type="number"
            icon={<Clock className="w-3.5 h-3.5" />}
          />
        </div>
      </Section>

      {/* Integrations Section */}
      <Section
        icon={<Link2 className="w-4 h-4 text-orange-400" />}
        title="Integrations"
      >
        <Field
          label="Calendly Booking Link"
          value={bookingLink}
          onChange={setBookingLink}
          placeholder="https://calendly.com/your-name/30min"
          hint="This link is included in qualification emails sent to leads"
        />
      </Section>

      {/* Security Section */}
      <Section
        icon={<Shield className="w-4 h-4 text-amber-400" />}
        title="Security"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="New Password"
            value={passwordForm.newPassword}
            onChange={(v) =>
              setPasswordForm({ ...passwordForm, newPassword: v })
            }
            placeholder="••••••••"
            type="password"
          />
          <Field
            label="Confirm New Password"
            value={passwordForm.confirmPassword}
            onChange={(v) =>
              setPasswordForm({ ...passwordForm, confirmPassword: v })
            }
            placeholder="••••••••"
            type="password"
          />
        </div>
        <button
          onClick={handlePasswordChange}
          disabled={
            changingPassword ||
            !passwordForm.newPassword ||
            !passwordForm.confirmPassword
          }
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] text-white font-medium px-5 py-2.5 rounded-xl transition-all duration-200 text-sm disabled:opacity-30 cursor-pointer"
        >
          {changingPassword ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Shield className="w-4 h-4" />
          )}
          {changingPassword ? "Updating…" : "Update Password"}
        </button>
      </Section>

      {/* Danger Zone */}
      <div className="bg-red-500/[0.04] border border-red-500/10 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <LogOut className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Once you sign out, you&apos;ll need to log in again.
        </p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable Components                                                */
/* ------------------------------------------------------------------ */

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.06]">
        <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      <div className="p-5 space-y-4">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${
            icon ? "pl-9" : "pl-4"
          } pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/40 transition-all`}
        />
      </div>
      {hint && (
        <p className="text-[11px] text-slate-500 mt-1.5">{hint}</p>
      )}
    </div>
  );
}
