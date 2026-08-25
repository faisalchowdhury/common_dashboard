import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Ban, CheckCircle2, Search, Users as UsersIcon } from "lucide-react";

import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../components/Toast";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import ConfirmDialog from "../../components/ConfirmDialog";
import { formatDate } from "../../utils/format";
import { loadUsers } from "../../mock/data";
import type { Pagination as PaginationMeta, PlatformUser } from "../../types";

/**
 * Reference layout for a list page: a filter bar whose state lives in the URL,
 * a skeleton, an empty state, rows, and a paginator.
 *
 * Search, role filter and paging all run against the mock data in
 * `src/mock/data.ts`, so every control on the page is live.
 */
export default function Users() {
  const [params, setParams] = useSearchParams();
  const { user: me } = useAuth();
  const toast = useToast();

  const page = Number(params.get("page")) || 1;
  const role = params.get("role") ?? "";
  const search = params.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(search);
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>();
  const [loading, setLoading] = useState(true);

  const [pending, setPending] = useState<PlatformUser | null>(null);
  const [working, setWorking] = useState(false);

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params);
      if (value) next.set(key, value);
      else next.delete(key);
      if (key !== "page") next.delete("page");
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  // Debounced search — typing should not filter on every keystroke.
  useEffect(() => {
    if (searchInput === search) return;
    const timer = setTimeout(() => setParam("search", searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput, search, setParam]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    loadUsers({ page, search, role }).then((result) => {
      if (cancelled) return;
      setUsers(result.users);
      setMeta(result.pagination);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [page, search, role]);

  /** Design mode: flips the row locally and shows the toast treatment. */
  const onConfirmBlock = () => {
    if (!pending) return;
    setWorking(true);
    setTimeout(() => {
      setUsers((current) =>
        current.map((user) =>
          user._id === pending._id ? { ...user, isBlocked: !user.isBlocked } : user,
        ),
      );
      toast.success(`${pending.name} ${pending.isBlocked ? "unblocked" : "blocked"}.`);
      setPending(null);
      setWorking(false);
    }, 400);
  };

  const selectClass =
    "bg-luxury-black border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white/70 focus:border-luxury-gold outline-none transition-colors cursor-pointer";

  return (
    <div className="space-y-5">
      <div className="panel rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, email or phone…"
            aria-label="Search users"
            className="w-full bg-luxury-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm placeholder-white/25 focus:border-luxury-gold outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={role}
            onChange={(e) => setParam("role", e.target.value)}
            aria-label="Filter by role"
            className={selectClass}
          >
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {(search || role) && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setParams(new URLSearchParams(), { replace: true });
              }}
              className="px-3 py-2.5 rounded-lg text-xs text-white/40 hover:text-luxury-gold transition-colors focus-gold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-[72px] rounded-xl" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No users found"
          message={
            search || role
              ? "Try a different search term, or clear the filters."
              : "No accounts have been registered yet."
          }
        />
      ) : (
        <>
          <div className="panel rounded-2xl divide-y divide-white/5 overflow-hidden">
            {users.map((user) => {
              const isSelf = user._id === me?._id;
              return (
                <div
                  key={user._id}
                  className="flex flex-wrap items-center gap-4 px-4 sm:px-5 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm truncate">{user.name}</span>
                      {user.role === "admin" && (
                        <span className="px-2 py-0.5 rounded-full border border-luxury-gold/30 bg-luxury-gold/10 text-luxury-gold text-[9px] font-semibold uppercase tracking-widest">
                          Admin
                        </span>
                      )}
                      {isSelf && (
                        <span className="px-2 py-0.5 rounded-full border border-white/15 text-white/45 text-[9px] font-semibold uppercase tracking-widest">
                          You
                        </span>
                      )}
                      {user.isBlocked && (
                        <span className="px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[9px] font-semibold uppercase tracking-widest">
                          Blocked
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-white/35 mt-1 truncate">
                      {user.email}
                      {user.phone ? ` · ${user.phone}` : ""} · joined{" "}
                      {formatDate(user.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      title={user.isVerified ? "Verified" : "Not verified"}
                      className={`flex items-center ${
                        user.isVerified ? "text-emerald-400/70" : "text-white/20"
                      }`}
                    >
                      <CheckCircle2 size={15} />
                    </span>

                    {/* Blocking yourself would lock you out of the dashboard. */}
                    <button
                      type="button"
                      onClick={() => setPending(user)}
                      disabled={isSelf}
                      title={
                        isSelf
                          ? "You cannot block your own account"
                          : user.isBlocked
                            ? "Unblock this user"
                            : "Block this user"
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[11px] font-semibold uppercase tracking-wider transition-colors focus-gold disabled:opacity-25 disabled:cursor-not-allowed ${
                        user.isBlocked
                          ? "border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
                          : "border-white/10 text-white/50 hover:border-amber-500/40 hover:text-amber-300"
                      }`}
                    >
                      <Ban size={12} />
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination meta={meta} onPageChange={(next) => setParam("page", String(next))} />
        </>
      )}

      <ConfirmDialog
        open={Boolean(pending)}
        destructive={!pending?.isBlocked}
        busy={working}
        title={pending?.isBlocked ? "Unblock this user?" : "Block this user?"}
        message={
          pending?.isBlocked
            ? `${pending?.name} will be able to sign in again.`
            : `${pending?.name} will be signed out and unable to sign in until you unblock them.`
        }
        confirmLabel={pending?.isBlocked ? "Unblock" : "Block"}
        onConfirm={onConfirmBlock}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
