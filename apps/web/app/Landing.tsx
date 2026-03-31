'use client';

import React from 'react';

import {
  WeeklyCodingHoursChart,
  TimePerBranchChart,
  TimeByLanguageChart,
} from './components/Chart';
import { Navbar } from './components/Navbar';

import Footer from './components/Footer';

export default function Landing() {
  return (
    <div className='bg-zinc-950 text-white font-sans'>
      <Navbar />

      <header className='hero-bg pt-16 pb-20 mt-10'>
        <div className='max-w-screen-2xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center'>
          <div className='space-y-8'>
            <div className='inline-flex items-center gap-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-3xl text-sm font-medium'>
              <div className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse' />
              NOW IN VS CODE MARKETPLACE
            </div>

            <h2
              className='text-6xl md:text-7xl font-semibold tracking-tighter leading-none'
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Your coding time,
              <br />
              beautifully visualized.
            </h2>

            <p className='text-xl text-zinc-400 max-w-lg'>
              Install once. Login once. See every second you code — heatmaps,
              project dashboards, Git branch analytics, and language breakdowns
              — instantly in VS Code{' '}
              <span className='text-emerald-400'>and</span> on the web.
            </p>

            <div className='flex flex-wrap gap-4'>
              <a
                href='https://marketplace.visualstudio.com/items?itemName=rahuldevkai75.devlog-extension'
                target='_blank'
                className='px-8 py-5 bg-emerald-500 hover:bg-emerald-400 text-white text-lg font-semibold rounded-3xl flex items-center justify-center gap-x-3 shadow-lg shadow-emerald-500/30'
                rel='noreferrer'
              >
                <i className='fa-brands fa-microsoft text-2xl' />
                Install Devlog on VS Code — Free
              </a>
            </div>
          </div>

          <div className='relative'>
            <div className='vs-code-window bg-zinc-900 rounded-3xl p-2 border border-white/10 shadow-2xl'>
              <div className='bg-[#1e1e2e] rounded-3xl overflow-hidden'>
                <div className='h-10 bg-[#181825] flex items-center px-4 text-xs font-mono text-zinc-400'>
                  <div className='flex-1 flex gap-x-6'>
                    <span className='text-emerald-400'>devlog-demo.tsx</span>
                    <span>main</span>
                    <span>●</span>
                    <span className='text-amber-400'>52 min today</span>
                  </div>
                  <div className='flex items-center gap-x-1 text-emerald-400'>
                    <i className='fa-solid fa-circle-check' />
                    Devlog synced
                  </div>
                </div>

                <div className='p-6 grid grid-cols-12 gap-6 bg-[#1e1e2e]'>
                  <div className='col-span-12 lg:col-span-7'>
                    <p className='text-xs uppercase tracking-widest text-zinc-400 mb-2'>
                      This month • Coding heat
                    </p>
                    <div className='heatmap-grid bg-zinc-950 p-3 rounded-2xl'>
                      <div className='text-[10px] text-zinc-500 text-right pr-1 flex flex-col justify-between h-28'>
                        <div>S</div>
                        <div>M</div>
                        <div>T</div>
                        <div>W</div>
                        <div>T</div>
                        <div>F</div>
                        <div>S</div>
                      </div>

                      <div className='bg-emerald-900/30 rounded' />
                      <div className='bg-emerald-500/40 rounded' />
                      <div className='bg-emerald-500/70 rounded' />
                      <div className='bg-emerald-400 rounded' />
                      <div className='bg-emerald-600 rounded' />
                      <div className='bg-emerald-900/30 rounded' />
                      <div className='bg-emerald-900/30 rounded' />

                      <div className='bg-emerald-900/30 rounded' />
                      <div className='bg-emerald-500 rounded' />
                      <div className='bg-emerald-600 rounded' />
                      <div className='bg-emerald-400 rounded' />
                      <div className='bg-emerald-700 rounded' />
                      <div className='bg-emerald-500/70 rounded' />
                      <div className='bg-emerald-900/30 rounded' />

                      <div className='bg-emerald-900/30 rounded' />
                      <div className='bg-emerald-400 rounded' />
                      <div className='bg-emerald-900/30 rounded' />
                      <div className='bg-emerald-500/70 rounded' />
                      <div className='bg-emerald-600 rounded' />
                      <div className='bg-emerald-400 rounded' />
                      <div className='bg-emerald-500 rounded' />

                      <div className='bg-emerald-500 rounded' />
                      <div className='bg-emerald-700 rounded' />
                      <div className='bg-emerald-400 rounded' />
                      <div className='bg-emerald-900/30 rounded' />
                      <div className='bg-emerald-500/70 rounded' />
                      <div className='bg-emerald-600 rounded' />
                      <div className='bg-emerald-400 rounded' />
                    </div>
                  </div>

                  <div className='col-span-12 lg:col-span-5 space-y-4'>
                    <div className='bg-zinc-950 rounded-2xl p-4'>
                      <div className='flex justify-between text-xs mb-1'>
                        <span className='text-zinc-400'>Today</span>
                        <span className='font-mono text-emerald-400'>
                          7h 14m
                        </span>
                      </div>
                      <div className='h-2 bg-zinc-800 rounded-full overflow-hidden'>
                        <div className='h-full w-4/5 bg-emerald-400' />
                      </div>
                    </div>

                    <div className='bg-zinc-950 rounded-2xl p-4'>
                      <div className='flex justify-between text-xs mb-1'>
                        <span className='text-zinc-400'>Current branch</span>
                        <span className='font-mono'>feature/auth-flow</span>
                      </div>
                      <div className='flex items-baseline gap-x-2'>
                        <span className='text-4xl font-semibold font-mono'>
                          3h 05m
                        </span>
                        <span className='text-emerald-400 text-sm'>
                          +1h 12m today
                        </span>
                      </div>
                    </div>

                    <div className='flex gap-2 text-xs'>
                      <div className='flex-1 bg-zinc-950 rounded-2xl p-3'>
                        <i className='fa-brands fa-typescript text-blue-400' />
                        <p className='mt-2'>TypeScript</p>
                        <p className='font-mono text-emerald-400'>4h 38m</p>
                      </div>
                      <div className='flex-1 bg-zinc-950 rounded-2xl p-3'>
                        <i className='fa-brands fa-python text-yellow-400' />
                        <p className='mt-2'>Python</p>
                        <p className='font-mono text-emerald-400'>1h 45m</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='absolute -bottom-4 -right-4 bg-zinc-900 border border-emerald-400 text-emerald-400 text-sm font-medium px-5 py-2 rounded-3xl shadow-xl flex items-center gap-x-2'>
              <i className='fa-solid fa-git-branch' />
              17 branches tracked this week
            </div>
          </div>
        </div>
      </header>

      <div className='border-b border-white/10 py-6 bg-zinc-900 mt-20'>
        <div className='max-w-screen-2xl mx-auto px-8 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-zinc-400 text-sm'>
          <div className='flex items-center gap-x-2'>
            <i className='fa-brands fa-github text-xl' />
            Open source
          </div>

          <div className='flex items-center gap-x-1'>
            Built for{' '}
            <span className='text-white font-medium'>
              Next.js • Rust • Python • Go • TypeScript
            </span>
          </div>
          <div>100% private • Syncs securely to web dashboard</div>
        </div>
      </div>

      <section id='features' className='max-w-screen-2xl mx-auto px-8 py-24'>
        <div className='text-center mb-16'>
          <span className='px-4 py-1.5 bg-emerald-400/10 text-emerald-400 text-sm font-medium rounded-3xl'>
            POWERFUL • BEAUTIFUL • ONE-STEP
          </span>
          <h2 className='text-5xl font-semibold tracking-tighter mt-4'>
            Everything you need to understand your coding flow
          </h2>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          <div className='bg-zinc-900 border border-white/5 hover:border-emerald-400/30 rounded-3xl p-8 group'>
            <div className='w-12 h-12 flex items-center justify-center bg-emerald-400/10 text-emerald-400 text-3xl rounded-2xl mb-6'>
              🔥
            </div>
            <h3 className='text-2xl font-semibold mb-2'>Beautiful Heatmaps</h3>
            <p className='text-zinc-400'>
              GitHub-style activity grid updated in real-time. Zoom into hours,
              days, or weeks.
            </p>
            <div className='mt-8 h-40 bg-zinc-950 rounded-2xl p-4 flex items-end gap-px'>
              <div className='flex-1 h-4 bg-emerald-300/30 rounded' />
              <div className='flex-1 h-8 bg-emerald-400/50 rounded' />
              <div className='flex-1 h-12 bg-emerald-400 rounded' />
              <div className='flex-1 h-20 bg-emerald-500 rounded' />
              <div className='flex-1 h-24 bg-emerald-600 rounded' />
              <div className='flex-1 h-6 bg-emerald-400/70 rounded' />
            </div>
          </div>

          <div className='bg-zinc-900 border border-white/5 hover:border-emerald-400/30 rounded-3xl p-8 group'>
            <div className='w-12 h-12 flex items-center justify-center bg-violet-400/10 text-violet-400 text-3xl rounded-2xl mb-6'>
              📊
            </div>
            <h3 className='text-2xl font-semibold mb-2'>Interactive Charts</h3>
            <p className='text-zinc-400'>
              Live in VS Code sidebar and on the web dashboard.
            </p>
            <div className='mt-8 h-40 flex items-center justify-center bg-zinc-900 rounded-2xl'>
              <div className='w-full max-w-[240px]'>
                <WeeklyCodingHoursChart
                  labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                  data={[4.2, 5.8, 3.9, 6.7, 7.1, 2.3, 4.9]}
                  total='41h'
                  title=''
                />
              </div>
            </div>
          </div>

          <div className='bg-zinc-900 border border-white/5 hover:border-emerald-400/30 rounded-3xl p-8 group'>
            <div className='w-12 h-12 flex items-center justify-center bg-amber-400/10 text-amber-400 text-3xl rounded-2xl mb-6'>
              🌳
            </div>
            <h3 className='text-2xl font-semibold mb-2'>
              Git Branch Time Tracking
            </h3>
            <p className='text-zinc-400'>
              Know exactly how much time you spent on every branch.
            </p>
            <div className='mt-8 space-y-4'>
              <div className='flex items-center justify-between bg-zinc-950 px-4 py-3 rounded-2xl'>
                <span className='font-mono'>main</span>
                <div className='flex-1 h-2 mx-4 bg-zinc-700 rounded-full'>
                  <div className='h-2 bg-emerald-400 rounded-full w-[68%]' />
                </div>
                <span className='font-mono text-emerald-400'>15h 44m</span>
              </div>
              <div className='flex items-center justify-between bg-zinc-950 px-4 py-3 rounded-2xl'>
                <span className='font-mono'>feature/auth-flow</span>
                <div className='flex-1 h-2 mx-4 bg-zinc-700 rounded-full'>
                  <div className='h-2 bg-emerald-400 rounded-full w-[32%]' />
                </div>
                <span className='font-mono text-emerald-400'>6h 12m</span>
              </div>
            </div>
          </div>

          <div className='bg-zinc-900 border border-white/5 hover:border-emerald-400/30 rounded-3xl p-8 group'>
            <div className='w-12 h-12 flex items-center justify-center bg-sky-400/10 text-sky-400 text-3xl rounded-2xl mb-6'>
              🗂️
            </div>
            <h3 className='text-2xl font-semibold mb-2'>Project Dashboards</h3>
            <p className='text-zinc-400'>
              Switch between monorepos, side projects, and client work
              instantly.
            </p>
          </div>

          <div className='bg-zinc-900 border border-white/5 hover:border-emerald-400/30 rounded-3xl p-8 group'>
            <div className='w-12 h-12 flex items-center justify-center bg-pink-400/10 text-pink-400 text-3xl rounded-2xl mb-6'>
              💻
            </div>
            <h3 className='text-2xl font-semibold mb-2'>Language Insights</h3>
            <p className='text-zinc-400'>
              Automatic detection of every file you touch.
            </p>
          </div>

          <div className='bg-zinc-900 border border-white/5 hover:border-emerald-400/30 rounded-3xl p-8 group'>
            <div className='w-12 h-12 flex items-center justify-center bg-orange-400/10 text-orange-400 text-3xl rounded-2xl mb-6'>
              ⚡
            </div>
            <h3 className='text-2xl font-semibold mb-2'>Just one step setup</h3>
            <p className='text-zinc-400'>
              Install the extension → login once inside VS Code → instantly see
              your time in VS Code <span className='text-emerald-400'>and</span>{' '}
              on the web dashboard.
            </p>
          </div>
        </div>
      </section>

      <section id='demo' className='bg-white/5 py-20'>
        <div className='max-w-screen-2xl mx-auto px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-5xl font-semibold tracking-tighter'>
              See Devlog in action
            </h2>
            <p className='text-zinc-400 mt-3'>
              Real charts. Real data. Real VS Code + Web dashboard vibes.
            </p>
          </div>

          <div className='bg-zinc-900 rounded-3xl p-8 max-w-6xl mx-auto'>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-8'>
              <div className='md:col-span-7'>
                <WeeklyCodingHoursChart />
              </div>

              <div className='md:col-span-5'>
                <TimePerBranchChart />
              </div>

              <div className='md:col-span-12 mt-8 border-t border-white/10 pt-8'>
                <TimeByLanguageChart />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id='how-it-works'
        className='max-w-screen-2xl mx-auto px-8 py-24'
      >
        <div className='text-center mb-16'>
          <h2 className='text-5xl font-semibold tracking-tighter'>
            One step. Zero friction.
          </h2>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          <div className='text-center'>
            <div className='mx-auto w-16 h-16 bg-emerald-400 text-zinc-950 rounded-3xl flex items-center justify-center text-4xl mb-6'>
              1️⃣
            </div>
            <h3 className='text-2xl font-semibold'>Install the extension</h3>
            <p className='text-zinc-400 mt-4'>
              One click from the VS Code Marketplace.
            </p>
          </div>
          <div className='text-center'>
            <div className='mx-auto w-16 h-16 bg-emerald-400 text-zinc-950 rounded-3xl flex items-center justify-center text-4xl mb-6'>
              2️⃣
            </div>
            <h3 className='text-2xl font-semibold'>Login once</h3>
            <p className='text-zinc-400 mt-4'>
              Quick auth inside VS Code — redirects to web app and syncs your
              data.
            </p>
          </div>
          <div className='text-center'>
            <div className='mx-auto w-16 h-16 bg-emerald-400 text-zinc-950 rounded-3xl flex items-center justify-center text-4xl mb-6'>
              3️⃣
            </div>
            <h3 className='text-2xl font-semibold'>View your time anywhere</h3>
            <p className='text-zinc-400 mt-4'>
              Beautiful dashboard instantly appears in VS Code and on the web.
            </p>
          </div>
        </div>
      </section>

      <div className='bg-emerald-400 text-zinc-950 py-16 text-center'>
        <div className='max-w-screen-2xl mx-auto px-8'>
          <h2 className='text-5xl font-semibold tracking-tighter'>
            Ready to see where your coding hours actually go?
          </h2>
          <p className='mt-6 text-2xl'>
            Install Devlog — completely free, one-step setup.
          </p>

          <a
            href='https://marketplace.visualstudio.com/items?itemName=rahuldevkai75.devlog-extension'
            target='_blank'
            className='mt-10 mx-auto inline-flex items-center px-10 py-6 text-2xl font-semibold bg-zinc-950 text-white rounded-3xl hover:bg-zinc-800'
            rel='noreferrer'
          >
            Install Devlog in VS Code
            <span className='ml-4 text-4xl'>→</span>
          </a>

          <p className='mt-8 text-sm font-medium'>
            Takes 8 seconds. Login once. Data syncs forever.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
