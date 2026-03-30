'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

import { Navbar } from '../components/Navbar';
import Footer from '../components/Footer';
import {
  WeeklyCodingHoursChart,
  TimePerBranchChart,
  TimeByLanguageChart,
} from '../components/Chart';
import {
  extractBranchData,
  extractLanguageData,
  extractWeeklyCodingHours,
  MonthlyHeatmap,
  RecentSessions,
} from '../utility';
import Loader from '../components/Loader';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const getUser = async (token: string) => {
  try {
    const res = await axios.get(`${SERVER_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200) return res.data;
  } catch (error) {
    console.log({ error });
    localStorage.removeItem('authToken');
  }
};

const getEvents = async (token: string) => {
  try {
    const res = await axios.get(`${SERVER_URL}/api/user/vscode-event`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(res.data) ? res.data : res.data?.data || [];
  } catch (error) {
    console.log({ error });
    return [];
  }
};

const Dashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [events, setEvents] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const storedToken =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    let activeToken = tokenFromUrl || storedToken;

    if (!activeToken) {
      router.push('/auth');
      return;
    }

    if (tokenFromUrl) {
      localStorage.setItem('authToken', tokenFromUrl);
      activeToken = tokenFromUrl;
      router.replace('/dashboard');
    }

    Promise.all([
      getUser(activeToken).then((userData) => {
        if (userData) setUser(userData);
      }),
      getEvents(activeToken).then((eventData) => {
        setEvents(eventData);
      }),
    ]).finally(() => setLoading(false));
  }, [searchParams, storedToken, router]);

  const isEmpty = useMemo(() => events.length === 0, [events]);

  const weeklyProps = useMemo(() => {
    if (isEmpty) {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [3.2, 5.8, 2.1, 7.4, 4.9, 1.3, 6.7],
        total: '31h 24m',
        title: 'Weekly Coding Hours',
      };
    }
    return extractWeeklyCodingHours(events);
  }, [events, isEmpty]);

  const branchEvents = useMemo(() => {
    if (!selectedProject) return events;
    return events.filter((e) => e.project_name === selectedProject);
  }, [events, selectedProject]);

  const branchProps = useMemo(() => {
    if (isEmpty) {
      return {
        labels: ['main', 'feature/auth-flow', 'develop', 'bugfix/landing'],
        data: [1450, 820, 310, 190],
        title: 'Time Per Branch',
      };
    }
    return extractBranchData(branchEvents);
  }, [isEmpty, branchEvents]);

  const languageProps = useMemo(() => {
    if (isEmpty) {
      return {
        labels: ['TypeScript', 'Python', 'JavaScript', 'Rust', 'Go'],
        data: [38, 27, 19, 11, 5],
        colors: ['#22d3ee', '#a78bfa', '#f472b6', '#fb923c', '#4ade80'],
        title: 'Time By Language',
      };
    }
    return extractLanguageData(events);
  }, [events, isEmpty]);

  const uniqueProjects = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.project_name) set.add(e.project_name);
    });
    return Array.from(set).sort();
  }, [events]);

  const todayHours = useMemo(() => {
    if (isEmpty) return 6.75;
    const today = new Date().toISOString().split('T')[0];
    const totalMinutes = events
      .filter(
        (e) => new Date(e.session_start).toISOString().split('T')[0] === today,
      )
      .reduce((sum, e) => sum + Number(e.time || 0), 0);
    return totalMinutes / 60;
  }, [events, isEmpty]);

  const yesterdayDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }, []);

  const yesterdayHours = useMemo(() => {
    if (isEmpty) return 3.8;
    const totalMinutes = events
      .filter(
        (e) =>
          new Date(e.session_start).toISOString().split('T')[0] ===
          yesterdayDate,
      )
      .reduce((sum, e) => sum + Number(e.time || 0), 0);
    return totalMinutes / 60;
  }, [events, yesterdayDate, isEmpty]);

  const todayDelta = todayHours - yesterdayHours;

  const longestSession = useMemo(() => {
    if (!events.length) return { hours: 3.92, branch: 'feature/auth-flow' };
    const maxEvent = events.reduce((maxE, e) =>
      Number(e.time) > Number(maxE.time) ? e : maxE,
    );
    const minutes = Number(maxEvent.time);
    return {
      hours: minutes / 60,
      branch:
        maxEvent.branch && maxEvent.branch !== 'unknown'
          ? maxEvent.branch
          : 'main',
    };
  }, [events]);

  const longestFormatted = `${Math.floor(longestSession.hours)}h ${Math.round(
    (longestSession.hours % 1) * 60,
  )}m`;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return <Loader></Loader>;
  }

  return (
    <div className='bg-zinc-950 text-white font-sans min-h-screen'>
      <Navbar />

      <div className='max-w-screen-2xl mx-auto px-8 pt-8 pb-24'>
        <div className='flex justify-between items-end mb-8'>
          <div>
            <h2
              className='text-5xl font-semibold tracking-tighter leading-none'
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {getGreeting()}, {user?.name || 'there'} 👋
            </h2>
            <p className='text-zinc-400 text-xl mt-1'>
              Here&apos;s where your {weeklyProps.total} went this week
            </p>
          </div>
        </div>

        {isEmpty && (
          <div className='mb-8 bg-gradient-to-r from-zinc-900 to-zinc-950 border border-emerald-400/30 rounded-3xl p-8 text-center'>
            <div className='inline-flex items-center gap-3 bg-emerald-400/10 text-emerald-400 px-6 py-3 rounded-3xl text-sm font-medium mb-6'>
              <i className='fa-solid fa-chart-simple'></i>
              <span>Demo Preview</span>
            </div>
            <h3 className='text-3xl font-semibold tracking-tighter'>
              Your charts will look like this
            </h3>
            <p className='text-zinc-400 text-xl mt-3 max-w-lg mx-auto'>
              Continue your coding sessions — we&apos;ll update the dashboard
              here as soon as you have real data!
            </p>
          </div>
        )}

        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-10'>
          <div className='bg-zinc-900 rounded-3xl p-6 hover:border-emerald-400/30 border border-white/5 transition-colors'>
            <div className='flex justify-between'>
              <div>
                <p className='uppercase text-xs tracking-widest text-zinc-400'>
                  Today
                </p>
                <p className='text-5xl font-semibold font-mono mt-2 text-emerald-400'>
                  {Math.floor(todayHours)}h {Math.round((todayHours % 1) * 60)}m
                </p>
              </div>
              <div className='text-right'>
                <i className='fa-solid fa-sun text-4xl text-amber-400' />
                <p className='text-xs text-emerald-400 mt-6'>
                  {todayDelta >= 0 ? '+' : ''}
                  {todayDelta.toFixed(1)}h vs yesterday
                </p>
              </div>
            </div>
            <div className='mt-6 h-2 bg-zinc-800 rounded-full overflow-hidden'>
              <div
                className='bg-emerald-400 h-2 rounded-full transition-all'
                style={{
                  width: `${Math.min(Math.round((todayHours / 10) * 100), 100)}%`,
                }}
              />
            </div>
          </div>

          <div className='bg-zinc-900 rounded-3xl p-6 hover:border-emerald-400/30 border border-white/5 transition-colors'>
            <div className='flex justify-between'>
              <div>
                <p className='uppercase text-xs tracking-widest text-zinc-400'>
                  This week
                </p>
                <p className='text-5xl font-semibold font-mono mt-2'>
                  {weeklyProps.total}
                </p>
              </div>
              <div className='text-right'>
                <i className='fa-solid fa-chart-line text-4xl text-emerald-400' />
                <p className='text-xs text-emerald-400 mt-6'>
                  ↑ 14% from last week
                </p>
              </div>
            </div>
            <div className='mt-6 h-2 bg-zinc-800 rounded-full overflow-hidden'>
              <div
                className='bg-emerald-400 h-2 rounded-full transition-all'
                style={{ width: '92%' }}
              />
            </div>
          </div>

          <div className='bg-zinc-900 rounded-3xl p-6 hover:border-emerald-400/30 border border-white/5 transition-colors'>
            <div className='flex justify-between'>
              <div>
                <p className='uppercase text-xs tracking-widest text-zinc-400'>
                  Longest session
                </p>
                <p className='text-5xl font-semibold font-mono mt-2'>
                  {longestFormatted}
                </p>
              </div>
              <div className='text-right'>
                <i className='fa-solid fa-code-branch'></i>
                <p className='text-xs text-zinc-400 mt-6'>
                  On {longestSession.branch}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-zinc-900 rounded-3xl p-6 hover:border-emerald-400/30 border border-white/5 transition-colors'>
            <div className='flex justify-between'>
              <div>
                <p className='uppercase text-xs tracking-widest text-zinc-400'>
                  Projects tracked
                </p>
                <p className='text-5xl font-semibold font-mono mt-2'>
                  {uniqueProjects.length || 7}
                </p>
              </div>
              <div className='text-right'>
                <i className='fa-solid fa-folder-tree text-4xl text-violet-400' />
                <p className='text-xs text-zinc-400 mt-6'>
                  {uniqueProjects.length
                    ? 'all active this week'
                    : '2 active this week'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8'>
          <div className='lg:col-span-7'>
            <WeeklyCodingHoursChart
              labels={weeklyProps.labels}
              data={weeklyProps.data}
              total={weeklyProps.total}
              title={weeklyProps.title}
            />
          </div>

          <div className='lg:col-span-5'>
            <div className='mb-4 flex justify-end'>
              <select
                value={selectedProject || ''}
                onChange={(e) => setSelectedProject(e.target.value || null)}
                className='bg-zinc-900 border border-white/10 hover:border-emerald-400/30 text-sm font-mono rounded-3xl px-5 py-2 transition-colors focus:outline-none'
              >
                <option value=''>All Projects</option>
                {uniqueProjects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
            </div>
            <TimePerBranchChart
              labels={branchProps.labels}
              data={branchProps.data}
              title={branchProps.title}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8'>
          <div className='lg:col-span-5 '>
            <MonthlyHeatmap events={events} />
          </div>
          <div className='lg:col-span-7'>
            <TimeByLanguageChart
              labels={languageProps.labels}
              data={languageProps.data}
              colors={languageProps?.colors as string[]}
              title={languageProps.title}
            />
          </div>
        </div>

        <RecentSessions events={events} />
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
