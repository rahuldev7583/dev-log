import React, { useMemo } from 'react';

export const MonthlyHeatmap: React.FC<{ events: any[] }> = ({ events }) => {
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const now = new Date();
  const daysData: { dateStr: string; hours: number }[] = [];
  let maxHours = 0;

  for (let i = 34; i >= 0; i--) {
    const d = new Date(now.getTime());
    d.setDate(d.getDate() - i);

    const dateStr = d.toISOString().slice(0, 10);

    const totalMinutes = events
      .filter((e: any) => {
        const eventDate = new Date(e.session_start).toISOString().slice(0, 10);
        return eventDate === dateStr;
      })
      .reduce((sum: number, e: any) => sum + Number(e.time || 0), 0);

    const hours = totalMinutes / 60;
    maxHours = Math.max(maxHours, hours);

    daysData.push({ dateStr, hours });
  }
  if (events.length === 0 || maxHours === 0) {
    const demoPattern = [0.8, 3.2, 1.9, 5.4, 7.1, 2.6, 6.8];
    daysData.forEach((day, i) => {
      day.hours = (demoPattern[i % 7] ?? 0) + (i % 3) * 1.2;
    });
    maxHours = 8.5;
  }

  const getSquareClass = (hours: number) => {
    if (hours === 0) return 'bg-emerald-900/20 border border-emerald-900/30';
    const intensity = Math.min(Math.ceil((hours / maxHours) * 5), 5);
    const classes = [
      'bg-emerald-900/30',
      'bg-emerald-500/40',
      'bg-emerald-400',
      'bg-emerald-600',
      'bg-emerald-500',
    ];
    return classes[intensity - 1];
  };

  return (
    <div className='bg-zinc-900 p-10 hover:border-emerald-400/30 transition-colors h-full rounded-2xl'>
      <div className='flex justify-between items-baseline mb-4'>
        <h4 className='font-semibold text-lg'>Monthly Heatmap</h4>
        <span className='text-emerald-400 font-mono text-sm'>Last 30 days</span>
      </div>

      <div className='flex gap-3 mt-8'>
        <div className='flex flex-col text-xs font-medium text-zinc-400 pr-2 justify-start gap-1'>
          {dayLabels.map((label, i) => (
            <div key={i} className='h-6 flex items-center'>
              {label}
            </div>
          ))}
        </div>

        <div className='grid grid-cols-7 grid-rows-5 gap-1 auto-rows-[28px]'>
          {daysData.map((day, i) => (
            <div
              key={i}
              className={`w-7 h-7 ${getSquareClass(
                day.hours,
              )} hover:scale-110 transition-transform shadow-inner cursor-pointer`}
              title={`${day.hours.toFixed(1)}h • ${new Date(
                day.dateStr,
              ).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const RecentSessions: React.FC<{ events: any[] }> = ({ events }) => {
  const recentSessions = useMemo(() => {
    return [...events]
      .sort(
        (a, b) =>
          new Date(b.session_start).getTime() -
          new Date(a.session_start).getTime(),
      )
      .slice(0, 5);
  }, [events]);

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h}h ${m}m`;
  };

  const getDateLabel = (sessionStart: string) => {
    const date = new Date(sessionStart);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessionDate = new Date(date);
    sessionDate.setHours(0, 0, 0, 0);

    const shortDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return sessionDate.getTime() === today.getTime()
      ? `${shortDate} • Today`
      : shortDate;
  };

  const getLanguageBadge = (language: string) => {
    const colorMap: Record<string, string> = {
      TypeScript: 'sky',
      JavaScript: 'amber',
      Rust: 'orange',
      Python: 'yellow',
      'React/TSX': 'purple',
      Go: 'emerald',
      Unknown: 'zinc',
    };
    const color = colorMap[language] || 'zinc';
    return `px-3 py-1 text-xs bg-${color}-400/10 text-${color}-400 rounded-3xl`;
  };

  if (recentSessions.length === 0) {
    return (
      <div className='mt-10'>
        <h3 className='font-semibold mb-4 flex items-center gap-x-2'>
          <i className='fa-solid fa-clock' />
          Recent Coding Sessions
        </h3>
        <div className='bg-zinc-900 rounded-3xl p-12 text-center text-zinc-400'>
          No sessions recorded yet
        </div>
      </div>
    );
  }

  return (
    <div className='mt-10'>
      <h3 className='font-semibold mb-4 flex items-center gap-x-2'>
        <i className='fa-solid fa-clock' />
        Recent Coding Sessions
      </h3>
      <div className='bg-zinc-900 rounded-3xl overflow-hidden'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-white/10 text-xs text-zinc-400'>
              <th className='text-left px-8 py-5'>Project</th>
              <th className='text-left px-8 py-5'>Branch</th>
              <th className='text-left px-8 py-5'>Language</th>
              <th className='text-right px-8 py-5'>Duration</th>
              <th className='text-right px-8 py-5'>Date</th>
            </tr>
          </thead>
          <tbody className='text-sm font-medium divide-y divide-white/10'>
            {recentSessions.map((session, i) => (
              <tr key={session.id || i}>
                <td className='px-8 py-5 flex items-center gap-x-3'>
                  <span className='text-emerald-400'>📦</span>
                  {session.project_name || 'Unknown Project'}
                </td>
                <td className='px-8 py-5 font-mono'>
                  {session.branch && session.branch !== 'unknown'
                    ? session.branch
                    : 'main'}
                </td>
                <td className='px-8 py-5'>
                  <span
                    className={getLanguageBadge(session.language || 'Unknown')}
                  >
                    {session.language || 'Unknown'}
                  </span>
                </td>
                <td className='px-8 py-5 text-right font-mono text-emerald-400'>
                  {formatDuration(Number(session.time || 0))}
                </td>
                <td className='px-8 py-5 text-right text-zinc-400'>
                  {getDateLabel(session.session_start)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const extractWeeklyCodingHours = (events: any[]) => {
  if (!events || events.length === 0) {
    return {
      labels: [
        'Mar 23',
        'Mar 24',
        'Mar 25',
        'Mar 26',
        'Mar 27',
        'Mar 28',
        'Mar 29',
      ],
      data: [4.1, 6.8, 3.9, 8.2, 5.4, 7.9, 6.3],
      total: '42h 36m',
      title: 'Weekly Coding Hours',
    };
  }

  const now = new Date();
  const labels: string[] = [];
  const dailyHours: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    labels.push(
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    );

    const totalMinutes = events
      .filter(
        (e) =>
          new Date(e.session_start).toISOString().split('T')[0] === dateStr,
      )
      .reduce((sum, e) => sum + Number(e.time || 0), 0);

    dailyHours.push(totalMinutes / 60);
  }

  const totalHours = dailyHours.reduce((a, b) => a + b, 0);
  const total = `${Math.floor(totalHours)}h ${Math.round((totalHours % 1) * 60)}m`;

  return { labels, data: dailyHours, total, title: 'Weekly Coding Hours' };
};

export const extractBranchData = (events: any[]) => {
  if (!events || events.length === 0) {
    return {
      labels: [
        'main',
        'feature/auth-flow',
        'bugfix/mobile',
        'release/v2',
        'feature/new-ui',
      ],
      data: [21.4, 12.8, 6.3, 4.1, 8.9],
      title: 'Time per Git Branch',
    };
  }

  const branchMap = new Map<string, number>();
  events.forEach((e) => {
    const branch = e.branch && e.branch !== 'unknown' ? e.branch : 'main';
    const minutes = Number(e.time || 0);
    branchMap.set(branch, (branchMap.get(branch) || 0) + minutes);
  });

  const sorted = Array.from(branchMap.entries()).sort((a, b) => b[1] - a[1]);
  return {
    labels: sorted.map(([b]) => b),
    data: sorted.map(([, minutes]) => minutes / 60),
    title: 'Time per Git Branch',
  };
};

export const extractLanguageData = (events: any[]) => {
  if (!events || events.length === 0) {
    return {
      labels: ['TypeScript', 'Python', 'Rust', 'React/TSX', 'Go'],
      data: [42, 27, 16, 11, 4],
      colors: ['#3178C6', '#FFD43B', '#DEA584', '#61DAFB', '#00f5a0'],
      title: 'Time by Language • Last 30 days',
    };
  }

  const langMap = new Map<string, number>();

  events.forEach((e) => {
    const lang = e.language || 'Unknown';
    const minutes = Number(e.time) || 0;
    langMap.set(lang, (langMap.get(lang) || 0) + minutes);
  });

  const sorted = Array.from(langMap.entries())
    .map(([lang, minutes]) => ({
      lang,
      hours: minutes / 60,
    }))
    .sort((a, b) => b.hours - a.hours);

  const defaultColors = ['#3178C6', '#FFD43B', '#DEA584', '#61DAFB', '#00f5a0'];

  return {
    labels: sorted.map((s) => s.lang),
    data: sorted.map((s) => Number(s.hours.toFixed(2))),
    colors: sorted.map((_, i) => defaultColors[i % defaultColors.length]),
    title: 'Time by Language • Last 30 days',
  };
};
