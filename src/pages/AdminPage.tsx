import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = trpc.admin.stats.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
    retry: false,
  });

  const {
    data: volunteers,
    isLoading: volLoading,
    refetch: refetchVolunteers,
  } = trpc.volunteer.list.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
    retry: false,
  });

  const {
    data: contacts,
    isLoading: contactLoading,
    refetch: refetchContacts,
  } = trpc.contact.list.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
    retry: false,
  });

  const updateStatusMutation = trpc.contact.updateStatus.useMutation({
    onSuccess: () => refetchContacts(),
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 size={32} className="text-[#d4854a] animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const refreshAll = () => {
    refetchStats();
    refetchVolunteers();
    refetchContacts();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#8a8580] hover:text-[#d4854a] transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-xs font-medium tracking-[0.15em] text-[#d4854a] uppercase mb-2">
                ADMIN DASHBOARD
              </p>
              <h1 className="font-display text-3xl font-semibold text-[#f5f2eb]">
                NayePankh Analytics
              </h1>
            </div>
            <button
              onClick={refreshAll}
              className="px-4 py-2 border border-[rgba(245,242,235,0.1)] text-[#8a8580] rounded-full text-sm hover:border-[#d4854a] hover:text-[#d4854a] transition-all"
            >
              Refresh Data
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="bg-[#141414] border border-[rgba(245,242,235,0.06)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#d4854a]/15 flex items-center justify-center">
                  <Users size={20} className="text-[#d4854a]" />
                </div>
                <p className="text-sm text-[#8a8580]">Volunteers</p>
              </div>
              <p className="text-3xl font-display font-semibold text-[#f5f2eb]">
                {statsLoading ? "..." : stats?.totalVolunteers ?? 0}
              </p>
            </div>

            <div className="bg-[#141414] border border-[rgba(245,242,235,0.06)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#d4854a]/15 flex items-center justify-center">
                  <MessageSquare size={20} className="text-[#d4854a]" />
                </div>
                <p className="text-sm text-[#8a8580]">Chat Sessions</p>
              </div>
              <p className="text-3xl font-display font-semibold text-[#f5f2eb]">
                {statsLoading ? "..." : stats?.totalChatSessions ?? 0}
              </p>
            </div>

            <div className="bg-[#141414] border border-[rgba(245,242,235,0.06)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#d4854a]/15 flex items-center justify-center">
                  <Mail size={20} className="text-[#d4854a]" />
                </div>
                <p className="text-sm text-[#8a8580]">Contact Requests</p>
              </div>
              <p className="text-3xl font-display font-semibold text-[#f5f2eb]">
                {statsLoading ? "..." : stats?.totalContacts ?? 0}
              </p>
            </div>

            <div className="bg-[#141414] border border-[rgba(245,242,235,0.06)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#e8734a]/15 flex items-center justify-center">
                  <AlertCircle size={20} className="text-[#e8734a]" />
                </div>
                <p className="text-sm text-[#8a8580]">Pending</p>
              </div>
              <p className="text-3xl font-display font-semibold text-[#f5f2eb]">
                {statsLoading ? "..." : stats?.pendingContacts ?? 0}
              </p>
            </div>
          </div>

          {/* Volunteer Registrations */}
          <div className="mb-12">
            <h2 className="font-display text-xl font-semibold text-[#f5f2eb] mb-4">
              Volunteer Registrations
            </h2>
            <div className="bg-[#141414] border border-[rgba(245,242,235,0.06)] rounded-2xl overflow-hidden">
              {volLoading ? (
                <div className="py-8 text-center">
                  <Loader2 size={24} className="text-[#d4854a] animate-spin mx-auto" />
                </div>
              ) : volunteers && volunteers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[rgba(245,242,235,0.06)]">
                        <th className="text-left text-xs font-medium text-[#8a8580] uppercase tracking-wider px-6 py-4">
                          Name
                        </th>
                        <th className="text-left text-xs font-medium text-[#8a8580] uppercase tracking-wider px-6 py-4">
                          Email
                        </th>
                        <th className="text-left text-xs font-medium text-[#8a8580] uppercase tracking-wider px-6 py-4">
                          Phone
                        </th>
                        <th className="text-left text-xs font-medium text-[#8a8580] uppercase tracking-wider px-6 py-4">
                          City
                        </th>
                        <th className="text-left text-xs font-medium text-[#8a8580] uppercase tracking-wider px-6 py-4">
                          Interests
                        </th>
                        <th className="text-left text-xs font-medium text-[#8a8580] uppercase tracking-wider px-6 py-4">
                          Availability
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {volunteers.map((v) => (
                        <tr
                          key={v.id}
                          className="border-b border-[rgba(245,242,235,0.04)] hover:bg-[rgba(245,242,235,0.02)] transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-[#f5f2eb]">
                            {v.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#8a8580]">
                            {v.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#8a8580]">
                            {v.phone}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#8a8580]">
                            {v.city}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {(v.interests as string[]).map((i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 bg-[rgba(245,242,235,0.05)] text-[#8a8580] rounded-full"
                                >
                                  {i}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs px-2 py-1 bg-[#d4854a]/15 text-[#d4854a] rounded-full capitalize">
                              {v.availability}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-[#8a8580]">
                  No volunteer registrations yet.
                </div>
              )}
            </div>
          </div>

          {/* Contact Requests */}
          <div>
            <h2 className="font-display text-xl font-semibold text-[#f5f2eb] mb-4">
              Contact Requests
            </h2>
            <div className="bg-[#141414] border border-[rgba(245,242,235,0.06)] rounded-2xl overflow-hidden">
              {contactLoading ? (
                <div className="py-8 text-center">
                  <Loader2 size={24} className="text-[#d4854a] animate-spin mx-auto" />
                </div>
              ) : contacts && contacts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[rgba(245,242,235,0.06)]">
                        <th className="text-left text-xs font-medium text-[#8a8580] uppercase tracking-wider px-6 py-4">
                          Name
                        </th>
                        <th className="text-left text-xs font-medium text-[#8a8580] uppercase tracking-wider px-6 py-4">
                          Email
                        </th>
                        <th className="text-left text-xs font-medium text-[#8a8580] uppercase tracking-wider px-6 py-4">
                          Query
                        </th>
                        <th className="text-left text-xs font-medium text-[#8a8580] uppercase tracking-wider px-6 py-4">
                          Source
                        </th>
                        <th className="text-left text-xs font-medium text-[#8a8580] uppercase tracking-wider px-6 py-4">
                          Status
                        </th>
                        <th className="text-left text-xs font-medium text-[#8a8580] uppercase tracking-wider px-6 py-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((c) => (
                        <tr
                          key={c.id}
                          className="border-b border-[rgba(245,242,235,0.04)] hover:bg-[rgba(245,242,235,0.02)] transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-[#f5f2eb]">
                            {c.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#8a8580]">
                            {c.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#8a8580] max-w-xs truncate">
                            {c.query}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs px-2 py-1 bg-[rgba(245,242,235,0.05)] text-[#8a8580] rounded-full capitalize">
                              {c.source.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                                c.status === "resolved"
                                  ? "bg-green-500/15 text-green-400"
                                  : c.status === "reviewed"
                                  ? "bg-blue-500/15 text-blue-400"
                                  : "bg-[#e8734a]/15 text-[#e8734a]"
                              }`}
                            >
                              {c.status === "resolved" ? (
                                <CheckCircle2 size={12} />
                              ) : c.status === "pending" ? (
                                <Clock size={12} />
                              ) : null}
                              {c.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={c.status}
                              onChange={(e) =>
                                updateStatusMutation.mutate({
                                  id: c.id,
                                  status: e.target.value as
                                    | "pending"
                                    | "reviewed"
                                    | "resolved",
                                })
                              }
                              className="bg-[#1c1c1c] border border-[rgba(245,242,235,0.06)] rounded-lg px-2 py-1 text-xs text-[#f5f2eb] focus:border-[#d4854a] focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-[#8a8580]">
                  No contact requests yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
