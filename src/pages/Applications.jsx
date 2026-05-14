import { useState } from "react";
import { Link } from "react-router-dom";
import { TbBriefcase2 } from "react-icons/tb";
import { MdOpenInNew } from "react-icons/md";
import { FiPlus } from "react-icons/fi";

const STATUS_STYLES = {
  Applied:    { pill: "bg-sky-100 text-sky-700",      dot: "bg-sky-400" },
  Interview:  { pill: "bg-amber-100 text-amber-700",  dot: "bg-amber-400" },
  Offered:    { pill: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
  Rejected:   { pill: "bg-red-100 text-red-600",      dot: "bg-red-400" },
  Withdrawn:  { pill: "bg-slate-100 text-slate-500",  dot: "bg-slate-300" },
};

const SAMPLE_JOBS = [
  { id: 1, company: "TechFlow",    title: "Senior UX Designer",      status: "Interview",  date: "Oct 24, 2023", link: "#" },
  { id: 2, company: "Acme Corp",   title: "Product Manager",         status: "Applied",    date: "Nov 1, 2023",  link: "#" },
  { id: 3, company: "StartupXYZ", title: "Frontend Engineer",        status: "Offered",    date: "Oct 30, 2023", link: "#" },
  { id: 4, company: "Globex",      title: "Data Analyst",            status: "Rejected",   date: "Oct 18, 2023", link: "#" },
  { id: 5, company: "Initech",     title: "UX Researcher",           status: "Withdrawn",  date: "Oct 10, 2023", link: "#" },
  { id: 6, company: "Hooli",       title: "Systems Engineer",        status: "Applied",    date: "Nov 3, 2023",  link: "#" },
  { id: 7, company: "Pied Piper",  title: "Full-Stack Developer",    status: "Interview",  date: "Nov 5, 2023",  link: "#" },
  { id: 8, company: "Raviga",      title: "Growth Marketer",         status: "Rejected",   date: "Oct 28, 2023", link: "#" },
];

const TABS = ["All", ...Object.keys(STATUS_STYLES)];

const counts = SAMPLE_JOBS.reduce((acc, j) => {
  acc[j.status] = (acc[j.status] || 0) + 1;
  return acc;
}, {});

export default function Applications() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? SAMPLE_JOBS : SAMPLE_JOBS.filter((j) => j.status === active);

  return (
    <div className="px-4 py-16 md:px-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Applications</h1>
          <p className="text-sm text-slate-400 mt-0.5">{SAMPLE_JOBS.length} total tracked</p>
        </div>
        <Link to="/add-job">
          <button className="flex items-center gap-1.5 bg-[#6d28d9] hover:bg-[#5b21b6] active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-purple-200 transition-all">
            <FiPlus size={16} />
            Add Application
          </button>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {TABS.map((tab) => {
          const isActive = active === tab;
          const count = tab === "All" ? SAMPLE_JOBS.length : (counts[tab] || 0);
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-[#6d28d9] text-white border-[#6d28d9] shadow-md shadow-purple-200"
                  : "bg-white text-slate-500 border-slate-200 hover:border-purple-300 hover:text-slate-700"
              }`}
            >
              {tab}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Job cards grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-300 gap-3">
          <TbBriefcase2 size={40} />
          <p className="text-sm">No applications in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((job) => {
            const s = STATUS_STYLES[job.status];
            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 flex flex-col gap-4"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                      <TbBriefcase2 size={20} className="text-violet-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 leading-tight">{job.company}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{job.title}</p>
                    </div>
                  </div>
                  {job.link && (
                    <a href={job.link} target="_blank" rel="noreferrer"
                      className="text-slate-300 hover:text-violet-500 transition-colors mt-0.5">
                      <MdOpenInNew size={16} />
                    </a>
                  )}
                </div>

                {/* Footer row */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.pill}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {job.status}
                  </span>
                  <span className="text-xs text-slate-300">{job.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}