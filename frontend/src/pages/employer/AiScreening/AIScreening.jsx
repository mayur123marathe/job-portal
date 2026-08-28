import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Users,
  Sparkles,
  Eye,
  ArrowRight,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCompanyApplications } from "@/store/application/applicationThunk";
import { STATUS_CFG, STATUS_ORDER, isToday } from "./config";
import BreakdownPieChart from "./BreakdownPieChart";
import CoverageDonut from "./CoverageDonut";
import StatCard from "./StatCard";
import EmptyState from "./EmptyState";
import CandidateRow from "./CandidateRow";

export default function AIScreening() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applications, isLoading } = useSelector((s) => s.application);

  useEffect(() => {
    dispatch(fetchCompanyApplications({ filters: {} }));
  }, [dispatch]);

  const stats = useMemo(() => {
    const total = applications.length;
    const screened = (a) => a.screening != null;
    const statusOf = (a) => a.screening?.shortlistStatus ?? "NOT_SCREENED";

    const todayApps = applications.filter((a) => isToday(a.appliedAt));
    const todayScreened = todayApps.filter(screened);
    const allScreened = applications.filter(screened);

    const dist = {};
    STATUS_ORDER.forEach((s) => {
      dist[s] = 0;
    });
    applications.forEach((a) => {
      const key =
        screened(a) && STATUS_ORDER.includes(statusOf(a))
          ? statusOf(a)
          : "NOT_SCREENED";
      dist[key] = (dist[key] || 0) + 1;
    });

    const topAutoShortlisted = applications
      .filter((a) => statusOf(a) === "AUTO_SHORTLISTED")
      .sort(
        (a, b) =>
          (b.screening?.overallScore ?? 0) - (a.screening?.overallScore ?? 0),
      )
      .slice(0, 5);

    const topNeedsReview = applications
      .filter((a) => statusOf(a) === "REVIEW_RECOMMENDED")
      .sort(
        (a, b) =>
          (b.screening?.overallScore ?? 0) - (a.screening?.overallScore ?? 0),
      )
      .slice(0, 5);

    return {
      total,
      todayCount: todayApps.length,
      todayScreenedCount: todayScreened.length,
      allScreenedCount: allScreened.length,
      autoShortlistedCount: dist["AUTO_SHORTLISTED"],
      needsReviewCount: dist["REVIEW_RECOMMENDED"],
      dist,
      topAutoShortlisted,
      topNeedsReview,
    };
  }, [applications]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-brand" />
            AI Screening Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time insights from automated candidate screening
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 w-fit">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-brand">AI Active</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Applications Today"
          value={isLoading ? "…" : stats.todayCount}
          sub="received today"
          icon={Users}
          iconClass="bg-blue-50 text-brand"
          isLoading={isLoading}
        />
        <StatCard
          label="Screened Today"
          value={isLoading ? "…" : stats.todayScreenedCount}
          sub={isLoading ? "" : `of ${stats.todayCount} today`}
          icon={BrainCircuit}
          iconClass="bg-violet-50 text-violet-600"
          isLoading={isLoading}
        />
        <StatCard
          label="Auto-Shortlisted"
          value={isLoading ? "…" : stats.autoShortlistedCount}
          sub="score ≥ 90"
          icon={Sparkles}
          iconClass="bg-emerald-50 text-emerald-600"
          isLoading={isLoading}
        />
        <StatCard
          label="Needs Review"
          value={isLoading ? "…" : stats.needsReviewCount}
          sub="flagged by AI"
          icon={Target}
          iconClass="bg-amber-50 text-amber-600"
          isLoading={isLoading}
        />
      </div>

      {/* Breakdown + Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800">
              Screening Breakdown
            </CardTitle>
            <p className="text-xs text-slate-400">
              Distribution across all {stats.total} applications
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-8">
                <Skeleton className="h-44 w-44 rounded-full shrink-0" />
                <div className="flex-1 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                <BreakdownPieChart
                  dist={stats.dist}
                  total={stats.total}
                  size={180}
                />
                <div className="flex-1 space-y-3">
                  {STATUS_ORDER.map((s) => {
                    const count = stats.dist[s] || 0;
                    const pct =
                      stats.total === 0
                        ? 0
                        : Math.round((count / stats.total) * 100);
                    const cfg = STATUS_CFG[s];
                    return (
                      <div key={s} className="flex items-center gap-2.5">
                        <span
                          className="h-3 w-3 shrink-0 rounded-sm"
                          style={{ backgroundColor: cfg.color }}
                        />
                        <span className="text-xs text-slate-600 flex-1">
                          {cfg.label}
                        </span>
                        <span className="text-xs font-bold text-slate-800 w-6 text-right">
                          {count}
                        </span>
                        <span className="text-xs text-slate-400 w-9 text-right">
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800">
              Screening Coverage
            </CardTitle>
            <p className="text-xs text-slate-400">
              Percentage of applications AI-screened
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5 pt-3">
            {isLoading ? (
              <Skeleton className="h-30 w-30 rounded-full" />
            ) : (
              <CoverageDonut
                screened={stats.allScreenedCount}
                total={stats.total}
              />
            )}
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />{" "}
                  Screened
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {isLoading ? "…" : stats.allScreenedCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-slate-300" /> Pending
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {isLoading ? "…" : (stats.dist["NOT_SCREENED"] ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-xs text-slate-500">Total</span>
                <span className="text-xs font-bold text-slate-800">
                  {isLoading ? "…" : stats.total}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidate Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />{" "}
                Auto-Shortlisted
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold"
              >
                {stats.autoShortlistedCount} total
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Top candidates matching 90%+ of job requirements
            </p>
          </CardHeader>
          <CardContent className="pt-1">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-15 w-full rounded-lg" />
                ))}
              </div>
            ) : stats.topAutoShortlisted.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                message="No auto-shortlisted candidates yet"
              />
            ) : (
              <div className="space-y-1">
                {stats.topAutoShortlisted.map((app) => (
                  <CandidateRow key={app.id} app={app} />
                ))}
              </div>
            )}
            {stats.autoShortlistedCount > 5 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-xs text-slate-500 hover:text-brand"
                onClick={() => navigate("/employer/applications")}
              >
                View all {stats.autoShortlistedCount}{" "}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-600" /> Needs Your Review
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold"
              >
                {stats.needsReviewCount} total
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Strong candidates flagged for a closer look
            </p>
          </CardHeader>
          <CardContent className="pt-1">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-15 w-full rounded-lg" />
                ))}
              </div>
            ) : stats.topNeedsReview.length === 0 ? (
              <EmptyState
                icon={Eye}
                message="No candidates flagged for review"
              />
            ) : (
              <div className="space-y-1">
                {stats.topNeedsReview.map((app) => (
                  <CandidateRow key={app.id} app={app} />
                ))}
              </div>
            )}
            {stats.needsReviewCount > 5 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-xs text-slate-500 hover:text-brand"
                onClick={() => navigate("/employer/applications")}
              >
                View all {stats.needsReviewCount}{" "}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
