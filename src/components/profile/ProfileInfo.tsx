"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createBrowserClient } from '@supabase/ssr';
import KycForm from "./KycForm";
import Toast from "@/components/ui/Toast";

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
}

export default function ProfileInfo() {
  const { user } = useAuth();
  const [form, setForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastConfig, setToastConfig] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    show: false,
    message: "",
    type: "info"
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToastConfig({ show: true, message, type });
  };

  const hideToast = useCallback(() => {
    setToastConfig(prev => ({ ...prev, show: false }));
  }, []);

  const loadUserProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profile) {
        setForm({
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          email: user.email || "",
          phone: profile.phone || "",
          country: profile.country || "",
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      showToast("Failed to load profile information", "error");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, [user, loadUserProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
          country: form.country,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      showToast("Profile updated successfully", "success");
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast("Failed to update profile. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {toastConfig.show && (
        <Toast 
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={hideToast}
        />
      )}

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    name="firstName"
                    value={form.firstName}
                    onChange={(e) => setForm(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    name="lastName"
                    value={form.lastName}
                    onChange={(e) => setForm(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Country</label>
                  <Input
                    name="country"
                    value={form.country}
                    onChange={(e) => setForm(prev => ({ ...prev, country: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="mt-4"
              >
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <KycForm />
    </div>
  );
}
