// Types mirror the Django REST Framework serializers exactly (accounts + tracker apps).
// Keeping these 1:1 with the backend avoids the frontend inventing fields that are
// silently discarded (or worse, faked) — a common source of confusing "data loss" bugs.

export const CHANNEL_LABELS = {
    linkedin: "LinkedIn",
    referral: "Referral",
    company_site: "Company Site",
    email: "Email",
    job_fair: "Job Fair",
    recruiter: "Recruiter Outreach",
    other: "Other",
};
export const STATUS_LABELS = {
    applied: "Applied",
    oa: "Online Assessment",
    interview: "Interview",
    offer: "Offer",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
};

// Board/analytics ordering — matches the natural funnel progression.
export const STATUS_ORDER = [
    "applied",
    "oa",
    "interview",
    "offer",
    "rejected",
    "withdrawn",
];

// Payload for creating/editing an application. current_status/id/timestamps are
// server-controlled — the API rejects (ignores) them if sent, so we never send them.
export const WORK_MODEL_LABELS = {
    remote: "Remote",
    in_person: "In-person",
    hybrid: "Hybrid",
};
export const JOB_TYPE_LABELS = {
    full_time: "Full-time",
    part_time: "Part-time",
    contract: "Contract",
    internship: "Internship",
};
