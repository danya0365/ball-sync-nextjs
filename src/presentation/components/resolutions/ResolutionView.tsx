"use client";

import { useResolutionPresenter } from "@/src/presentation/presenters/resolutions/useResolutionPresenter";
import { ResolutionDomain, ResolutionViewModel } from "@/src/presentation/presenters/resolutions/ResolutionPresenter";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/presentation/components/ui/Card";
import { CheckCircle2, AlertCircle, ShieldCheck, Database, Trophy, Shield, Users } from "lucide-react";

const DOMAINS: { id: ResolutionDomain, label: string, icon: React.ReactNode }[] = [
  { id: 'matches', label: 'Matches', icon: <Trophy className="w-4 h-4" /> },
  { id: 'teams', label: 'Teams', icon: <Shield className="w-4 h-4" /> },
  { id: 'leagues', label: 'Leagues', icon: <Database className="w-4 h-4" /> },
  { id: 'players', label: 'Players', icon: <Users className="w-4 h-4" /> },
];

interface ResolutionViewProps {
  initialViewModel?: ResolutionViewModel;
}

export function ResolutionView({ initialViewModel }: ResolutionViewProps) {
  const {
    viewModel, loading, error,
    activeDomain, setActiveDomain,
    approveMatch, approveTeam, approveLeague, approvePlayer
  } = useResolutionPresenter(initialViewModel);

  if (loading || !viewModel) {
    return <div className="animate-pulse space-y-4 p-4">
      <div className="h-10 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl w-1/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl"></div>)}
      </div>
    </div>;
  }

  const pendingCounts = {
    matches: viewModel.pendingMatches.length,
    teams: viewModel.pendingTeams.length,
    leagues: viewModel.pendingLeagues.length,
    players: viewModel.pendingPlayers.length,
  };

  const totalPending = Object.values(pendingCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-brand-500" />
            Resolution Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review and approve pending records across all domains.
            <span className="ml-2 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full text-xs font-bold">
              {totalPending} pending
            </span>
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 backdrop-blur-md">
          <AlertCircle className="inline w-4 h-4 mr-2" />{error}
        </div>
      )}

      {/* Domain Selection */}
      <div className="flex flex-wrap gap-2">
        {DOMAINS.map(domain => (
          <button
            key={domain.id}
            onClick={() => setActiveDomain(domain.id)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
              activeDomain === domain.id
                ? "bg-slate-800 dark:bg-white text-white dark:text-slate-900 shadow-md transform scale-105"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
            }`}
          >
            {domain.icon}
            {domain.label}
            {pendingCounts[domain.id] > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeDomain === domain.id
                  ? "bg-white/20 text-white dark:bg-slate-900/30 dark:text-slate-900"
                  : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
              }`}>
                {pendingCounts[domain.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ========== MATCHES ========== */}
      {activeDomain === 'matches' && (
        <div className="space-y-4">
          {viewModel.pendingMatches.length === 0 ? (
            <EmptyState text="No pending matches to review" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {viewModel.pendingMatches.map(match => (
                <Card key={match.id} className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-md border border-white/50 dark:border-white/5 shadow-lg hover:shadow-xl transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
                      {match.homeTeamNameEn} vs {match.awayTeamNameEn}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {match.leagueNameEn && <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded font-bold">{match.leagueNameEn}</span>}
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{match.status}</span>
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500 dark:text-slate-400">
                        {new Date(match.matchDate).toLocaleDateString()}
                      </span>
                      <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-[10px] font-bold uppercase">
                        {match.lastUpdatedBySource}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveMatch(match.id)}
                        className="flex-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== TEAMS ========== */}
      {activeDomain === 'teams' && (
        <div className="space-y-4">
          {viewModel.pendingTeams.length === 0 ? (
            <EmptyState text="No pending teams to review" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {viewModel.pendingTeams.map(team => (
                <Card key={team.id} className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-md border border-white/50 dark:border-white/5 shadow-lg hover:shadow-xl transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      {team.crestUrl && <img src={team.crestUrl} alt="" className="w-6 h-6 object-contain" />}
                      {team.nameEn}
                      {team.tla && <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">{team.tla}</span>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {team.country && <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{team.country}</span>}
                      {team.venueName && <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500 dark:text-slate-400">{team.venueName}</span>}
                      <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-[10px] font-bold uppercase">
                        {team.lastUpdatedBySource}
                      </span>
                    </div>
                    <button
                      onClick={() => approveTeam(team.id)}
                      className="w-full px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== LEAGUES ========== */}
      {activeDomain === 'leagues' && (
        <div className="space-y-4">
          {viewModel.pendingLeagues.length === 0 ? (
            <EmptyState text="No pending leagues to review" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {viewModel.pendingLeagues.map(league => (
                <Card key={league.id} className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-md border border-white/50 dark:border-white/5 shadow-lg hover:shadow-xl transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      {league.emblemUrl && <img src={league.emblemUrl} alt="" className="w-6 h-6 object-contain" />}
                      {league.nameEn}
                      {league.code && <span className="text-xs bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded font-bold">{league.code}</span>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {league.country && <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{league.country}</span>}
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500 dark:text-slate-400">{league.type}</span>
                      <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-[10px] font-bold uppercase">
                        {league.lastUpdatedBySource}
                      </span>
                    </div>
                    <button
                      onClick={() => approveLeague(league.id)}
                      className="w-full px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== PLAYERS ========== */}
      {activeDomain === 'players' && (
        <div className="space-y-4">
          {viewModel.pendingPlayers.length === 0 ? (
            <EmptyState text="No pending players to review. Player sync requires premium API access." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {viewModel.pendingPlayers.map(player => (
                <Card key={player.id} className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-md border border-white/50 dark:border-white/5 shadow-lg hover:shadow-xl transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
                      {player.nameEn}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {player.position && <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{player.position}</span>}
                      {player.nationality && <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500 dark:text-slate-400">{player.nationality}</span>}
                      <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-[10px] font-bold uppercase">
                        {player.lastUpdatedBySource}
                      </span>
                    </div>
                    <button
                      onClick={() => approvePlayer(player.id)}
                      className="w-full px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <Card className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border-white/40 dark:border-white/5 shadow-xl">
      <div className="p-12 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-50" />
        <p className="text-slate-500 font-medium">{text}</p>
      </div>
    </Card>
  );
}
