import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  Inbox,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router";

import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import { loadOverview } from "../../mock/data";
import { relativeTime } from "../../utils/format";
import type { OverviewStats } from "../../types";

/**
 * The landing page, and the reference layout for a data page: skeleton while
 * loading, then headline figures → breakdown → recent activity.
 */
export default function Overview() {
  const [stats, setStats] = useState<OverviewStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadOverview().then((data) => !cancelled && setStats(data));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-[136px] rounded-2xl" />
          ))}
        </div>
        <div className="skeleton h-40 rounded-2xl" />
        <div className="skeleton h-72 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Headline figures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total records"
          value={stats.total.toLocaleString("en-US")}
          icon={Inbox}
          hint="Everything in the system"
        />
        <StatCard
          label="Active"
          value={stats.active.toLocaleString("en-US")}
          icon={Activity}
          accent
          hint="Currently in play"
        />
        <StatCard
          label="New this week"
          value={stats.newThisWeek.toLocaleString("en-US")}
          icon={UserCheck}
          hint="Created in the last 7 days"
        />
        <StatCard
          label="Growth"
          value={stats.growth}
          icon={TrendingUp}
          hint="Against the previous period"
        />
      </div>

      {/* Status breakdown */}
      <section>
        <h2 className="font-serif text-lg font-bold mb-4">Breakdown</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.breakdown.map(({ label, count, tone }) => {
            const share = stats.total ? Math.round((count / stats.total) * 100) : 0;
            return (
              <div key={label} className="panel panel-hover rounded-2xl p-5">
                <StatusBadge label={label} tone={tone} />
                <div className="font-serif text-3xl font-bold mt-3 tabular-nums">
                  {count.toLocaleString("en-US")}
                </div>
                <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-luxury-gold/70 rounded-full transition-[width] duration-500"
                    style={{ width: `${share}%` }}
                  />
                </div>
                <p className="text-[10px] text-white/30 mt-2 font-medium tabular-nums">
                  {share}% of all records
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="font-serif text-lg font-bold">Recent activity</h2>
          <Link
            to="/users"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-semibold text-luxury-gold hover:text-white transition-colors focus-gold"
          >
            View all <ArrowRight size={13} />
          </Link>
        </div>

        <div className="panel rounded-2xl divide-y divide-white/5 overflow-hidden">
          {stats.recent.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-medium text-sm truncate">{item.title}</span>
                  <StatusBadge label={item.status} tone={item.tone} />
                </div>
                <p className="text-[11px] text-white/35 mt-1 truncate">{item.subtitle}</p>
              </div>
              <p className="text-[10px] text-white/25 flex-shrink-0">
                {relativeTime(item.at)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
