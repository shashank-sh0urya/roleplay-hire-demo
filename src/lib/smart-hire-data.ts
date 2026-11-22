export type DemoRole = "candidate" | "recruiter" | "admin";
export type JobType = "Full-time" | "Internship" | "Contract";
export type ApplicationStatus =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Selected"
  | "Rejected";

export interface Company {
  id: string;
  name: string;
  initials: string;
  industry: string;
  size: string;
  headquarters: string;
  website: string;
  careers: string;
  about: string;
  locations: string[];
  technologies: string[];
  culture: string;
  products: string;
  interviewProcess: string[];
  interviewTopics: string[];
}

export interface Job {
  id: string;
  title: string;
  companyId: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  experience: string;
  employmentType: JobType;
  skills: string[];
  qualification: string;
  description: string;
  postedAt: string;
  openings: number;
  deadline: string;
  status: "Active" | "Paused";
}

export interface CandidateProfile {
  fullName: string;
  email: string;
  phone: string;
  objective: string;
  degree: string;
  college: string;
  graduationYear: string;
  skills: string[];
  languages: string[];
  technologies: string[];
  certifications: string;
  projects: string;
  experience: string;
  preferredRole: string;
  preferredLocation: string;
  expectedSalary: string;
  linkedin: string;
  github: string;
  resumeName: string;
}

export interface Application {
  id: string;
  jobId: string;
  appliedAt: string;
  status: ApplicationStatus;
  recruiterUpdates: string[];
  interviewId?: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  jobId: string;
  companyId: string;
  date: string;
  time: string;
  type: "Online" | "Phone" | "In-person";
  rounds: string[];
  interviewer: string;
  hrContact: string;
  address: string;
  meetingLink: string;
  status: "Scheduled" | "Confirmed" | "Completed" | "Cancelled";
  instructions: string;
  isSample: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
  read: boolean;
  kind: "job" | "application" | "interview" | "recruiter";
}

export interface MatchResult {
  percentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export const demoCompanies: Company[] = [
  {
    id: "northstar",
    name: "Northstar Systems",
    initials: "NS",
    industry: "Software & IT Services",
    size: "201–500 employees",
    headquarters: "Bengaluru, Karnataka",
    website: "https://northstar.example",
    careers: "https://northstar.example/careers",
    about: "A sample product studio building practical tools for growing teams.",
    locations: ["Bengaluru", "Pune", "Remote"],
    technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
    culture: "Small product teams, thoughtful reviews, and dedicated learning time.",
    products: "Workflow tools, analytics dashboards, and team collaboration software.",
    interviewProcess: ["Recruiter conversation", "Technical discussion", "Team conversation"],
    interviewTopics: ["JavaScript fundamentals", "API design", "Product thinking"],
  },
  {
    id: "meridian",
    name: "Meridian Labs",
    initials: "ML",
    industry: "Data & Analytics",
    size: "51–200 employees",
    headquarters: "Hyderabad, Telangana",
    website: "https://meridian.example",
    careers: "https://meridian.example/careers",
    about: "A fictional analytics company helping organizations make clearer decisions.",
    locations: ["Hyderabad", "Bengaluru"],
    technologies: ["Python", "SQL", "dbt", "Power BI"],
    culture: "Curious, collaborative teams that value clear communication.",
    products: "Reporting platforms and data quality tools.",
    interviewProcess: ["Hiring manager chat", "Analytics exercise", "Team fit"],
    interviewTopics: ["SQL joins", "Data storytelling", "Experiment design"],
  },
  {
    id: "orbitly",
    name: "Orbitly Digital",
    initials: "OD",
    industry: "Digital Products",
    size: "51–200 employees",
    headquarters: "Pune, Maharashtra",
    website: "https://orbitly.example",
    careers: "https://orbitly.example/careers",
    about: "A sample digital product company creating accessible customer experiences.",
    locations: ["Pune", "Mumbai", "Remote"],
    technologies: ["Java", "Spring Boot", "Docker", "Kubernetes"],
    culture: "Direct feedback, inclusive planning, and flexible work arrangements.",
    products: "Customer portals, mobile services, and cloud applications.",
    interviewProcess: ["Introduction", "Technical screen", "Project conversation"],
    interviewTopics: ["Java collections", "System design basics", "Testing"],
  },
  {
    id: "finchworks",
    name: "FinchWorks",
    initials: "FW",
    industry: "Technology Consulting",
    size: "201–500 employees",
    headquarters: "Chennai, Tamil Nadu",
    website: "https://finchworks.example",
    careers: "https://finchworks.example/careers",
    about: "A fictional engineering partner supporting teams modernizing their platforms.",
    locations: ["Chennai", "Bengaluru"],
    technologies: ["Python", "AWS", "Terraform", "Linux"],
    culture: "Mentorship-led delivery teams with room to build broad skills.",
    products: "Cloud migration, platform engineering, and quality services.",
    interviewProcess: ["People team", "Skills conversation", "Client scenario"],
    interviewTopics: ["Cloud fundamentals", "Troubleshooting", "Communication"],
  },
  {
    id: "greenfield",
    name: "Greenfield Robotics",
    initials: "GR",
    industry: "AI & Robotics",
    size: "11–50 employees",
    headquarters: "Bengaluru, Karnataka",
    website: "https://greenfield.example",
    careers: "https://greenfield.example/careers",
    about: "An early-stage sample team exploring responsible automation.",
    locations: ["Bengaluru", "Remote"],
    technologies: ["Python", "PyTorch", "OpenCV", "Docker"],
    culture: "Hands-on research, regular demos, and careful experimentation.",
    products: "Computer-vision prototypes and automation software.",
    interviewProcess: ["Research chat", "Practical exercise", "Founder conversation"],
    interviewTopics: ["Model evaluation", "Python", "Responsible AI"],
  },
  {
    id: "bluepeak",
    name: "Bluepeak Quality",
    initials: "BQ",
    industry: "Quality Engineering",
    size: "51–200 employees",
    headquarters: "Kochi, Kerala",
    website: "https://bluepeak.example",
    careers: "https://bluepeak.example/careers",
    about: "A fictional quality engineering group focused on dependable software.",
    locations: ["Kochi", "Chennai", "Remote"],
    technologies: ["Playwright", "Cypress", "Java", "Jenkins"],
    culture: "Quality is a team habit, supported by pairing and clear documentation.",
    products: "Test automation systems and release confidence tooling.",
    interviewProcess: ["Recruiter call", "Testing exercise", "Team discussion"],
    interviewTopics: ["Test planning", "Automation design", "Bug reports"],
  },
  {
    id: "copperleaf",
    name: "Copperleaf Cloud",
    initials: "CC",
    industry: "Cloud Infrastructure",
    size: "201–500 employees",
    headquarters: "Mumbai, Maharashtra",
    website: "https://copperleaf.example",
    careers: "https://copperleaf.example/careers",
    about: "A sample cloud platform team making infrastructure easier to operate.",
    locations: ["Mumbai", "Pune", "Remote"],
    technologies: ["AWS", "Docker", "Kubernetes", "Terraform"],
    culture: "Calm operations, documented decisions, and shared on-call ownership.",
    products: "Cloud operations and developer platform services.",
    interviewProcess: ["Platform chat", "Troubleshooting session", "Team meeting"],
    interviewTopics: ["Linux", "Containers", "Incident response"],
  },
  {
    id: "hearthside",
    name: "Hearthside Finance",
    initials: "HF",
    industry: "Financial Technology",
    size: "51–200 employees",
    headquarters: "Gurugram, Haryana",
    website: "https://hearthside.example",
    careers: "https://hearthside.example/careers",
    about: "A fictional fintech team building transparent money-management tools.",
    locations: ["Gurugram", "Delhi", "Remote"],
    technologies: ["Java", "Spring Boot", "PostgreSQL", "Kafka"],
    culture: "Careful engineering, customer empathy, and steady growth.",
    products: "Payments tools and personal finance software.",
    interviewProcess: ["People conversation", "Backend interview", "Values chat"],
    interviewTopics: ["Java", "Database transactions", "Security basics"],
  },
];

export const demoJobs: Job[] = [
  {
    id: "job-01",
    title: "Python Developer",
    companyId: "northstar",
    location: "Bengaluru · Hybrid",
    salaryMin: 800000,
    salaryMax: 1200000,
    experience: "1–3 years",
    employmentType: "Full-time",
    skills: ["Python", "Django", "PostgreSQL", "REST APIs"],
    qualification: "Bachelor’s degree in Computer Science or equivalent experience",
    description: "Build reliable internal services and customer-facing APIs with a close-knit product team.",
    postedAt: "2 days ago",
    openings: 2,
    deadline: "2026-12-18",
    status: "Active",
  },
  {
    id: "job-02",
    title: "Java Developer",
    companyId: "orbitly",
    location: "Pune · On-site",
    salaryMin: 900000,
    salaryMax: 1400000,
    experience: "2–4 years",
    employmentType: "Full-time",
    skills: ["Java", "Spring Boot", "SQL", "Microservices"],
    qualification: "Bachelor’s degree in Engineering or a related field",
    description: "Create maintainable backend services for a growing suite of digital products.",
    postedAt: "1 day ago",
    openings: 3,
    deadline: "2026-12-22",
    status: "Active",
  },
  {
    id: "job-03",
    title: "Software Developer",
    companyId: "hearthside",
    location: "Gurugram · Hybrid",
    salaryMin: 700000,
    salaryMax: 1100000,
    experience: "0–2 years",
    employmentType: "Full-time",
    skills: ["Java", "Git", "SQL", "Problem solving"],
    qualification: "Bachelor’s degree or final-year qualification in a technical discipline",
    description: "Join a supportive team to ship dependable software and grow your engineering practice.",
    postedAt: "4 days ago",
    openings: 2,
    deadline: "2026-12-12",
    status: "Active",
  },
  {
    id: "job-04",
    title: "Full Stack Developer",
    companyId: "northstar",
    location: "Remote · India",
    salaryMin: 1200000,
    salaryMax: 1800000,
    experience: "2–5 years",
    employmentType: "Full-time",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    qualification: "Bachelor’s degree or equivalent project experience",
    description: "Own features from the first interface sketch through the production API.",
    postedAt: "5 days ago",
    openings: 1,
    deadline: "2026-12-28",
    status: "Active",
  },
  {
    id: "job-05",
    title: "Frontend Developer",
    companyId: "orbitly",
    location: "Pune · Hybrid",
    salaryMin: 750000,
    salaryMax: 1250000,
    experience: "1–3 years",
    employmentType: "Full-time",
    skills: ["React", "JavaScript", "CSS", "Accessibility"],
    qualification: "Degree or portfolio demonstrating frontend fundamentals",
    description: "Shape accessible, high-performing interfaces for everyday customer workflows.",
    postedAt: "3 days ago",
    openings: 2,
    deadline: "2026-12-15",
    status: "Active",
  },
  {
    id: "job-06",
    title: "Backend Developer",
    companyId: "hearthside",
    location: "Gurugram · On-site",
    salaryMin: 1000000,
    salaryMax: 1600000,
    experience: "2–4 years",
    employmentType: "Full-time",
    skills: ["Java", "Spring Boot", "PostgreSQL", "REST APIs"],
    qualification: "Bachelor’s degree in Computer Science or equivalent experience",
    description: "Design secure payment services with clear ownership and thoughtful reviews.",
    postedAt: "6 days ago",
    openings: 2,
    deadline: "2026-12-19",
    status: "Active",
  },
  {
    id: "job-07",
    title: "Data Analyst",
    companyId: "meridian",
    location: "Hyderabad · Hybrid",
    salaryMin: 650000,
    salaryMax: 1000000,
    experience: "0–2 years",
    employmentType: "Full-time",
    skills: ["SQL", "Python", "Power BI", "Statistics"],
    qualification: "Bachelor’s degree in Data Science, Statistics, or related field",
    description: "Turn product and operations data into clear, actionable insights.",
    postedAt: "2 days ago",
    openings: 1,
    deadline: "2026-12-09",
    status: "Active",
  },
  {
    id: "job-08",
    title: "Cloud Support Engineer",
    companyId: "finchworks",
    location: "Chennai · Hybrid",
    salaryMin: 600000,
    salaryMax: 950000,
    experience: "0–2 years",
    employmentType: "Full-time",
    skills: ["AWS", "Linux", "Networking", "Python"],
    qualification: "Bachelor’s degree or relevant cloud certification",
    description: "Help customers troubleshoot cloud environments and strengthen reliability.",
    postedAt: "1 week ago",
    openings: 2,
    deadline: "2026-12-20",
    status: "Active",
  },
  {
    id: "job-09",
    title: "DevOps Engineer",
    companyId: "copperleaf",
    location: "Mumbai · Remote-friendly",
    salaryMin: 1100000,
    salaryMax: 1700000,
    experience: "2–5 years",
    employmentType: "Full-time",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
    qualification: "Bachelor’s degree or comparable platform experience",
    description: "Make delivery safer and simpler with reusable cloud infrastructure.",
    postedAt: "3 days ago",
    openings: 1,
    deadline: "2026-12-30",
    status: "Active",
  },
  {
    id: "job-10",
    title: "QA Engineer",
    companyId: "bluepeak",
    location: "Kochi · Hybrid",
    salaryMin: 550000,
    salaryMax: 900000,
    experience: "0–2 years",
    employmentType: "Full-time",
    skills: ["Testing", "Playwright", "JavaScript", "API testing"],
    qualification: "Degree or hands-on software testing experience",
    description: "Work alongside engineers to make quality visible throughout delivery.",
    postedAt: "5 days ago",
    openings: 2,
    deadline: "2026-12-17",
    status: "Active",
  },
  {
    id: "job-11",
    title: "AI/ML Intern",
    companyId: "greenfield",
    location: "Bengaluru · On-site",
    salaryMin: 240000,
    salaryMax: 360000,
    experience: "Student / recent graduate",
    employmentType: "Internship",
    skills: ["Python", "Machine learning", "Pandas", "PyTorch"],
    qualification: "Currently pursuing or recently completed a technical degree",
    description: "Explore machine-learning prototypes with practical, mentored projects.",
    postedAt: "Today",
    openings: 2,
    deadline: "2026-12-05",
    status: "Active",
  },
  {
    id: "job-12",
    title: "Product Data Analyst",
    companyId: "meridian",
    location: "Bengaluru · Hybrid",
    salaryMin: 900000,
    salaryMax: 1350000,
    experience: "2–4 years",
    employmentType: "Full-time",
    skills: ["SQL", "Python", "Experiment design", "Tableau"],
    qualification: "Degree in Analytics, Mathematics, or related field",
    description: "Partner with product teams to measure what helps customers succeed.",
    postedAt: "4 days ago",
    openings: 1,
    deadline: "2026-12-26",
    status: "Active",
  },
  {
    id: "job-13",
    title: "Junior React Developer",
    companyId: "northstar",
    location: "Pune · Remote-friendly",
    salaryMin: 500000,
    salaryMax: 800000,
    experience: "0–1 years",
    employmentType: "Full-time",
    skills: ["React", "JavaScript", "HTML", "CSS"],
    qualification: "Portfolio or project work showing frontend fundamentals",
    description: "Build polished interface features with pairing and code-review support.",
    postedAt: "6 days ago",
    openings: 2,
    deadline: "2026-12-11",
    status: "Active",
  },
  {
    id: "job-14",
    title: "Platform Engineering Intern",
    companyId: "copperleaf",
    location: "Remote · India",
    salaryMin: 180000,
    salaryMax: 300000,
    experience: "Student / recent graduate",
    employmentType: "Internship",
    skills: ["Linux", "Docker", "Python", "Git"],
    qualification: "Currently pursuing a degree in Computer Science or IT",
    description: "Learn how developer platforms and cloud tools support product teams.",
    postedAt: "1 week ago",
    openings: 1,
    deadline: "2026-12-08",
    status: "Active",
  },
  {
    id: "job-15",
    title: "Java Engineering Associate",
    companyId: "finchworks",
    location: "Chennai · On-site",
    salaryMin: 650000,
    salaryMax: 950000,
    experience: "0–2 years",
    employmentType: "Contract",
    skills: ["Java", "Spring Boot", "Git", "SQL"],
    qualification: "Bachelor’s degree in a technical discipline",
    description: "Support a sample client delivery team while building backend fundamentals.",
    postedAt: "2 weeks ago",
    openings: 3,
    deadline: "2026-12-24",
    status: "Active",
  },
];

export const demoProfile: CandidateProfile = {
  fullName: "Aarav Mehta",
  email: "candidate.demo@smarthire.example",
  phone: "+91 90000 12345",
  objective: "MCA graduate focused on building useful, reliable software products.",
  degree: "Master of Computer Applications",
  college: "Sample Institute of Technology",
  graduationYear: "2026",
  skills: ["Python", "SQL", "React", "JavaScript", "Git", "Problem solving"],
  languages: ["Python", "JavaScript", "Java"],
  technologies: ["React", "Node.js", "PostgreSQL", "Git"],
  certifications: "Cloud foundations (sample)",
  projects: "Campus Connect — a student collaboration portal built with React and Node.js.",
  experience: "Graduate project experience; currently seeking a first full-time role.",
  preferredRole: "Software Developer",
  preferredLocation: "Bengaluru",
  expectedSalary: "₹7–10 LPA",
  linkedin: "https://linkedin.example/in/aarav-mehta",
  github: "https://github.example/aarav-mehta",
  resumeName: "aarav-mehta-resume-sample.pdf",
};

export const demoApplications: Application[] = [
  {
    id: "application-01",
    jobId: "job-03",
    appliedAt: "2026-11-18",
    status: "Under Review",
    recruiterUpdates: ["Application received · 18 Nov", "Profile review started · 20 Nov"],
  },
  {
    id: "application-02",
    jobId: "job-05",
    appliedAt: "2026-11-15",
    status: "Interview Scheduled",
    recruiterUpdates: ["Application received · 15 Nov", "Sample interview scheduled · 22 Nov"],
    interviewId: "interview-01",
  },
  {
    id: "application-03",
    jobId: "job-07",
    appliedAt: "2026-11-08",
    status: "Shortlisted",
    recruiterUpdates: ["Application received · 8 Nov", "Shortlisted for the next stage · 11 Nov"],
  },
];

export const demoInterviews: Interview[] = [
  {
    id: "interview-01",
    applicationId: "application-02",
    jobId: "job-05",
    companyId: "orbitly",
    date: "2026-11-27",
    time: "2:30 PM IST",
    type: "Online",
    rounds: ["Portfolio conversation", "Frontend fundamentals"],
    interviewer: "Sample interviewer",
    hrContact: "recruiting@orbitly.example",
    address: "",
    meetingLink: "https://meet.example/smarthire-demo",
    status: "Scheduled",
    instructions: "Bring one project you enjoyed building and a few questions for the team.",
    isSample: true,
  },
];

export const demoNotifications: AppNotification[] = [
  {
    id: "notice-01",
    title: "Interview reminder",
    detail: "A sample interview for Frontend Developer is coming up on 27 Nov.",
    createdAt: "Today · 9:15 AM",
    read: false,
    kind: "interview",
  },
  {
    id: "notice-02",
    title: "Application update",
    detail: "Your sample Software Developer application is under review.",
    createdAt: "Yesterday · 4:40 PM",
    read: false,
    kind: "application",
  },
  {
    id: "notice-03",
    title: "New role matches your profile",
    detail: "Data Analyst at Meridian Labs matches several of your listed skills.",
    createdAt: "20 Nov · 11:20 AM",
    read: true,
    kind: "job",
  },
  {
    id: "notice-04",
    title: "Recruiter update",
    detail: "Your sample application has moved to the shortlist.",
    createdAt: "11 Nov · 2:05 PM",
    read: true,
    kind: "recruiter",
  },
];

export function getMatchResult(job: Job, profile: CandidateProfile): MatchResult {
  const normalizedProfileSkills = new Set(profile.skills.map(normalizeSkill));
  const matchedSkills = job.skills.filter((skill) => normalizedProfileSkills.has(normalizeSkill(skill)));
  const missingSkills = job.skills.filter((skill) => !normalizedProfileSkills.has(normalizeSkill(skill)));
  const percentage = job.skills.length === 0 ? 0 : Math.round((matchedSkills.length / job.skills.length) * 100);

  return { percentage, matchedSkills, missingSkills };
}

export function getProfileCompletion(profile: CandidateProfile): number {
  const fields = [
    profile.fullName,
    profile.email,
    profile.phone,
    profile.objective,
    profile.degree,
    profile.college,
    profile.graduationYear,
    profile.skills.length > 0 ? profile.skills.join(",") : "",
    profile.preferredRole,
    profile.preferredLocation,
    profile.resumeName,
  ];
  return Math.round((fields.filter((field) => field.trim().length > 0).length / fields.length) * 100);
}

export function formatSalary(minimum: number, maximum: number): string {
  const format = (amount: number) => `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)} LPA`;
  return `${format(minimum)} – ${format(maximum)}`;
}

function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase().replace(/\s+/g, " ");
}