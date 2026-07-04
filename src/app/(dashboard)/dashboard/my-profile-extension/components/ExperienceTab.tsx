import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Briefcase, Edit2, Trash2, Phone, Mail, Globe, MapPin,
  ChevronRight, Info, CheckCircle2, ChevronDown, Building2, UserCircle2, CalendarDays
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function ExperienceTab({ comingSoon }: { comingSoon: (what: string) => () => void }) {
  const experiences = [
    {
      id: 1,
      company: 'Microsoft India Private Limited',
      logo: 'https://logo.clearbit.com/microsoft.com',
      role: 'Senior Sales Executive',
      duration: 'Jun 2022 - Present',
      tenure: '2 yrs 11 mos',
      location: 'Noida, Uttar Pradesh',
      isCurrent: true,
      responsibilities: [
        'Managing enterprise sales and key customer accounts',
        'Achieved 120% of annual sales target for FY 2023-24'
      ],
      contact: {
        phone: '+91 98765 43210',
        email: 'saurabh.verma@microsoft.com',
        website: 'www.microsoft.com/in'
      }
    },
    {
      id: 2,
      company: 'Dell International Services India Pvt. Ltd.',
      logo: 'https://logo.clearbit.com/dell.com',
      role: 'Sales Executive',
      duration: 'Jan 2020 - May 2022',
      tenure: '2 yrs 5 mos',
      location: 'Gurugram, Haryana',
      isCurrent: false,
      responsibilities: [
        'Handled SMB and corporate client acquisition',
        'Maintained strong customer relationships and upsell opportunities'
      ],
      contact: {
        phone: '+91 98765 67890',
        email: 'rahul.sharma@dell.com',
        website: 'www.dell.com'
      }
    },
    {
      id: 3,
      company: 'HCL Technologies Limited',
      logo: 'https://logo.clearbit.com/hcltech.com',
      role: 'Business Development Associate',
      duration: 'Jul 2018 - Dec 2019',
      tenure: '1 yr 6 mos',
      location: 'Noida, Uttar Pradesh',
      isCurrent: false,
      responsibilities: [
        'Identified new business opportunities and generated leads',
        'Assisted in proposal preparation and client presentations'
      ],
      contact: {
        phone: '+91 98765 24680',
        email: 'anita.kapoor@hcl.com',
        website: 'www.hcltech.com'
      }
    }
  ];

  const industryData = [
    { name: 'IT Services', value: 50, color: '#2563EB', duration: '3 yrs 5 mos' },
    { name: 'Software', value: 43, color: '#6366F1', duration: '2 yrs 11 mos' },
    { name: 'Hardware', value: 7, color: '#22C55E', duration: '6 mos' },
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-5">
      {/* Left Content Area (70%) */}
      <Card className="flex-1 min-w-0 border-gray-200 shadow-sm rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <CardContent className="p-6 flex flex-col">
          {/* Top Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[16px] font-bold text-gray-900 dark:text-zinc-50">Work Experience</h2>
            <div className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
              <span className="text-[13px] font-medium">Sort by: <span className="text-gray-900 dark:text-zinc-200">Most Recent</span></span>
              <ChevronDown size={14} />
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pl-3.5 space-y-0 before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent border-l border-gray-100 dark:border-zinc-800 ml-2">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="relative pl-6 sm:pl-8 -mt-px">
                {/* Timeline dot */}
                <div className="absolute left-[-5px] top-4 w-[11px] h-[11px] rounded-full border-[2.5px] border-blue-600 bg-white shadow-[0_0_0_3px_#EFF6FF] dark:bg-zinc-900 dark:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] z-10" />

                <Card className={`border-gray-200 shadow-sm transition-shadow duration-200 dark:border-zinc-800 ${exp.isCurrent ? 'bg-blue-50/40 dark:bg-zinc-800/50' : 'bg-white dark:bg-zinc-900'} ${index === 0 ? 'rounded-t-xl rounded-b-none' : index === experiences.length - 1 ? 'rounded-b-xl rounded-t-none' : 'rounded-none'}`}>
                  <CardContent className="p-5 flex flex-col gap-2">
                    {/* Top section: Company details & Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <div className="w-12 h-12 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0 p-1">
                          <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain rounded-md" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + exp.company + '&background=f3f4f6&color=4b5563'; }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-[15px] font-bold text-gray-900 dark:text-zinc-50">{exp.company}</h3>
                            {exp.isCurrent && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-semibold tracking-wide border border-emerald-100">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-[13.5px] font-medium text-gray-700 dark:text-zinc-300">{exp.role}</p>

                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                              <CalendarDays size={13} className="text-gray-400" />
                              <span>{exp.duration}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
                              <span>{exp.tenure}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                              <MapPin size={13} className="text-gray-400" />
                              <span>{exp.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={comingSoon('Edit Experience')} className="p-2 border border-gray-200 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors bg-white">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={comingSoon('Delete Experience')} className="p-2 border border-gray-200 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors bg-white">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gray-100 dark:bg-zinc-800" />

                    {/* Middle section: Responsibilities & Contact */}
                    <div className="flex flex-row gap-2 md:gap-6">
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-gray-900 dark:text-zinc-200 mb-2.5">Key Responsibilities:</p>
                        <ul className="space-y-1.5">
                          {exp.responsibilities.map((resp, i) => (
                            <li key={i} className="flex items-start gap-2 text-[12.5px] text-gray-600 dark:text-zinc-400">
                              <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 shrink-0" />
                              <span className="leading-snug">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="w-[200px] md:w-[280px] shrink-0">
                        <div className="rounded-lg border border-gray-100 bg-white/60 p-3.5 dark:bg-zinc-900/50 dark:border-zinc-800/80">
                          <p className="text-[11px] font-semibold text-gray-500 mb-2.5">Contact Details</p>
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-2.5">
                              <Phone size={13} className="text-gray-400 shrink-0" />
                              <p className="text-[12px] font-medium text-gray-700 dark:text-zinc-300 truncate">{exp.contact.phone}</p>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <Mail size={13} className="text-gray-400 shrink-0" />
                              <p className="text-[12px] font-medium text-gray-700 dark:text-zinc-300 truncate">{exp.contact.email}</p>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <Globe size={13} className="text-gray-400 shrink-0" />
                              <p className="text-[12px] font-medium text-blue-600 truncate">{exp.contact.website}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom section: View Details Link */}
                    <div className="flex justify-end mt-1">
                      <button onClick={comingSoon('View Details')} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-blue-600 hover:text-blue-700">
                        View Details <ChevronRight size={14} />
                      </button>
                    </div>

                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Add Another Experience Button */}
          <div className="mt-8 flex justify-center">
            <button onClick={comingSoon('Add Experience')} className="w-full border-2 border-dashed border-gray-200 hover:border-blue-300 bg-gray-50 hover:bg-blue-50/50 text-blue-600 py-3 rounded-xl flex items-center justify-center gap-2 text-[14px] font-semibold transition-colors">
              <span className="text-xl leading-none font-light mb-0.5">+</span> Add Another Experience
            </button>
          </div>

          {/* Notice Card */}
          <div className="mt-5 bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Info size={16} className="text-blue-600" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-gray-900 mb-0.5">Keep Your Experience Updated</h4>
              <p className="text-[12.5px] text-gray-600 leading-snug">
                Accurate experience details help us understand your background better for growth and opportunities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Sidebar (30%) */}
      <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-5">

        {/* Card 1: Experience Summary */}
        <Card className="border-gray-200 shadow-sm rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
          <CardHeader className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
            <CardTitle className="text-[14px] font-bold text-gray-900 flex items-center gap-2"><Briefcase size={16} className="text-blue-600" /> Experience Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-5">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <CalendarDays size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 mb-0.5 uppercase tracking-wide">Total Experience</p>
                <p className="text-[16px] font-bold text-blue-700">6 yrs 10 mos</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                <Building2 size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 mb-0.5 uppercase tracking-wide">Total Companies</p>
                <p className="text-[16px] font-bold text-purple-700">3</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <UserCircle2 size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 mb-0.5 uppercase tracking-wide">Total Roles</p>
                <p className="text-[16px] font-bold text-amber-700">3</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <CalendarDays size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 mb-0.5 uppercase tracking-wide">Average Tenure</p>
                <p className="text-[16px] font-bold text-emerald-700">2 yrs 1 mo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Experience by Industry */}
        <Card className="border-gray-200 shadow-sm rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
          <CardHeader className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
            <CardTitle className="text-[14px] font-bold text-gray-900">Experience by Industry</CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col items-center">
            <div className="relative w-[140px] h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industryData}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[15px] font-bold text-gray-900 leading-tight text-center">6 yrs<br />10 mos</span>
                <span className="text-[10px] text-gray-500 mt-0.5">Total</span>
              </div>
            </div>

            <div className="w-full space-y-2 mt-5">
              {industryData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[12.5px] font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-gray-600">{item.duration}</span>
                    <span className="text-[10px] text-gray-400 w-8 text-right">({item.value}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Contact Information */}
        <Card className="border-gray-200 shadow-sm rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
          <CardHeader className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex flex-row items-center gap-2 space-y-0">
            <UserCircle2 size={16} className="text-blue-600" />
            <CardTitle className="text-[14px] font-bold text-gray-900">Contact Information <span className="text-[11px] text-gray-500 font-normal">(Primary)</span></CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <Phone size={14} className="text-gray-400 shrink-0 mt-0.5" />
              <p className="text-[12.5px] font-medium text-gray-700 dark:text-zinc-300">+91 98765 43210</p>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={14} className="text-gray-400 shrink-0 mt-0.5" />
              <p className="text-[12.5px] font-medium text-gray-700 dark:text-zinc-300">rohan.mehta@crewcam.com</p>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
              <p className="text-[12.5px] font-medium text-gray-700 dark:text-zinc-300">Noida, Uttar Pradesh, India</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-gray-400 shrink-0 mt-0.5 font-bold text-[12px] leading-none flex items-center justify-center w-[14px] h-[14px] rounded-[2px] bg-gray-400 text-white">in</div>
              <p className="text-[12.5px] font-medium text-blue-600">linkedin.com/in/rohanmehta</p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Quick Tips */}
        <Card className="border-gray-200 shadow-sm rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
          <CardHeader className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex flex-row items-center gap-2 space-y-0">
            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Info size={12} className="text-blue-600" />
            </div>
            <CardTitle className="text-[14px] font-bold text-gray-900">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col">
            <ul className="space-y-3 mb-5">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-[12px] text-gray-700 dark:text-zinc-300 leading-snug">Add all your relevant work experiences.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-[12px] text-gray-700 dark:text-zinc-300 leading-snug">Include key responsibilities and achievements.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-[12px] text-gray-700 dark:text-zinc-300 leading-snug">Keep your information up to date.</span>
              </li>
            </ul>
            <button onClick={comingSoon('View Guidelines')} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-blue-600 hover:text-blue-700">
              View Experience Guidelines <ChevronRight size={14} />
            </button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
