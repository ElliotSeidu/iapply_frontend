import { FaRegBell } from "react-icons/fa";
import { MdWorkOutline, MdOutlineEvent, MdOutlineThumbUp } from "react-icons/md";

const notifs = [
  {
    id: 1, icon: <MdOutlineEvent size={18} className="text-amber-600" />, bg: "bg-amber-50",
    title: "Interview Reminder", body: "Your interview with Acme Corp is tomorrow at 10 AM.", time: "2h ago", unread: true,
  },
  {
    id: 2, icon: <MdOutlineThumbUp size={18} className="text-emerald-600" />, bg: "bg-emerald-50",
    title: "Offer Received 🎉", body: "Congratulations! You received an offer from StartupXYZ.", time: "1d ago", unread: true,
  },
  {
    id: 3, icon: <MdWorkOutline size={18} className="text-violet-600" />, bg: "bg-violet-50",
    title: "Application Viewed", body: "Your application at TechCorp was viewed by the recruiter.", time: "3d ago", unread: false,
  },
];

const Notifications = () => {
  return (
    <div className="px-4 py-16 md:px-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Notifications</h1>
          <p className="text-sm text-slate-400 mt-1">Stay on top of every update.</p>
        </div>
        <button className="text-xs text-[#6d28d9] font-medium hover:underline">Mark all read</button>
      </div>

      <div className="flex flex-col gap-3 max-w-2xl">
        {notifs.map((n) => (
          <div
            key={n.id}
            className={`flex items-start gap-4 bg-white rounded-2xl border shadow-sm px-5 py-4 transition ${
              n.unread ? "border-purple-100" : "border-slate-100"
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${n.bg}`}>
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-800 truncate">{n.title}</p>
                <span className="text-[11px] text-slate-300 flex-shrink-0">{n.time}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
            </div>
            {n.unread && <span className="w-2 h-2 rounded-full bg-[#7c3aed] mt-1.5 flex-shrink-0" />}
          </div>
        ))}

        {notifs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-3">
            <FaRegBell size={36} />
            <p className="text-sm">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;