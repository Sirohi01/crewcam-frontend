"use client"
import React, { useState, useMemo } from 'react';
import {
  Star,
  Search,
  Filter,
  X,
  ChevronDown,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Eye,
  MoreHorizontal,
  Sparkles,
  Download,
  Settings,
  Plus,
  Check,
  Columns,
  ChevronLeft,
  ChevronRight,
  Info,
  ShieldAlert,
  RefreshCw,
  SlidersHorizontal,
  Mail,
  Phone,
  Briefcase,
  Award
} from 'lucide-react';
import { Candidate, FilterState, MetricCardData, ScreeningFactors } from './data';
import {
  INITIAL_CANDIDATES,
  INITIAL_METRIC_CARDS,
  UNIQUE_JOBS,
  UNIQUE_DEPARTMENTS,
  UNIQUE_EXPERIENCES,
  UNIQUE_SCORES,
  UNIQUE_STATUSES
} from './data';

export default function AiScreening() {
  // --- Core States ---
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [activeTab, setActiveTab] = useState<string>('All');

  // Dynamic metrics updated in real-time as candidates are added
  const [metrics, setMetrics] = useState<MetricCardData[]>(INITIAL_METRIC_CARDS);

  // Custom interactive model factors and confidence score from Settings
  const [confidenceScore, setConfidenceScore] = useState<number>(92);
  const [matchingFactors, setMatchingFactors] = useState<ScreeningFactors>({
    skillsMatch: true,
    experience: true,
    education: true,
    jobTitleRelevance: true,
    keywords: true,
  });

  // Filter States
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    jobOpening: 'All Openings',
    department: 'All Departments',
    experience: 'All Experience',
    aiMatchScore: 'All Scores',
    screeningStatus: 'All Status',
    dateRange: '01 Jun 2026 - 15 Jun 2026',
  });

  // UI interactive states
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [showColumnsDropdown, setShowColumnsDropdown] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('score-desc');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, boolean>>({});

  // Form states for adding a new candidate
  const [newCandidateForm, setNewCandidateForm] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: 'Software Developer',
    experienceYears: 3,
    aiMatchScore: 85,
    topSkills: 'React, TypeScript, CSS',
    aiSummary: 'Skilled engineer with great team collaboration skills and frontend focus.',
    isFlagged: false
  });

  // Department mapping helper
  const getDepartmentByJob = (jobTitle: string): string => {
    if (['Software Developer', 'Frontend Developer', 'DevOps Engineer'].includes(jobTitle)) return 'Engineering';
    if (['UI/UX Designer'].includes(jobTitle)) return 'Design';
    if (['Digital Marketing Executive'].includes(jobTitle)) return 'Marketing';
    if (['HR Executive'].includes(jobTitle)) return 'Human Resources';
    if (['Business Analyst', 'Product Manager'].includes(jobTitle)) return 'Product';
    if (['Data Scientist'].includes(jobTitle)) return 'Data Science';
    if (['Security Engineer'].includes(jobTitle)) return 'Security';
    return 'Engineering';
  };

  // --- Filter and Sort Logic ---
  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      // 1. Search Query (name, email, phone, job title, skills)
      const matchesSearch =
        candidate.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        candidate.phone.includes(filters.searchQuery) ||
        candidate.jobAppliedFor.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        candidate.topMatchedSkills.some(skill => skill.toLowerCase().includes(filters.searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // 2. Tab selection filtering
      if (activeTab === 'High Match' && candidate.screeningStatus !== 'High Match') return false;
      if (activeTab === 'Medium Match' && candidate.screeningStatus !== 'Medium Match') return false;
      if (activeTab === 'Low Match' && candidate.screeningStatus !== 'Low Match') return false;
      if (activeTab === 'Needs Review' && candidate.screeningStatus !== 'Needs Review') return false;

      // 3. Dropdown Job Opening Filter
      if (filters.jobOpening !== 'All Openings' && candidate.jobAppliedFor.title !== filters.jobOpening) return false;

      // 4. Dropdown Department Filter
      if (filters.department !== 'All Departments') {
        const candidateDept = getDepartmentByJob(candidate.jobAppliedFor.title);
        if (candidateDept !== filters.department) return false;
      }

      // 5. Dropdown Experience Filter
      if (filters.experience !== 'All Experience') {
        if (filters.experience === 'Under 2 Years' && candidate.experienceYears >= 2) return false;
        if (filters.experience === '2 - 4 Years' && (candidate.experienceYears < 2 || candidate.experienceYears > 4)) return false;
        if (filters.experience === 'Above 4 Years' && candidate.experienceYears <= 4) return false;
      }

      // 6. Dropdown AI Score Filter
      if (filters.aiMatchScore !== 'All Scores') {
        const score = candidate.aiMatchScore;
        if (filters.aiMatchScore === 'Excellent (85%+)' && score < 85) return false;
        if (filters.aiMatchScore === 'Good (70%-84%)' && (score < 70 || score > 84)) return false;
        if (filters.aiMatchScore === 'Average (40%-69%)' && (score < 40 || score > 69)) return false;
        if (filters.aiMatchScore === 'Low (Below 40%)' && score >= 40) return false;
      }

      // 7. Dropdown Screening Status Filter
      if (filters.screeningStatus !== 'All Status' && candidate.screeningStatus !== filters.screeningStatus) return false;

      return true;
    }).sort((a, b) => {
      // Sort Logic
      if (sortBy === 'score-desc') return b.aiMatchScore - a.aiMatchScore;
      if (sortBy === 'score-asc') return a.aiMatchScore - b.aiMatchScore;
      if (sortBy === 'experience-desc') return b.experienceYears - a.experienceYears;
      return 0;
    });
  }, [candidates, filters, activeTab, sortBy]);

  // Pagination calculations
  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCandidates.slice(startIndex, startIndex + pageSize);
  }, [filteredCandidates, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredCandidates.length / pageSize) || 1;

  // Real-time tab indicators based on current data state
  const tabCounts = useMemo(() => {
    const counts = {
      All: candidates.length,
      'High Match': candidates.filter(c => c.screeningStatus === 'High Match').length,
      'Medium Match': candidates.filter(c => c.screeningStatus === 'Medium Match').length,
      'Low Match': candidates.filter(c => c.screeningStatus === 'Low Match').length,
      'Needs Review': candidates.filter(c => c.screeningStatus === 'Needs Review').length,
    };
    return counts;
  }, [candidates]);

  // --- Handlers ---
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // reset page on filter
  };

  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      jobOpening: 'All Openings',
      department: 'All Departments',
      experience: 'All Experience',
      aiMatchScore: 'All Scores',
      screeningStatus: 'All Status',
      dateRange: '01 Jun 2026 - 15 Jun 2026',
    });
    setActiveTab('All');
    setSortBy('score-desc');
    setCurrentPage(1);
  };

  const handleCheckboxToggleAll = () => {
    const allCheckedOnPage = paginatedCandidates.every(c => selectedCandidates[c.id]);
    const nextSelected = { ...selectedCandidates };

    paginatedCandidates.forEach(c => {
      if (allCheckedOnPage) {
        delete nextSelected[c.id];
      } else {
        nextSelected[c.id] = true;
      }
    });
    setSelectedCandidates(nextSelected);
  };

  const handleCheckboxToggleRow = (id: string) => {
    setSelectedCandidates(prev => {
      const copy = { ...prev };
      if (copy[id]) {
        delete copy[id];
      } else {
        copy[id] = true;
      }
      return copy;
    });
  };

  const handleAddCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Resolve screening status based on score & flagged toggle
    let status: 'High Match' | 'Medium Match' | 'Low Match' | 'Needs Review' = 'Medium Match';
    if (newCandidateForm.isFlagged) {
      status = 'Needs Review';
    } else if (newCandidateForm.aiMatchScore >= 70) {
      status = 'High Match';
    } else if (newCandidateForm.aiMatchScore >= 40) {
      status = 'Medium Match';
    } else {
      status = 'Low Match';
    }

    const newCandidate: Candidate = {
      id: `cand-${Date.now()}`,
      name: newCandidateForm.name || 'Anonymous Candidate',
      email: newCandidateForm.email || 'candidate@email.com',
      phone: newCandidateForm.phone || '+91 99999 88888',
      jobAppliedFor: {
        title: newCandidateForm.jobTitle,
        code: `JOB-2026-0${Math.floor(Math.random() * 80) + 10}`
      },
      experienceYears: Number(newCandidateForm.experienceYears) || 0,
      aiMatchScore: Number(newCandidateForm.aiMatchScore) || 50,
      topMatchedSkills: newCandidateForm.topSkills.split(',').map(s => s.trim()).filter(Boolean),
      aiSummary: newCandidateForm.aiSummary || 'Evaluated profile added manually.',
      screeningStatus: status
    };

    const updatedList = [newCandidate, ...candidates];
    setCandidates(updatedList);

    // Dynamically update main dashboard Metric Counts to reflect the manual entries
    const highCount = updatedList.filter(c => c.screeningStatus === 'High Match').length;
    const medCount = updatedList.filter(c => c.screeningStatus === 'Medium Match').length;
    const lowCount = updatedList.filter(c => c.screeningStatus === 'Low Match').length;
    const revCount = updatedList.filter(c => c.screeningStatus === 'Needs Review').length;

    setMetrics(prev => prev.map(m => {
      if (m.id === 'resumes') return { ...m, value: updatedList.length };
      if (m.id === 'high') return { ...m, value: 96 + (highCount - 5) }; // scaled relative to base image count
      if (m.id === 'medium') return { ...m, value: 28 + (medCount - 3) };
      if (m.id === 'low') return { ...m, value: 18 + (lowCount - 2) };
      if (m.id === 'review') return { ...m, value: 4 + (revCount - 1) };
      return m;
    }));

    // Reset Form & Close Modal
    setNewCandidateForm({
      name: '',
      email: '',
      phone: '',
      jobTitle: 'Software Developer',
      experienceYears: 3,
      aiMatchScore: 85,
      topSkills: 'React, TypeScript, CSS',
      aiSummary: 'Skilled engineer with great team collaboration skills and frontend focus.',
      isFlagged: false
    });
    setAddModalOpen(false);

    // Show instant success notice
    setExportNotice("Candidate added successfully!");
    setTimeout(() => setExportNotice(null), 3000);
  };

  const triggerExport = () => {
    setIsExporting(true);
    setExportNotice("Generating CSV file for download...");

    setTimeout(() => {
      // Build dummy CSV contents
      const headers = "ID,Name,Email,Phone,Job Title,Job Code,Experience,Match Score,Screening Status\n";
      const rows = filteredCandidates.map(c =>
        `"${c.id}","${c.name}","${c.email}","${c.phone}","${c.jobAppliedFor.title}","${c.jobAppliedFor.code}",${c.experienceYears},${c.aiMatchScore},"${c.screeningStatus}"`
      ).join("\n");

      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ai-screening-candidates-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setExportNotice("CSV downloaded successfully!");
      setTimeout(() => setExportNotice(null), 4000);
    }, 1200);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.jobOpening !== 'All Openings') count++;
    if (filters.department !== 'All Departments') count++;
    if (filters.experience !== 'All Experience') count++;
    if (filters.aiMatchScore !== 'All Scores') count++;
    if (filters.screeningStatus !== 'All Status') count++;
    if (filters.searchQuery !== '') count++;
    return count;
  }, [filters]);

  return (
    <div className="h-[calc(100vh-48px)] w-full flex flex-col overflow-hidden bg-slate-50/50 p-2 gap-1.5 select-none text-indigo-950">

      {/* Toast Notice */}
      {exportNotice && (
        <div className="fixed top-3 right-3 z-50 flex items-center gap-1.5 bg-indigo-950 text-white text-xs py-1.5 px-3 rounded-lg shadow-lg border border-indigo-800 transition-all">
          <Sparkles className="h-3 w-3 text-violet-400 animate-spin" />
          <span className="font-medium">{exportNotice}</span>
          <button onClick={() => setExportNotice(null)} className="hover:text-violet-300 ml-1">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* --- HEADER SECTION --- */}
      <header className="flex justify-between items-center bg-white px-2.5 py-1.5 rounded-lg border border-indigo-50/50 shadow-xs shrink-0">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            <h1 className="text-sm md:text-base font-bold font-display tracking-tight text-indigo-950">AI Screening</h1>
            <Star className="h-3.5 w-3.5 text-violet-600 fill-violet-200" />
          </div>
          <p className="text-[10px] md:text-xs text-indigo-900/80 font-medium">
            AI-powered screening and candidate fit analysis
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Export Action */}
          <button
            onClick={triggerExport}
            disabled={isExporting}
            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-950 bg-white border border-indigo-200/80 hover:bg-indigo-50/50 transition px-2.5 py-1.5 rounded-md shadow-2xs active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Download className="h-3 w-3 text-violet-700" />
            <span>{isExporting ? 'Exporting...' : 'Export'}</span>
          </button>

          {/* Settings Action */}
          <button
            onClick={() => setSettingsModalOpen(true)}
            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-950 bg-white border border-indigo-200/80 hover:bg-indigo-50/50 transition px-2.5 py-1.5 rounded-md shadow-2xs active:scale-95 cursor-pointer"
          >
            <Settings className="h-3 w-3 text-violet-700 animate-hover-spin" />
            <span>AI Settings</span>
          </button>

          {/* Add Candidate Action */}
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1 text-[11px] font-bold text-white bg-violet-700 hover:bg-violet-800 transition px-3 py-1.5 rounded-md shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Candidate</span>
          </button>
        </div>
      </header>

      {/* --- STATS / METRIC CARDS GRID --- */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-1.5 shrink-0">
        {metrics.map((card) => {
          const isSelectedTab = (card.id === 'resumes' && activeTab === 'All') ||
            (card.id === 'high' && activeTab === 'High Match') ||
            (card.id === 'medium' && activeTab === 'Medium Match') ||
            (card.id === 'low' && activeTab === 'Low Match') ||
            (card.id === 'review' && activeTab === 'Needs Review');

          return (
            <div
              key={card.id}
              onClick={() => {
                if (card.id === 'resumes') setActiveTab('All');
                else if (card.id === 'high') setActiveTab('High Match');
                else if (card.id === 'medium') setActiveTab('Medium Match');
                else if (card.id === 'low') setActiveTab('Low Match');
                else if (card.id === 'review') setActiveTab('Needs Review');
                setCurrentPage(1);
              }}
              className={`flex items-start gap-1.5 ${card.colorClass} border ${card.borderColorClass} p-1.5 rounded-lg shadow-2xs transition hover:shadow-xs active:scale-[0.98] cursor-pointer relative overflow-hidden ${isSelectedTab ? 'ring-2 ring-violet-600/80' : ''}`}
            >
              {/* Highlight background strip */}
              <div className="absolute top-0 left-0 w-1 h-full bg-violet-600/20" />

              {/* Icon Container */}
              <div className="p-1 rounded-md bg-white border border-indigo-50 shadow-3xs shrink-0 self-center">
                {card.iconName === 'resume' && <Briefcase className="h-4 w-4 text-violet-700" />}
                {card.iconName === 'high' && <CheckCircle2 className="h-4 w-4 text-emerald-700" />}
                {card.iconName === 'medium' && <Sparkles className="h-4 w-4 text-blue-700" />}
                {card.iconName === 'low' && <AlertTriangle className="h-4 w-4 text-amber-700" />}
                {card.iconName === 'review' && <ShieldAlert className="h-4 w-4 text-rose-700" />}
              </div>

              {/* Label and Numbers */}
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className={`text-[15px] font-extrabold font-mono leading-none ${card.numColorClass}`}>
                    {String(card.value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[9px] md:text-[10px] font-bold text-indigo-950 truncate leading-tight">
                  {card.title}
                </span>
                <span className="text-[8px] md:text-[9px] text-indigo-900/70 font-medium truncate leading-none">
                  {card.subtext}
                </span>
                <span className={`text-[8px] font-semibold ${card.textColorClass} mt-0.5 leading-none`}>
                  {card.changeText}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* --- FILTERS SECTION --- */}
      <section className="bg-white p-1.5 rounded-lg border border-indigo-50/50 shadow-3xs shrink-0 flex flex-col gap-1">
        {/* Search Input Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-900/60" />
            <input
              type="text"
              placeholder="Search by name, email, phone, job title or skills..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs text-indigo-950 placeholder-indigo-300 bg-slate-50/50 hover:bg-slate-50 border border-indigo-100 rounded-md focus:outline-hidden focus:ring-1 focus:ring-violet-500 focus:bg-white"
            />
            {filters.searchQuery && (
              <button
                onClick={() => handleFilterChange('searchQuery', '')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-900"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Filter Pill Counter */}
            <div className="flex items-center gap-1 bg-violet-50 border border-violet-100 px-2 py-1 rounded-md text-[10px] font-bold text-violet-950">
              <SlidersHorizontal className="h-3 w-3 text-violet-700" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex items-center justify-center bg-violet-700 text-white rounded-full w-4 h-4 text-[9px]">
                  {activeFiltersCount}
                </span>
              )}
            </div>

            {/* Clear All Trigger */}
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-0.5 text-[10px] font-bold text-violet-700 hover:text-violet-900 px-2 py-1 rounded-md bg-slate-50 border border-indigo-50 hover:bg-indigo-50/50 transition cursor-pointer"
            >
              <RefreshCw className="h-2.5 w-2.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* 6 Select Boxes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1">
          {/* Job Openings */}
          <div className="flex flex-col">
            <span className="text-[8px] font-extrabold text-indigo-900/70 tracking-wider mb-0.5 uppercase">Job Opening</span>
            <div className="relative">
              <select
                value={filters.jobOpening}
                onChange={(e) => handleFilterChange('jobOpening', e.target.value)}
                className="w-full h-6 pl-1.5 pr-5 text-[10px] font-semibold text-indigo-950 bg-white border border-indigo-100/80 rounded-md appearance-none focus:outline-hidden focus:ring-1 focus:ring-violet-500 cursor-pointer"
              >
                {UNIQUE_JOBS.map(job => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-indigo-950 pointer-events-none" />
            </div>
          </div>

          {/* Departments */}
          <div className="flex flex-col">
            <span className="text-[8px] font-extrabold text-indigo-900/70 tracking-wider mb-0.5 uppercase">Department</span>
            <div className="relative">
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="w-full h-6 pl-1.5 pr-5 text-[10px] font-semibold text-indigo-950 bg-white border border-indigo-100/80 rounded-md appearance-none focus:outline-hidden focus:ring-1 focus:ring-violet-500 cursor-pointer"
              >
                {UNIQUE_DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-indigo-950 pointer-events-none" />
            </div>
          </div>

          {/* Experience */}
          <div className="flex flex-col">
            <span className="text-[8px] font-extrabold text-indigo-900/70 tracking-wider mb-0.5 uppercase">Experience</span>
            <div className="relative">
              <select
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                className="w-full h-6 pl-1.5 pr-5 text-[10px] font-semibold text-indigo-950 bg-white border border-indigo-100/80 rounded-md appearance-none focus:outline-hidden focus:ring-1 focus:ring-violet-500 cursor-pointer"
              >
                {UNIQUE_EXPERIENCES.map(exp => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-indigo-950 pointer-events-none" />
            </div>
          </div>

          {/* AI Match Score */}
          <div className="flex flex-col">
            <span className="text-[8px] font-extrabold text-indigo-900/70 tracking-wider mb-0.5 uppercase">AI Match Score</span>
            <div className="relative">
              <select
                value={filters.aiMatchScore}
                onChange={(e) => handleFilterChange('aiMatchScore', e.target.value)}
                className="w-full h-6 pl-1.5 pr-5 text-[10px] font-semibold text-indigo-950 bg-white border border-indigo-100/80 rounded-md appearance-none focus:outline-hidden focus:ring-1 focus:ring-violet-500 cursor-pointer"
              >
                {UNIQUE_SCORES.map(score => (
                  <option key={score} value={score}>{score}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-indigo-950 pointer-events-none" />
            </div>
          </div>

          {/* Screening Status */}
          <div className="flex flex-col">
            <span className="text-[8px] font-extrabold text-indigo-900/70 tracking-wider mb-0.5 uppercase">Screening Status</span>
            <div className="relative">
              <select
                value={filters.screeningStatus}
                onChange={(e) => handleFilterChange('screeningStatus', e.target.value)}
                className="w-full h-6 pl-1.5 pr-5 text-[10px] font-semibold text-indigo-950 bg-white border border-indigo-100/80 rounded-md appearance-none focus:outline-hidden focus:ring-1 focus:ring-violet-500 cursor-pointer"
              >
                {UNIQUE_STATUSES.map(stat => (
                  <option key={stat} value={stat}>{stat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-indigo-950 pointer-events-none" />
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="flex flex-col">
            <span className="text-[8px] font-extrabold text-indigo-900/70 tracking-wider mb-0.5 uppercase">Date Range</span>
            <div className="relative">
              <div className="w-full h-6 px-1.5 flex items-center justify-between text-[9px] font-bold text-indigo-950 bg-white border border-indigo-100/80 rounded-md">
                <Calendar className="h-2.5 w-2.5 text-violet-700" />
                <span className="truncate">{filters.dateRange}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MIDDLE: AI SCREENING SUMMARY PANEL --- */}
      <section className="bg-linear-to-r from-violet-50/50 to-indigo-50/50 p-1.5 rounded-lg border border-indigo-100/80 shrink-0 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
        {/* Leftmost Column: Description */}
        <div className="flex flex-col gap-0.5 md:border-r border-indigo-100/50 md:pr-2">
          <span className="text-[10px] font-extrabold font-display text-violet-950 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-violet-700" />
            AI Screening Summary
          </span>
          <p className="text-[9px] text-indigo-900/80 leading-snug">
            AI model evaluated candidates based on skills, experience, education, and role fit.
          </p>
        </div>

        {/* Second Column: Matching Factors */}
        <div className="flex flex-col gap-1 md:border-r border-indigo-100/50 md:pr-2">
          <span className="text-[8px] font-extrabold text-indigo-900/70 tracking-wider uppercase">Top Matching Factors</span>
          <div className="flex flex-wrap gap-1">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm transition ${matchingFactors.skillsMatch ? 'bg-violet-100 text-violet-950 border border-violet-200' : 'bg-slate-100 text-slate-800'}`}>
              Skills Match
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm transition ${matchingFactors.experience ? 'bg-violet-100 text-violet-950 border border-violet-200' : 'bg-slate-100 text-slate-800'}`}>
              Experience
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm transition ${matchingFactors.education ? 'bg-violet-100 text-violet-950 border border-violet-200' : 'bg-slate-100 text-slate-800'}`}>
              Education
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm transition ${matchingFactors.jobTitleRelevance ? 'bg-violet-100 text-violet-950 border border-violet-200' : 'bg-slate-100 text-slate-800'}`}>
              Job Title Relevance
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm transition ${matchingFactors.keywords ? 'bg-violet-100 text-violet-950 border border-violet-200' : 'bg-slate-100 text-slate-800'}`}>
              Keywords
            </span>
          </div>
        </div>

        {/* Third Column: AI Confidence */}
        <div className="flex items-center gap-2 md:border-r border-indigo-100/50 md:pr-2">
          {/* Radial Indicator */}
          <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="15" className="stroke-indigo-100" strokeWidth="3" fill="transparent" />
              <circle cx="18" cy="18" r="15" className="stroke-emerald-500" strokeWidth="3" strokeDasharray={`${2 * Math.PI * 15}`} strokeDashoffset={`${2 * Math.PI * 15 * (1 - confidenceScore / 100)}`} strokeLinecap="round" fill="transparent" />
            </svg>
            <span className="absolute text-[9px] font-extrabold text-indigo-950 font-mono">{confidenceScore}%</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[8px] font-extrabold text-indigo-900/70 tracking-wider uppercase">AI Model Confidence</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-emerald-950">High</span>
              <span className="text-[9px] text-indigo-900/80">Model Accuracy</span>
              <Info className="h-2.5 w-2.5 text-indigo-900/60" />
            </div>
          </div>
        </div>

        {/* Fourth Column: Bias Check */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-800" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-extrabold text-indigo-900/70 tracking-wider uppercase">Bias Check</span>
            <span className="text-[10px] font-bold text-emerald-950 leading-tight">Passed</span>
            <span className="text-[9px] text-indigo-900/80 leading-none">No bias detected in screening</span>
          </div>
        </div>
      </section>

      {/* --- BOTTOM SECTION: INTERACTIVE CANDIDATE TABLE --- */}
      <section className="flex-1 bg-white border border-indigo-100/80 rounded-lg shadow-2xs overflow-hidden flex flex-col min-h-0">

        {/* Table Tabs and Control Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-indigo-50 px-2.5 py-1.5 shrink-0 gap-1.5">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1 text-[10px] font-extrabold">
            <button
              onClick={() => { setActiveTab('All'); setCurrentPage(1); }}
              className={`px-2 py-1 rounded-md transition cursor-pointer ${activeTab === 'All' ? 'bg-violet-700 text-white shadow-xs' : 'text-indigo-900 hover:bg-slate-50 border border-transparent'}`}
            >
              AI Screened ({tabCounts.All})
            </button>
            <button
              onClick={() => { setActiveTab('High Match'); setCurrentPage(1); }}
              className={`px-2 py-1 rounded-md transition cursor-pointer ${activeTab === 'High Match' ? 'bg-emerald-700 text-white shadow-xs' : 'text-emerald-950 hover:bg-slate-50 border border-transparent'}`}
            >
              High Match ({tabCounts['High Match']})
            </button>
            <button
              onClick={() => { setActiveTab('Medium Match'); setCurrentPage(1); }}
              className={`px-2 py-1 rounded-md transition cursor-pointer ${activeTab === 'Medium Match' ? 'bg-blue-700 text-white shadow-xs' : 'text-blue-950 hover:bg-slate-50 border border-transparent'}`}
            >
              Medium Match ({tabCounts['Medium Match']})
            </button>
            <button
              onClick={() => { setActiveTab('Low Match'); setCurrentPage(1); }}
              className={`px-2 py-1 rounded-md transition cursor-pointer ${activeTab === 'Low Match' ? 'bg-amber-700 text-white shadow-xs' : 'text-amber-950 hover:bg-slate-50 border border-transparent'}`}
            >
              Low Match ({tabCounts['Low Match']})
            </button>
            <button
              onClick={() => { setActiveTab('Needs Review'); setCurrentPage(1); }}
              className={`px-2 py-1 rounded-md transition cursor-pointer ${activeTab === 'Needs Review' ? 'bg-rose-700 text-white shadow-xs' : 'text-rose-950 hover:bg-slate-50 border border-transparent'}`}
            >
              Needs Review ({tabCounts['Needs Review']})
            </button>
          </div>

          {/* Column Toggle & Sort Select */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            {/* Columns Toggle Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}
                className="flex items-center gap-1 text-[10px] font-bold text-indigo-950 bg-white border border-indigo-200 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
              >
                <Columns className="h-3.5 w-3.5 text-violet-700" />
                <span>Columns</span>
              </button>

              {showColumnsDropdown && (
                <div className="absolute right-0 mt-1 w-40 bg-white border border-indigo-100 rounded-lg shadow-lg z-30 p-2 text-xs flex flex-col gap-1.5">
                  <div className="font-extrabold text-indigo-950 pb-1 border-b border-indigo-50">Visible Columns</div>
                  <label className="flex items-center gap-2 text-indigo-900 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-violet-700 rounded" />
                    <span>Candidate</span>
                  </label>
                  <label className="flex items-center gap-2 text-indigo-900 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-violet-700 rounded" />
                    <span>Job Details</span>
                  </label>
                  <label className="flex items-center gap-2 text-indigo-900 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-violet-700 rounded" />
                    <span>AI Match Score</span>
                  </label>
                  <label className="flex items-center gap-2 text-indigo-900 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-violet-700 rounded" />
                    <span>Skills Match</span>
                  </label>
                  <button
                    onClick={() => setShowColumnsDropdown(false)}
                    className="w-full text-center bg-violet-700 text-white text-[10px] py-1 rounded-md font-bold mt-1"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-7 text-[10px] font-bold text-indigo-950 bg-white border border-indigo-200 rounded-md px-1.5 appearance-none pr-6 relative focus:outline-hidden cursor-pointer"
              >
                <option value="score-desc">Score (High to Low)</option>
                <option value="score-asc">Score (Low to High)</option>
                <option value="experience-desc">Experience (Highest First)</option>
              </select>
              <ChevronDown className="h-2.5 w-2.5 text-indigo-950 -ml-5 pointer-events-none z-10" />
            </div>
          </div>
        </div>

        {/* Main Database Table Grid */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-white">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 bg-indigo-50/50 z-10 border-b border-indigo-100">
              <tr className="text-[9px] md:text-[10px] font-extrabold uppercase tracking-wider text-indigo-950/90 h-8">
                <th className="w-8 pl-3 py-1.5">
                  <input
                    type="checkbox"
                    checked={paginatedCandidates.length > 0 && paginatedCandidates.every(c => selectedCandidates[c.id])}
                    onChange={handleCheckboxToggleAll}
                    className="accent-violet-700 rounded cursor-pointer h-3.5 w-3.5"
                  />
                </th>
                <th className="w-1/4 px-2 py-1.5">Candidate</th>
                <th className="w-1/5 px-2 py-1.5">Job Applied For</th>
                <th className="w-[8%] px-1 py-1.5 text-center">Exp.</th>
                <th className="w-[12%] px-2 py-1.5">AI Match Score</th>
                <th className="w-1/6 px-2 py-1.5">Top Matched Skills</th>
                <th className="w-1/4 px-2 py-1.5">AI Summary</th>
                <th className="w-1/6 px-2 py-1.5">Screening Status</th>
                <th className="w-20 pr-3 py-1.5 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-indigo-50/70">
              {paginatedCandidates.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-xs font-bold text-indigo-900/60 bg-slate-50/30">
                    <Info className="h-6 w-6 text-violet-300 mx-auto mb-1.5" />
                    No candidates found matching the active filters.
                  </td>
                </tr>
              ) : (
                paginatedCandidates.map((candidate) => {
                  const isChecked = !!selectedCandidates[candidate.id];

                  // Score color logic
                  let scoreBadgeBg = 'bg-rose-50 border-rose-100 text-rose-900';
                  let scoreRingColor = 'stroke-rose-500';
                  let matchLabel = 'Low Match';

                  if (candidate.aiMatchScore >= 85) {
                    scoreBadgeBg = 'bg-emerald-50 border-emerald-100 text-emerald-950';
                    scoreRingColor = 'stroke-emerald-500';
                    matchLabel = 'Excellent Match';
                  } else if (candidate.aiMatchScore >= 70) {
                    scoreBadgeBg = 'bg-teal-50 border-teal-100 text-teal-950';
                    scoreRingColor = 'stroke-teal-500';
                    matchLabel = 'Good Match';
                  } else if (candidate.aiMatchScore >= 40) {
                    scoreBadgeBg = 'bg-amber-50 border-amber-100 text-amber-950';
                    scoreRingColor = 'stroke-amber-500';
                    matchLabel = 'Average Match';
                  }

                  // Status Badge Colors
                  let statusBadgeClass = 'bg-rose-100/80 text-rose-950 border border-rose-200/50';
                  let statusSubLabel = 'Not Recommended';

                  if (candidate.screeningStatus === 'High Match') {
                    statusBadgeClass = 'bg-emerald-100/80 text-emerald-950 border border-emerald-200/50';
                    statusSubLabel = 'Auto Shortlist';
                  } else if (candidate.screeningStatus === 'Medium Match') {
                    statusBadgeClass = 'bg-amber-100/80 text-amber-950 border border-amber-200/50';
                    statusSubLabel = 'Review Recommended';
                  } else if (candidate.screeningStatus === 'Needs Review') {
                    statusBadgeClass = 'bg-purple-100/80 text-purple-950 border border-purple-200/50';
                    statusSubLabel = 'Auto Flagged';
                  }

                  return (
                    <tr
                      key={candidate.id}
                      className={`text-[11px] leading-tight hover:bg-slate-50/50 transition duration-150 ${isChecked ? 'bg-violet-50/20' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="pl-3 py-1.5 self-center align-middle">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxToggleRow(candidate.id)}
                          className="accent-violet-700 rounded cursor-pointer h-3.5 w-3.5"
                        />
                      </td>

                      {/* Candidate Identity */}
                      <td className="px-2 py-1.5 align-middle">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {candidate.avatarUrl ? (
                            <img
                              src={candidate.avatarUrl}
                              alt={candidate.name}
                              referrerPolicy="no-referrer"
                              className="h-7 w-7 rounded-full object-cover border border-indigo-100 shadow-3xs shrink-0"
                            />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-900 shrink-0 border border-indigo-200">
                              {candidate.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-indigo-950 truncate">{candidate.name}</span>
                            <span className="text-[9px] text-indigo-900/80 font-medium truncate">{candidate.email}</span>
                            <span className="text-[8px] text-indigo-900/60 font-medium truncate">{candidate.phone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Job Details */}
                      <td className="px-2 py-1.5 align-middle">
                        <div className="flex flex-col min-w-0">
                          <span className="font-extrabold text-indigo-950 truncate">{candidate.jobAppliedFor.title}</span>
                          <span className="text-[9px] font-semibold text-violet-700">{candidate.jobAppliedFor.code}</span>
                        </div>
                      </td>

                      {/* Experience */}
                      <td className="px-1 py-1.5 text-center font-extrabold text-indigo-950 align-middle">
                        {candidate.experienceYears}y
                      </td>

                      {/* AI Match Score with Mini Radial Progress */}
                      <td className="px-2 py-1.5 align-middle">
                        <div className="flex items-center gap-1.5">
                          <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="14" cy="14" r="11" className="stroke-indigo-50" strokeWidth="2.2" fill="transparent" />
                              <circle cx="14" cy="14" r="11" className={scoreRingColor} strokeWidth="2.2" strokeDasharray={`${2 * Math.PI * 11}`} strokeDashoffset={`${2 * Math.PI * 11 * (1 - candidate.aiMatchScore / 100)}`} strokeLinecap="round" fill="transparent" />
                            </svg>
                            <span className="absolute text-[8px] font-extrabold text-indigo-950 font-mono">{candidate.aiMatchScore}%</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-[10px] text-indigo-950">{candidate.aiMatchScore}% Match</span>
                            <span className="text-[8px] font-bold text-indigo-900/70 truncate">{matchLabel}</span>
                          </div>
                        </div>
                      </td>

                      {/* Top Matched Skills Tags */}
                      <td className="px-2 py-1.5 align-middle">
                        <div className="flex flex-wrap gap-0.5 max-w-full">
                          {candidate.topMatchedSkills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="text-[8px] font-bold px-1.5 py-0.5 rounded-sm bg-indigo-50 text-indigo-950 border border-indigo-100"
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.topMatchedSkills.length > 3 && (
                            <span className="text-[8px] font-extrabold text-violet-700 bg-violet-50 border border-violet-100 px-1 py-0.5 rounded-sm">
                              +{candidate.topMatchedSkills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* AI Summary */}
                      <td className="px-2 py-1.5 text-[9px] text-indigo-900/95 font-medium align-middle">
                        <p className="line-clamp-2 leading-relaxed" title={candidate.aiSummary}>
                          {candidate.aiSummary}
                        </p>
                      </td>

                      {/* Screening Status Badge */}
                      <td className="px-2 py-1.5 align-middle">
                        <div className="flex flex-col items-start gap-0.5">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusBadgeClass}`}>
                            {candidate.screeningStatus}
                          </span>
                          <span className="text-[8px] font-bold text-indigo-900/60 pl-1">
                            {statusSubLabel}
                          </span>
                        </div>
                      </td>

                      {/* Individual Actions */}
                      <td className="px-2 py-1.5 align-middle text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* View detailed analysis card */}
                          <button
                            onClick={() => setSelectedCandidate(candidate)}
                            title="View AI Analysis"
                            className="p-1 rounded-md bg-indigo-50/50 hover:bg-indigo-100/80 hover:text-violet-900 text-indigo-950 transition cursor-pointer"
                          >
                            <Eye className="h-3 w-3" />
                          </button>

                          <button
                            onClick={() => {
                              setExportNotice(`Instant interview invitation sent to ${candidate.name}!`);
                              setTimeout(() => setExportNotice(null), 3000);
                            }}
                            title="Send Invite"
                            className="p-1 rounded-md bg-indigo-50/50 hover:bg-indigo-100/80 hover:text-violet-900 text-indigo-950 transition cursor-pointer"
                          >
                            <Mail className="h-3 w-3" />
                          </button>

                          <button
                            onClick={() => {
                              // delete option
                              if (confirm(`Remove ${candidate.name}?`)) {
                                setCandidates(prev => prev.filter(c => c.id !== candidate.id));
                              }
                            }}
                            title="Remove"
                            className="p-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-900 transition cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Footer */}
        <footer className="bg-slate-50 border-t border-indigo-50 px-3 py-1.5 shrink-0 flex items-center justify-between text-[11px] font-medium text-indigo-900/90 gap-1.5">
          <div className="flex items-center gap-1">
            <span>Showing</span>
            <span className="font-extrabold text-indigo-950">{(currentPage - 1) * pageSize + 1}</span>
            <span>to</span>
            <span className="font-extrabold text-indigo-950">
              {Math.min(currentPage * pageSize, filteredCandidates.length)}
            </span>
            <span>of</span>
            <span className="font-extrabold text-indigo-950">{filteredCandidates.length}</span>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Page size controller */}
            <div className="flex items-center gap-1 shrink-0">
              <span>Show</span>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  className="h-6 text-[10px] font-bold text-indigo-950 bg-white border border-indigo-200 rounded-md px-1.5 pr-5 appearance-none cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
                <ChevronDown className="h-2.5 w-2.5 text-indigo-950 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span>entries</span>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md border border-indigo-200/80 bg-white hover:bg-slate-50 text-indigo-950 disabled:opacity-50 disabled:hover:bg-white cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-0.5">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-6 h-6 flex items-center justify-center text-[10px] font-extrabold rounded-md border cursor-pointer ${currentPage === idx + 1 ? 'bg-violet-700 border-violet-700 text-white shadow-3xs' : 'bg-white border-indigo-200 text-indigo-950 hover:bg-slate-50'}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md border border-indigo-200/80 bg-white hover:bg-slate-50 text-indigo-950 disabled:opacity-50 disabled:hover:bg-white cursor-pointer"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </footer>
      </section>

      {/* --- ADD CANDIDATE INTERACTIVE MODAL --- */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-2xs z-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-lg border border-indigo-100 shadow-xl w-full max-w-md p-3 text-indigo-950 flex flex-col gap-2 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-indigo-50 pb-1.5">
              <div className="flex items-center gap-1 text-violet-700 font-extrabold font-display">
                <Sparkles className="h-4 w-4" />
                <span>Add Screened Candidate Profile</span>
              </div>
              <button onClick={() => setAddModalOpen(false)} className="p-1 rounded-md hover:bg-slate-100 text-indigo-400 hover:text-indigo-950">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddCandidateSubmit} className="flex flex-col gap-2.5">
              {/* Name */}
              <div className="flex flex-col">
                <label className="text-[9px] font-extrabold text-indigo-900/80 uppercase tracking-wider mb-0.5">Candidate Name *</label>
                <input
                  type="text"
                  required
                  value={newCandidateForm.name}
                  onChange={(e) => setNewCandidateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ananya Verma"
                  className="h-8 px-2.5 text-xs text-indigo-950 bg-slate-50 border border-indigo-100 rounded-md focus:outline-hidden focus:ring-1 focus:ring-violet-500"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <label className="text-[9px] font-extrabold text-indigo-900/80 uppercase tracking-wider mb-0.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newCandidateForm.email}
                    onChange={(e) => setNewCandidateForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="name@email.com"
                    className="h-8 px-2.5 text-xs text-indigo-950 bg-slate-50 border border-indigo-100 rounded-md focus:outline-hidden focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] font-extrabold text-indigo-900/80 uppercase tracking-wider mb-0.5">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newCandidateForm.phone}
                    onChange={(e) => setNewCandidateForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="h-8 px-2.5 text-xs text-indigo-950 bg-slate-50 border border-indigo-100 rounded-md focus:outline-hidden focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>

              {/* Job applied and Experience */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <label className="text-[9px] font-extrabold text-indigo-900/80 uppercase tracking-wider mb-0.5">Job applied for</label>
                  <select
                    value={newCandidateForm.jobTitle}
                    onChange={(e) => setNewCandidateForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                    className="h-8 px-2 text-xs text-indigo-950 bg-slate-50 border border-indigo-100 rounded-md focus:outline-hidden focus:ring-1 focus:ring-violet-500"
                  >
                    {UNIQUE_JOBS.filter(j => j !== 'All Openings').map(job => (
                      <option key={job} value={job}>{job}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] font-extrabold text-indigo-900/80 uppercase tracking-wider mb-0.5">Years Experience</label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    step="0.1"
                    value={newCandidateForm.experienceYears}
                    onChange={(e) => setNewCandidateForm(prev => ({ ...prev, experienceYears: parseFloat(e.target.value) || 0 }))}
                    className="h-8 px-2.5 text-xs text-indigo-950 bg-slate-50 border border-indigo-100 rounded-md focus:outline-hidden focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>

              {/* AI Score & Toggle */}
              <div className="grid grid-cols-2 gap-2 items-center bg-violet-50/50 p-2 border border-violet-100/50 rounded-lg">
                <div className="flex flex-col">
                  <label className="text-[9px] font-extrabold text-indigo-900/80 uppercase tracking-wider mb-0.5">AI Match Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newCandidateForm.aiMatchScore}
                    onChange={(e) => setNewCandidateForm(prev => ({ ...prev, aiMatchScore: parseInt(e.target.value) || 50 }))}
                    className="h-8 px-2.5 text-xs text-indigo-950 bg-white border border-indigo-100 rounded-md focus:outline-hidden"
                  />
                </div>
                <div className="flex items-center gap-1.5 self-end pb-1">
                  <input
                    type="checkbox"
                    id="flagCheck"
                    checked={newCandidateForm.isFlagged}
                    onChange={(e) => setNewCandidateForm(prev => ({ ...prev, isFlagged: e.target.checked }))}
                    className="accent-violet-700 h-4 w-4 rounded cursor-pointer"
                  />
                  <label htmlFor="flagCheck" className="text-[10px] font-extrabold text-rose-950 cursor-pointer flex items-center gap-0.5">
                    <ShieldAlert className="h-3 w-3 text-rose-700" />
                    <span>AI Flag (Needs Review)</span>
                  </label>
                </div>
              </div>

              {/* Skills comma separated */}
              <div className="flex flex-col">
                <label className="text-[9px] font-extrabold text-indigo-900/80 uppercase tracking-wider mb-0.5">Key Skills (comma separated)</label>
                <input
                  type="text"
                  value={newCandidateForm.topSkills}
                  onChange={(e) => setNewCandidateForm(prev => ({ ...prev, topSkills: e.target.value }))}
                  placeholder="Java, Spring, Hibernate"
                  className="h-8 px-2.5 text-xs text-indigo-950 bg-slate-50 border border-indigo-100 rounded-md focus:outline-hidden"
                />
              </div>

              {/* Summary */}
              <div className="flex flex-col">
                <label className="text-[9px] font-extrabold text-indigo-900/80 uppercase tracking-wider mb-0.5">AI Summary Statement</label>
                <textarea
                  rows={2}
                  value={newCandidateForm.aiSummary}
                  onChange={(e) => setNewCandidateForm(prev => ({ ...prev, aiSummary: e.target.value }))}
                  placeholder="Enter a brief summary statement of candidate strengths..."
                  className="p-2 text-xs text-indigo-950 bg-slate-50 border border-indigo-100 rounded-md focus:outline-hidden resize-none"
                />
              </div>

              {/* Submit triggers */}
              <div className="flex items-center gap-2 justify-end pt-1 border-t border-indigo-50 mt-1">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-950 hover:bg-slate-100 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-violet-700 hover:bg-violet-800 rounded-md shadow-xs cursor-pointer"
                >
                  Submit Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- AI CONFIGURATION / SETTINGS MODAL --- */}
      {settingsModalOpen && (
        <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-2xs z-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-lg border border-indigo-100 shadow-xl w-full max-w-sm p-3 text-indigo-950 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-indigo-50 pb-1.5">
              <div className="flex items-center gap-1.5 text-violet-700 font-extrabold font-display">
                <Settings className="h-4 w-4" />
                <span>AI Screening Model Settings</span>
              </div>
              <button onClick={() => setSettingsModalOpen(false)} className="p-1 rounded-md hover:bg-slate-100 text-indigo-400 hover:text-indigo-950">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* Threshold Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-extrabold text-indigo-950 uppercase">Model Accuracy Rating</span>
                  <span className="text-xs font-mono font-extrabold text-violet-700">{confidenceScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={confidenceScore}
                  onChange={(e) => setConfidenceScore(parseInt(e.target.value))}
                  className="w-full accent-violet-700 cursor-pointer"
                />
                <span className="text-[9px] text-indigo-900/70">
                  Sets the threshold of accuracy calculations mapped across skills benchmarks.
                </span>
              </div>

              {/* Matching Factors checkboxes */}
              <div className="flex flex-col gap-1.5 border-t border-indigo-50 pt-2">
                <span className="text-[10px] font-extrabold text-indigo-950 uppercase mb-0.5">Enable Match Factors</span>

                <label className="flex items-center gap-2 text-xs font-medium text-indigo-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={matchingFactors.skillsMatch}
                    onChange={(e) => setMatchingFactors(prev => ({ ...prev, skillsMatch: e.target.checked }))}
                    className="accent-violet-700 rounded h-3.5 w-3.5"
                  />
                  <span>Compare Candidate Core Skills</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-indigo-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={matchingFactors.experience}
                    onChange={(e) => setMatchingFactors(prev => ({ ...prev, experience: e.target.checked }))}
                    className="accent-violet-700 rounded h-3.5 w-3.5"
                  />
                  <span>Benchmark Career Experience Duration</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-indigo-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={matchingFactors.education}
                    onChange={(e) => setMatchingFactors(prev => ({ ...prev, education: e.target.checked }))}
                    className="accent-violet-700 rounded h-3.5 w-3.5"
                  />
                  <span>Validate Academic Profile Criteria</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-indigo-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={matchingFactors.jobTitleRelevance}
                    onChange={(e) => setMatchingFactors(prev => ({ ...prev, jobTitleRelevance: e.target.checked }))}
                    className="accent-violet-700 rounded h-3.5 w-3.5"
                  />
                  <span>Verify Historical Job Title Relevance</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-indigo-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={matchingFactors.keywords}
                    onChange={(e) => setMatchingFactors(prev => ({ ...prev, keywords: e.target.checked }))}
                    className="accent-violet-700 rounded h-3.5 w-3.5"
                  />
                  <span>Scan Resume Semantic Keywords</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 justify-end pt-2 border-t border-indigo-50 mt-1">
                <button
                  onClick={() => setSettingsModalOpen(false)}
                  className="w-full bg-violet-700 hover:bg-violet-800 text-white text-xs py-1.5 rounded-md font-bold"
                >
                  Apply Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DETAILED ANALYSIS PREVIEW PANEL --- */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-2xs z-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-lg border border-indigo-100 shadow-xl w-full max-w-md p-4 text-indigo-950 flex flex-col gap-2 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-indigo-50 pb-2">
              <div className="flex items-center gap-1.5 text-violet-700 font-extrabold font-display">
                <Sparkles className="h-4.5 w-4.5" />
                <span>AI Deep Evaluation Analysis</span>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="p-1 rounded-md hover:bg-slate-100 text-indigo-400 hover:text-indigo-950">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* Header Profile Info */}
              <div className="flex items-center gap-3 bg-violet-50/50 p-2.5 rounded-lg border border-violet-100/30">
                {selectedCandidate.avatarUrl ? (
                  <img
                    src={selectedCandidate.avatarUrl}
                    alt={selectedCandidate.name}
                    referrerPolicy="no-referrer"
                    className="h-11 w-11 rounded-full object-cover border-2 border-violet-200"
                  />
                ) : (
                  <div className="h-11 w-11 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-900 border-2 border-indigo-200">
                    {selectedCandidate.name.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold text-indigo-950">{selectedCandidate.name}</span>
                  <span className="text-[10px] text-indigo-900/80 font-semibold">{selectedCandidate.jobAppliedFor.title}</span>
                  <span className="text-[9px] text-violet-700 font-bold">{selectedCandidate.jobAppliedFor.code}</span>
                </div>
              </div>

              {/* Score Breakdown block */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-2 rounded-lg border border-indigo-100/50 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-extrabold text-indigo-900/70 tracking-wider uppercase mb-1">AI Match Score</span>
                  <div className="text-xl font-mono font-extrabold text-violet-700">{selectedCandidate.aiMatchScore}%</div>
                  <span className="text-[9px] font-bold text-violet-950 mt-0.5">Confidence Level</span>
                </div>

                <div className="bg-slate-50 p-2 rounded-lg border border-indigo-100/50 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-extrabold text-indigo-900/70 tracking-wider uppercase mb-1">Career Duration</span>
                  <div className="text-xl font-mono font-extrabold text-violet-700">{selectedCandidate.experienceYears}y</div>
                  <span className="text-[9px] font-bold text-violet-950 mt-0.5">Relevant Experience</span>
                </div>
              </div>

              {/* Key Skills tags */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold text-indigo-900/80 uppercase">Top Match Skillsets</span>
                <div className="flex flex-wrap gap-1">
                  {selectedCandidate.topMatchedSkills.map((skill, index) => (
                    <span key={index} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-950 border border-indigo-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Evaluation Paragraph */}
              <div className="flex flex-col gap-1 border-t border-indigo-50 pt-2">
                <span className="text-[10px] font-extrabold text-indigo-900/80 uppercase">AI Agent Evaluator Remarks</span>
                <p className="text-xs text-indigo-950 leading-relaxed bg-slate-50/50 p-2 rounded-lg border border-indigo-50">
                  {selectedCandidate.aiSummary} The candidate demonstrates exceptional alignment with {selectedCandidate.jobAppliedFor.title} requirements.
                  Their professional tenure of {selectedCandidate.experienceYears} years coupled with expert knowledge in core competencies qualifies them for automated ranking.
                </p>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center justify-between border-t border-indigo-50 pt-2 mt-1">
                <div className="flex flex-col">
                  <span className="text-[8px] font-extrabold text-indigo-900/70 uppercase">Current Status</span>
                  <span className="text-[10px] font-extrabold text-violet-950">{selectedCandidate.screeningStatus}</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-950 bg-slate-50 hover:bg-slate-100 border border-indigo-200/50 rounded-md cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setExportNotice(`Invitation sent to ${selectedCandidate.name}!`);
                      setSelectedCandidate(null);
                      setTimeout(() => setExportNotice(null), 3500);
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-violet-700 hover:bg-violet-800 rounded-md shadow-xs cursor-pointer"
                  >
                    Shortlist Candidate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
