import { useMemo, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Compass,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  Github,
  GraduationCap,
  Heart,
  Home,
  LayoutDashboard,
  Lightbulb,
  MapPin,
  MessageCircle,
  MessageSquareText,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Undo2,
  Upload,
  Users,
  WandSparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  demoCompanies,
  formatSalary,
  getMatchResult,
  getProfileCompletion,
  type Application,
  type ApplicationStatus,
  type CandidateProfile,
  type Company,
  type DemoRole,
  type Interview,
  type Job,
  type JobType,
} from "@/lib/smart-hire-data";
import { useSmartHire } from "@/components/smart-hire-provider";

export type WorkspaceView =
  | "dashboard"
  | "discover"
  | "shortlist"
  | "applications"
  | "interviews"
  | "companies"
  | "preparation"
  | "hiremate"
  | "mock-interview"
  | "resume-assistant"
  | "recruiter"
  | "admin"
  | "notifications"
  | "profile";

const pageDetails: Record<WorkspaceView, { title: string; description: string }> = {
  dashboard: { title: "Your workspace", description: "A clear view of your next career move." },
  discover: { title: "Discover roles", description: "Explore roles against the skills in your profile." },
  shortlist: { title: "Your shortlist", description: "A considered list of roles you want to revisit." },
  applications: { title: "Applications", description: "Keep every application and update in one place." },
  interviews: { title: "Interview hub", description: "Your scheduled conversations and preparation details." },
  companies: { title: "Company directory", description: "Explore sample company profiles and interview topics." },
  preparation: { title: "Preparation roadmap", description: "Turn your next interview into a focused seven-day plan." },
  hiremate: { title: "Meet HireMate", description: "A practical career coach with helpful demo responses." },
  "mock-interview": { title: "Mock interview", description: "Practice one question at a time and get structured feedback." },
  "resume-assistant": { title: "Resume assistant", description: "Polish your story and compare it with a role." },
  recruiter: { title: "Recruiter studio", description: "Manage sample openings and review candidate applications." },
  admin: { title: "Platform overview", description: "Review sample users, roles, jobs, and platform activity." },
  notifications: { title: "Notifications", description: "A readable timeline of job and interview updates." },
  profile: { title: "Candidate profile", description: "Keep your experience and job preferences current." },
};

const navItems: { to: string; label: string; view: WorkspaceView; icon: typeof Home }[] = [
  { to: "/", label: "Overview", view: "dashboard", icon: LayoutDashboard },
  { to: "/discover", label: "Discover roles", view: "discover", icon: Compass },
  { to: "/shortlist", label: "Shortlist", view: "shortlist", icon: Bookmark },
  { to: "/applications", label: "Applications", view: "applications", icon: BriefcaseBusiness },
  { to: "/interviews", label: "Interview hub", view: "interviews", icon: CalendarDays },
  { to: "/companies", label: "Companies", view: "companies", icon: Building2 },
  { to: "/preparation", label: "Preparation plan", view: "preparation", icon: Target },
  { to: "/hiremate", label: "HireMate", view: "hiremate", icon: MessageCircle },
  { to: "/mock-interview", label: "Mock interview", view: "mock-interview", icon: MessageSquareText },
  { to: "/resume-assistant", label: "Resume assistant", view: "resume-assistant", icon: FileCheck2 },
  { to: "/recruiter", label: "Recruiter studio", view: "recruiter", icon: Users },
  { to: "/admin", label: "Admin overview", view: "admin", icon: ShieldCheck },
  { to: "/notifications", label: "Notifications", view: "notifications", icon: Bell },
  { to: "/profile", label: "My profile", view: "profile", icon: GraduationCap },
];

export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}

export function SmartHireWorkspace({ view }: { view: WorkspaceView }) {
  const { state } = useSmartHire();
  const [accountPickerOpen, setAccountPickerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickChatOpen, setQuickChatOpen] = useState(false);
  const unreadCount = state.notifications.filter((item) => !item.read).length;
  const details = pageDetails[view];

  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <Link to="/" className="brand-lockup" aria-label="SmartHire AI home">
          <span className="brand-mark"><BriefcaseBusiness size={20} /></span>
          <span><strong>SmartHire</strong><small>AI career studio</small></span>
        </Link>
        <div className="demo-label"><span className="demo-dot" /> DEMO WORKSPACE</div>
        <div className="sidebar-section-label">YOUR CAREER</div>
        <nav className="workspace-nav" aria-label="Main navigation">
          {navItems.slice(0, 10).map((item) => <NavItem key={item.to} item={item} active={view === item.view} />)}
        </nav>
        <div className="sidebar-section-label sidebar-section-spaced">TEAM TOOLS</div>
        <nav className="workspace-nav" aria-label="Team tools">
          {navItems.slice(10, 12).map((item) => <NavItem key={item.to} item={item} active={view === item.view} />)}
        </nav>
        <div className="sidebar-bottom">
          <div className="sample-note"><ShieldCheck size={16} /><span>Sample people, employers, openings, and interview details</span></div>
          <Button variant="outline" className="role-switch" onClick={() => setAccountPickerOpen(true)}>
            <span className="avatar-initials">{roleInitial(state.role)}</span>
            <span className="role-switch-copy"><span>{roleTitle(state.role)} demo</span><small>Switch demo account</small></span>
            <ChevronRight size={15} />
          </Button>
        </div>
      </aside>

      <main className="workspace-main">
        <header className="workspace-topbar">
          <div className="mobile-brand">
            <span className="brand-mark"><BriefcaseBusiness size={18} /></span>
            <strong>SmartHire</strong>
          </div>
          <div className="topbar-caption"><span className="demo-dot" /> Local demo data · saved in this browser</div>
          <div className="topbar-actions">
            <Button variant="ghost" size="icon" aria-label="Open HireMate" title="Open HireMate" onClick={() => setQuickChatOpen(true)}>
              <MessageCircle size={18} />
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label="Notifications" title="Notifications" className="notification-button">
              <Link to="/notifications"><Bell size={18} />{unreadCount > 0 && <span className="notification-dot" />}</Link>
            </Button>
            <Button variant="outline" className="top-role-button" onClick={() => setAccountPickerOpen(true)}>
              <span className="avatar-initials">{roleInitial(state.role)}</span>{roleTitle(state.role)} demo
            </Button>
            <Button variant="ghost" size="icon" className="mobile-menu-button" aria-label="Open navigation" onClick={() => setMobileMenuOpen(true)}>
              <Compass size={18} />
            </Button>
          </div>
        </header>

        <div className="workspace-content">
          <div className="page-heading-row">
            <div>
              <p className="eyebrow">{roleTitle(state.role)} workspace</p>
              <h1>{details.title}</h1>
              <p className="page-subtitle">{details.description}</p>
            </div>
            <Badge variant="outline" className="sample-badge">SAMPLE DATA</Badge>
          </div>
          <ViewContent view={view} />
        </div>
      </main>

      <nav className="mobile-bottom-nav" aria-label="Quick navigation">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return <Link key={item.to} to={item.to} className={view === item.view ? "mobile-nav-item active" : "mobile-nav-item"}>
            <Icon size={18} /><span>{item.label === "Overview" ? "Home" : item.label.split(" ")[0]}</span>
          </Link>;
        })}
      </nav>

      <Dialog open={accountPickerOpen} onOpenChange={setAccountPickerOpen}>
        <DialogContent className="role-dialog">
          <DialogHeader>
            <DialogTitle>Choose a demo account</DialogTitle>
            <DialogDescription>Switch between sample roles. Demo accounts do not authenticate real people.</DialogDescription>
          </DialogHeader>
          <div className="demo-account-list">
            {(["candidate", "recruiter", "admin"] as DemoRole[]).map((role) => <Button key={role} variant="outline" className="demo-account-option" onClick={() => {
              useRoleAction(role);
              setAccountPickerOpen(false);
              toast.success(`${roleTitle(role)} demo opened`);
            }}>
              <span className={`avatar-initials avatar-${role}`}>{roleInitial(role)}</span>
              <span><strong>{roleTitle(role)} demo</strong><small>{roleDescription(role)}</small></span>
              {state.role === role && <Check size={17} />}
            </Button>)}
          </div>
          <p className="dialog-footnote">Sample data is stored only in this browser. No real accounts or employer listings are connected.</p>
        </DialogContent>
      </Dialog>

      <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DialogContent className="mobile-nav-dialog">
          <DialogHeader><DialogTitle>SmartHire AI</DialogTitle><DialogDescription>Move between your workspace areas.</DialogDescription></DialogHeader>
          <nav className="mobile-dialog-links" aria-label="All pages">
            {navItems.map((item) => <NavItem key={item.to} item={item} active={view === item.view} onNavigate={() => setMobileMenuOpen(false)} />)}
          </nav>
        </DialogContent>
      </Dialog>

      <Dialog open={quickChatOpen} onOpenChange={setQuickChatOpen}>
        <DialogContent className="quick-chat-dialog">
          <DialogHeader><DialogTitle className="chat-title"><span className="hiremate-mark"><Sparkles size={17} /></span>HireMate</DialogTitle><DialogDescription>Career coach · demo responses</DialogDescription></DialogHeader>
          <HireMateChat compact />
          <Button asChild variant="outline" className="w-full"><Link to="/hiremate" onClick={() => setQuickChatOpen(false)}>Open full conversation <ArrowRight size={15} /></Link></Button>
        </DialogContent>
      </Dialog>
    </div>
  );

  function useRoleAction(role: DemoRole) {
    // The role change stays explicit and local to this clearly labeled demo.
    window.dispatchEvent(new CustomEvent("smarthire-demo-role", { detail: role }));
  }
}

function NavItem({ item, active, onNavigate }: { item: (typeof navItems)[number]; active: boolean; onNavigate?: () => void }) {
  const Icon = item.icon;
  return <Link to={item.to} onClick={onNavigate} className={active ? "workspace-nav-link active" : "workspace-nav-link"}>
    <Icon size={17} strokeWidth={active ? 2.2 : 1.8} /><span>{item.label}</span>{item.view === "shortlist" && <span className="nav-trailing-dot" />}
  </Link>;
}

function roleTitle(role: DemoRole): string {
  return role === "candidate" ? "Candidate" : role === "recruiter" ? "Recruiter" : "Admin";
}

function roleInitial(role: DemoRole): string {
  return role === "candidate" ? "A" : role === "recruiter" ? "R" : "S";
}

function roleDescription(role: DemoRole): string {
  return role === "candidate" ? "Find roles and prepare for interviews" : role === "recruiter" ? "Post sample roles and review candidates" : "Review sample platform activity";
}

function ViewContent({ view }: { view: WorkspaceView }) {
  switch (view) {
    case "dashboard": return <DashboardPage />;
    case "discover": return <DiscoverPage />;
    case "shortlist": return <ShortlistPage />;
    case "applications": return <ApplicationsPage />;
    case "interviews": return <InterviewsPage />;
    case "companies": return <CompaniesPage />;
    case "preparation": return <PreparationPage />;
    case "hiremate": return <HireMateChat />;
    case "mock-interview": return <MockInterviewPage />;
    case "resume-assistant": return <ResumeAssistantPage />;
    case "recruiter": return <RecruiterPage />;
    case "admin": return <AdminPage />;
    case "notifications": return <NotificationsPage />;
    case "profile": return <ProfilePage />;
  }
}

function PageIntro({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div className="section-intro"><div><h2>{title}</h2><p>{description}</p></div>{action}</div>;
}

function StatCard({ label, value, note, icon: Icon, tone = "blue" }: { label: string; value: string | number; note: string; icon: typeof BriefcaseBusiness; tone?: string }) {
  return <Card className="stat-card rounded-lg shadow-none"><CardContent className="stat-card-content">
    <div className={`stat-icon tone-${tone}`}><Icon size={18} /></div>
    <span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className="stat-note">{note}</span>
  </CardContent></Card>;
}

function CompanyMark({ company, small = false }: { company: Company; small?: boolean }) {
  const tone = company.initials.charCodeAt(0) % 4;
  return <span className={`company-mark company-tone-${tone}${small ? " company-mark-small" : ""}`} aria-label={`${company.name} sample mark`}>{company.initials}</span>;
}

function CompanyName({ companyId }: { companyId: string }) {
  const company = demoCompanies.find((item) => item.id === companyId);
  return <span>{company?.name ?? "Sample company"}</span>;
}

function MatchBadge({ job, profile }: { job: Job; profile: CandidateProfile }) {
  const match = getMatchResult(job, profile);
  return <Badge className="match-badge"><Target size={12} /> {match.percentage}% match</Badge>;
}

function DashboardPage() {
  const { state } = useSmartHire();
  const completion = getProfileCompletion(state.profile);
  const recommendations = state.jobs
    .filter((job) => job.status === "Active")
    .map((job) => ({ job, score: getMatchResult(job, state.profile).percentage }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const interviews = state.interviews.filter((item) => item.status === "Scheduled" || item.status === "Confirmed").length;
  const applied = state.applications.length;
  const applicationBar = Math.min(100, applied * 18);

  return <div className="page-stack">
    <section className="welcome-band">
      <div className="welcome-copy"><p className="eyebrow welcome-eyebrow">SUNDAY, NOVEMBER 22 · YOUR CAREER DASHBOARD</p><h2>Good morning, {state.profile.fullName.split(" ")[0]} <span aria-hidden="true">✦</span></h2><p>Small steps add up. Here’s what’s moving in your search.</p></div>
      <div className="welcome-actions"><Button asChild variant="secondary"><Link to="/discover"><Compass size={16} /> Explore roles</Link></Button><span className="welcome-art"><Sparkles size={40} /></span></div>
    </section>

    <div className="stats-grid">
      <StatCard label="Open roles" value={state.jobs.filter((job) => job.status === "Active").length} note="Across sample companies" icon={BriefcaseBusiness} tone="blue" />
      <StatCard label="Shortlisted" value={state.shortlistIds.length} note="Worth a closer look" icon={Bookmark} tone="green" />
      <StatCard label="Applications" value={applied} note="Tracked in your workspace" icon={FileText} tone="orange" />
      <StatCard label="Interviews" value={interviews} note="Sample schedules included" icon={CalendarDays} tone="pink" />
    </div>

    <div className="dashboard-grid">
      <section className="content-column">
        <div className="panel-heading"><div><p className="eyebrow">BASED ON YOUR PROFILE</p><h2>Roles to explore</h2></div><Button asChild variant="ghost" size="sm"><Link to="/discover">See all <ArrowRight size={15} /></Link></Button></div>
        <div className="recommendation-list">{recommendations.map(({ job }) => {
          const company = demoCompanies.find((item) => item.id === job.companyId);
          if (!company) return null;
          return <Card key={job.id} className="recommendation-card rounded-lg shadow-none"><CardContent className="recommendation-content">
            <CompanyMark company={company} /><div className="recommendation-main"><div className="recommendation-title-row"><h3>{job.title}</h3><MatchBadge job={job} profile={state.profile} /></div><p>{company.name} <span>·</span> {job.location}</p><div className="tag-row">{job.skills.slice(0, 3).map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}</div></div><span className="recommendation-salary">{formatSalary(job.salaryMin, job.salaryMax)}</span>
          </CardContent></Card>;
        })}</div>
        <div className="panel-heading application-heading"><div><p className="eyebrow">KEEP THE MOMENTUM</p><h2>Recent applications</h2></div><Button asChild variant="ghost" size="sm"><Link to="/applications">View tracker <ArrowRight size={15} /></Link></Button></div>
        <ApplicationList compact />
      </section>

      <aside className="dashboard-aside">
        <Card className="completion-card rounded-lg shadow-none"><CardContent className="completion-content">
          <div className="panel-heading compact-heading"><div><p className="eyebrow">PROFILE STRENGTH</p><h2>Make your skills count</h2></div><span className="completion-number">{completion}%</span></div>
          <Progress value={completion} aria-label={`Profile ${completion}% complete`} className="completion-progress" />
          <p className="muted-copy">A complete profile helps make skill matches more useful.</p>
          <Button asChild variant="outline" className="w-full"><Link to="/profile">Update profile <ArrowRight size={15} /></Link></Button>
          <div className="skill-overview"><div className="skill-overview-heading"><span>Listed skills</span><span>{state.profile.skills.length}</span></div><div className="tag-row">{state.profile.skills.slice(0, 5).map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}</div></div>
        </CardContent></Card>
        <Card className="activity-card rounded-lg shadow-none"><CardContent className="activity-content">
          <div className="panel-heading compact-heading"><div><p className="eyebrow">THIS WEEK</p><h2>Search rhythm</h2></div><span className="activity-trend"><ArrowDownRight size={17} /> steady</span></div>
          <div className="activity-bar-row"><div className="activity-bars" aria-label={`${applied} sample applications tracked`}><span style={{ height: "38%" }} /><span style={{ height: "56%" }} /><span style={{ height: "47%" }} /><span style={{ height: "72%" }} /><span style={{ height: "60%" }} /><span style={{ height: `${Math.max(24, applicationBar)}%` }} /><span style={{ height: "82%" }} /></div></div>
          <div className="weekday-row"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
          <div className="activity-footer"><span>{applied} applications tracked</span><span className="activity-legend"><i /> sample activity</span></div>
        </CardContent></Card>
      </aside>
    </div>
  </div>;
}

function DiscoverPage() {
  const { state, addToShortlist, removeFromShortlist, skipJob, restoreSkippedJob } = useSmartHire();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [lastSwipe, setLastSwipe] = useState<{ id: string; kind: "skip" | "save" } | null>(null);
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [detailsJob, setDetailsJob] = useState<Job | null>(null);
  const touchStart = useRef<number | null>(null);
  const candidates = state.jobs.filter((job) => {
    const company = demoCompanies.find((item) => item.id === job.companyId);
    const terms = `${job.title} ${company?.name ?? ""} ${job.skills.join(" ")}`.toLowerCase();
    return job.status === "Active" && !state.skippedIds.includes(job.id) && !state.applications.some((item) => item.jobId === job.id) &&
      (!search || terms.includes(search.toLowerCase())) && (location === "all" || job.location.toLowerCase().includes(location));
  });
  const job = candidates[0];
  const company = job ? demoCompanies.find((item) => item.id === job.companyId) : undefined;

  function skipCurrent() {
    if (!job) return;
    skipJob(job.id);
    setLastSwipe({ id: job.id, kind: "skip" });
  }

  function saveCurrent() {
    if (!job) return;
    addToShortlist(job.id);
    skipJob(job.id);
    setLastSwipe({ id: job.id, kind: "save" });
    toast.success("Added to your shortlist", { description: "This is not an application." });
  }

  function undoSwipe() {
    if (!lastSwipe) return;
    restoreSkippedJob(lastSwipe.id);
    if (lastSwipe.kind === "save") removeFromShortlist(lastSwipe.id);
    setLastSwipe(null);
    toast.message("Previous swipe undone");
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    if (touchStart.current === null) return;
    const delta = event.clientX - touchStart.current;
    touchStart.current = null;
    if (delta > 90) saveCurrent();
    if (delta < -90) skipCurrent();
  }

  return <div className="page-stack">
    <PageIntro title="Find your next fit" description="Swipe to shortlist or skip. Saving never submits an application." action={lastSwipe ? <Button variant="outline" size="sm" onClick={undoSwipe}><Undo2 size={15} /> Undo</Button> : undefined} />
    <div className="discover-toolbar"><div className="search-field"><Search size={16} /><Input aria-label="Search jobs" placeholder="Role, company, or skill" value={search} onChange={(event) => setSearch(event.target.value)} /></div><Select value={location} onValueChange={setLocation}><SelectTrigger className="location-select" aria-label="Filter by location"><SelectValue placeholder="All locations" /></SelectTrigger><SelectContent><SelectItem value="all">All locations</SelectItem><SelectItem value="bengaluru">Bengaluru</SelectItem><SelectItem value="pune">Pune</SelectItem><SelectItem value="hyderabad">Hyderabad</SelectItem><SelectItem value="chennai">Chennai</SelectItem><SelectItem value="remote">Remote</SelectItem></SelectContent></Select><span className="result-count">{candidates.length} roles to explore</span></div>

    {job && company ? <div className="discovery-stage">
      <div className="swipe-instruction"><span>← Skip</span><span>Shortlist →</span></div>
      <Card className="discovery-card rounded-lg shadow-none" onPointerDown={(event) => { touchStart.current = event.clientX; }} onPointerUp={handlePointerEnd}>
        <CardContent className="discovery-card-content">
          <div className="discovery-company-line"><CompanyMark company={company} /><div><strong>{company.name}</strong><span>{company.industry} · sample profile</span></div><MatchBadge job={job} profile={state.profile} /></div>
          <h2>{job.title}</h2><div className="job-meta-row"><span><MapPin size={14} />{job.location}</span><span><BriefcaseBusiness size={14} />{job.experience}</span><span><Clock3 size={14} />{job.employmentType}</span></div>
          <p className="discovery-description">{job.description}</p>
          <div className="salary-block"><span>Estimated annual salary</span><strong>{formatSalary(job.salaryMin, job.salaryMax)}</strong><small>Sample range · confirm details with the employer</small></div>
          <div className="job-skills"><p className="eyebrow">SKILL MATCH</p><div className="tag-row">{job.skills.map((skill) => <Badge key={skill} variant={getMatchResult(job, state.profile).matchedSkills.includes(skill) ? "secondary" : "outline"}>{skill}{getMatchResult(job, state.profile).matchedSkills.includes(skill) && <Check size={12} />}</Badge>)}</div></div>
          <div className="match-explanation"><span><Target size={15} /> Why it matches</span><p>{getMatchResult(job, state.profile).matchedSkills.length} of {job.skills.length} required skills match your profile. Add missing skills to improve future recommendations.</p></div>
          <div className="discovery-footer"><span>Posted {job.postedAt} <i /> {job.openings} opening{job.openings === 1 ? "" : "s"}</span><Button variant="ghost" size="sm" onClick={() => setDetailsJob(job)}>Full details</Button></div>
        </CardContent>
      </Card>
      <div className="swipe-actions"><Button variant="outline" size="icon" className="swipe-skip" onClick={skipCurrent} aria-label="Skip role" title="Skip role"><X size={21} /></Button><Button variant="outline" className="details-action" onClick={() => setDetailsJob(job)}><CircleHelp size={16} /> Details</Button><Button variant="outline" size="icon" className="swipe-save" onClick={saveCurrent} aria-label="Shortlist role" title="Shortlist role"><Heart size={20} /></Button><Button className="swipe-apply" onClick={() => setApplyJob(job)}>Apply now <ArrowRight size={16} /></Button></div>
      <p className="swipe-hint">On touch screens, drag right to shortlist or left to skip.</p>
    </div> : <EmptyState icon={Compass} title="No more roles in this view" body="Change your search or location filter, or reset the demo to replay the sample queue." action={<Button variant="outline" onClick={() => { setSearch(""); setLocation("all"); restoreSkippedJob(state.skippedIds[0] ?? ""); }}>Clear filters</Button>} />}
    <ApplyDialog job={applyJob} onClose={() => setApplyJob(null)} />
    <JobDetailsDialog job={detailsJob} onClose={() => setDetailsJob(null)} onApply={(selected) => { setDetailsJob(null); setApplyJob(selected); }} />
  </div>;
}

function ShortlistPage() {
  const { state, removeFromShortlist } = useSmartHire();
  const [search, setSearch] = useState("");
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [detailsJob, setDetailsJob] = useState<Job | null>(null);
  const jobs = state.shortlistIds.map((id) => state.jobs.find((job) => job.id === id)).filter((job): job is Job => Boolean(job))
    .filter((job) => `${job.title} ${job.location} ${demoCompanies.find((item) => item.id === job.companyId)?.name ?? ""}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="page-stack">
    <PageIntro title={`${state.shortlistIds.length} saved roles`} description="A shortlist is a reminder to explore. Applying is always a separate step." />
    <div className="search-field list-search"><Search size={16} /><Input aria-label="Search shortlisted roles" placeholder="Search your shortlist" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
    {jobs.length ? <div className="role-list">{jobs.map((job) => {
      const company = demoCompanies.find((item) => item.id === job.companyId);
      if (!company) return null;
      return <Card key={job.id} className="role-list-card rounded-lg shadow-none"><CardContent className="role-list-content"><CompanyMark company={company} /><div className="role-list-main"><div className="recommendation-title-row"><h3>{job.title}</h3><MatchBadge job={job} profile={state.profile} /></div><p>{company.name} <span>·</span> {job.location}</p><div className="role-list-meta"><span>{formatSalary(job.salaryMin, job.salaryMax)}</span><span>{job.experience}</span><span>{job.employmentType}</span></div><div className="tag-row">{job.skills.slice(0, 4).map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}</div><span className="saved-date">Saved in this demo workspace</span></div><div className="role-list-actions"><Button variant="outline" size="sm" onClick={() => setDetailsJob(job)}>View details</Button><Button size="sm" onClick={() => setApplyJob(job)} disabled={state.applications.some((application) => application.jobId === job.id)}>{state.applications.some((application) => application.jobId === job.id) ? "Applied" : "Apply"}</Button><Button variant="ghost" size="icon" aria-label={`Remove ${job.title} from shortlist`} onClick={() => { removeFromShortlist(job.id); toast.message("Removed from shortlist"); }}><Trash2 size={16} /></Button></div></CardContent></Card>;
    })}</div> : <EmptyState icon={Bookmark} title="Your shortlist is clear" body="Shortlist a role in Discover to keep it here. Saving a role will not apply for you." action={<Button asChild><Link to="/discover">Explore roles <ArrowRight size={15} /></Link></Button>} />}
    <ApplyDialog job={applyJob} onClose={() => setApplyJob(null)} />
    <JobDetailsDialog job={detailsJob} onClose={() => setDetailsJob(null)} onApply={(selected) => { setDetailsJob(null); setApplyJob(selected); }} />
  </div>;
}

function ApplyDialog({ job, onClose }: { job: Job | null; onClose: () => void }) {
  const { state, applyToJob } = useSmartHire();
  const company = job ? demoCompanies.find((item) => item.id === job.companyId) : undefined;
  const alreadyApplied = job ? state.applications.some((application) => application.jobId === job.id) : false;
  return <Dialog open={Boolean(job)} onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent><DialogHeader><DialogTitle>Confirm your application</DialogTitle><DialogDescription>{job ? `${job.title} at ${company?.name ?? "Sample company"}` : "Review this application."}</DialogDescription></DialogHeader>
      <div className="confirm-summary"><p>Your current sample profile and résumé name will be attached to this demo application.</p><p className="dialog-footnote">This submits a sample application in this browser only. It is not sent to an employer.</p></div>
      <DialogFooter><Button variant="outline" onClick={onClose}>Go back</Button><Button disabled={!job || alreadyApplied} onClick={() => {
        if (job && applyToJob(job.id)) toast.success("Application added", { description: "Find it in your application tracker." });
        else toast.info("You already applied to this role.");
        onClose();
      }}>{alreadyApplied ? "Already applied" : "Confirm application"}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

function JobDetailsDialog({ job, onClose, onApply }: { job: Job | null; onClose: () => void; onApply: (job: Job) => void }) {
  const company = job ? demoCompanies.find((item) => item.id === job.companyId) : undefined;
  const { state } = useSmartHire();
  return <Dialog open={Boolean(job)} onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent className="wide-dialog"><DialogHeader><DialogTitle>{job?.title ?? "Role details"}</DialogTitle><DialogDescription>{company?.name ?? "Sample company"} · sample listing</DialogDescription></DialogHeader>
      {job && <div className="job-detail-body"><div className="job-meta-row"><span><MapPin size={14} />{job.location}</span><span><BriefcaseBusiness size={14} />{job.experience}</span><span><Clock3 size={14} />{job.employmentType}</span><MatchBadge job={job} profile={state.profile} /></div><p>{job.description}</p><div><span className="field-label">Estimated salary</span><p>{formatSalary(job.salaryMin, job.salaryMax)} · sample range</p></div><div><span className="field-label">Qualification</span><p>{job.qualification}</p></div><div><span className="field-label">Required skills</span><div className="tag-row">{job.skills.map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}</div></div><div className="company-data-note"><ShieldCheck size={15} />Sample company and job details; not a verified opening.</div></div>}
      <DialogFooter><Button variant="outline" onClick={onClose}>Close</Button><Button disabled={!job || state.applications.some((application) => application.jobId === job.id)} onClick={() => job && onApply(job)}>Apply now <ArrowRight size={15} /></Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

function ApplicationList({ compact = false }: { compact?: boolean }) {
  const { state } = useSmartHire();
  const applications = compact ? state.applications.slice(0, 3) : state.applications;
  if (!applications.length) return <EmptyState icon={BriefcaseBusiness} title="No applications yet" body="Submit an application from a role you want to pursue." action={<Button asChild><Link to="/discover">Discover roles</Link></Button>} />;
  return <div className="application-list">{applications.map((application) => {
    const job = state.jobs.find((item) => item.id === application.jobId);
    const company = job ? demoCompanies.find((item) => item.id === job.companyId) : undefined;
    if (!job || !company) return null;
    return <Card key={application.id} className="application-card rounded-lg shadow-none"><CardContent className="application-card-content"><CompanyMark company={company} small /><div className="application-info"><div className="recommendation-title-row"><h3>{job.title}</h3><StatusBadge status={application.status} /></div><p>{company.name} · Applied {formatDate(application.appliedAt)}</p>{!compact && <><Progress value={applicationProgress(application.status)} aria-label={`${application.status} progress`} className="application-progress" /><div className="application-timeline">{application.recruiterUpdates.map((update, index) => <span key={`${application.id}-${index}`}><i className={index === application.recruiterUpdates.length - 1 ? "timeline-dot current" : "timeline-dot"} />{update}</span>)}</div></>}</div><Button asChild variant="ghost" size="icon" aria-label={`View interview details for ${job.title}`} title="Open interviews"><Link to="/interviews"><ChevronRight size={18} /></Link></Button></CardContent></Card>;
  })}</div>;
}

function ApplicationsPage() {
  const { state } = useSmartHire();
  const counts = ["Applied", "Under Review", "Shortlisted", "Interview Scheduled"].map((status) => ({ status, count: state.applications.filter((item) => item.status === status).length }));
  return <div className="page-stack"><PageIntro title="A calmer way to follow up" description="Each entry keeps its current status, application date, and recruiter updates together." />
    <div className="status-count-grid">{counts.map(({ status, count }) => <div key={status} className="status-count"><span>{status}</span><strong>{count}</strong></div>)}</div>
    <ApplicationList />
  </div>;
}

function StatusBadge({ status }: { status: ApplicationStatus | Interview["status"] }) {
  const tone = status === "Selected" || status === "Confirmed" ? "status-good" : status === "Rejected" || status === "Cancelled" ? "status-muted" : status === "Interview Scheduled" ? "status-blue" : status === "Shortlisted" ? "status-purple" : "status-warm";
  return <Badge variant="outline" className={`status-badge ${tone}`}>{status}</Badge>;
}

function applicationProgress(status: ApplicationStatus): number {
  const progress: Record<ApplicationStatus, number> = { Applied: 20, "Under Review": 40, Shortlisted: 62, "Interview Scheduled": 80, Selected: 100, Rejected: 100 };
  return progress[status];
}

function formatDate(date: string): string {
  const parsed = new Date(`${date}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(parsed);
}

function InterviewsPage() {
  const { state, setInterviewStatus } = useSmartHire();
  const interviews = state.interviews;
  return <div className="page-stack"><PageIntro title="All interview details, together" description="Scheduled information comes from the sample application or details entered in Recruiter Studio." action={<Button asChild variant="outline"><Link to="/preparation"><Sparkles size={15} /> Prepare for an interview</Link></Button>} />
    {interviews.length ? <div className="interview-list">{interviews.map((interview) => <InterviewCard key={interview.id} interview={interview} onStatus={(status) => setInterviewStatus(interview.id, status)} />)}</div> : <EmptyState icon={CalendarDays} title="Nothing scheduled yet" body="When a recruiter schedules an interview, its details appear here. No dates are invented." action={<Button asChild variant="outline"><Link to="/discover">Explore roles</Link></Button>} />}
  </div>;
}

function InterviewCard({ interview, onStatus }: { interview: Interview; onStatus: (status: Interview["status"]) => void }) {
  const company = demoCompanies.find((item) => item.id === interview.companyId);
  const job = useSmartHire().state.jobs.find((item) => item.id === interview.jobId);
  const mapUrl = interview.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(interview.address)}` : "";
  return <Card className="interview-card rounded-lg shadow-none"><CardContent className="interview-card-content">
    <div className="interview-date-rail"><span>{new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(`${interview.date}T12:00:00`)).toUpperCase()}</span><strong>{new Date(`${interview.date}T12:00:00`).getDate()}</strong><small>{interview.time}</small></div>
    <div className="interview-details"><div className="interview-title-row"><div className="interview-company"><CompanyMark company={company ?? demoCompanies[0]!} small /><div><h3>{job?.title ?? "Interview"}</h3><p>{company?.name ?? "Sample company"} · {interview.type}</p></div></div><StatusBadge status={interview.status} /></div>
      {interview.isSample && <div className="sample-interview-note"><ShieldCheck size={14} /> Sample interview details — not a real employer schedule</div>}
      <div className="interview-facts"><span><Users size={14} />{interview.interviewer || "Interviewer not provided"}</span><span><CalendarDays size={14} />{interview.rounds.join(" · ") || "Round details not provided"}</span>{interview.hrContact && <span><MessageCircle size={14} />{interview.hrContact}</span>}</div>
      <p className="interview-instructions">{interview.instructions || "No special instructions provided."}</p>
      {interview.type === "In-person" && interview.address && <div className="map-panel"><MapPin size={18} /><div><span>Interview address</span><strong>{interview.address}</strong></div><Button asChild variant="outline" size="sm"><a href={mapUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} /> View on Maps</a></Button></div>}
      <div className="interview-actions">{interview.type === "Online" && isSafeLink(interview.meetingLink) && <Button asChild variant="outline" size="sm"><a href={interview.meetingLink} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Join meeting</a></Button>}{interview.type === "In-person" && mapUrl && <Button asChild size="sm"><a href={mapUrl} target="_blank" rel="noreferrer"><MapPin size={14} /> Navigate to interview</a></Button>}<Button asChild variant="ghost" size="sm"><Link to="/preparation"><Lightbulb size={14} /> Prepare</Link></Button>{interview.status === "Scheduled" && <Button variant="ghost" size="sm" onClick={() => onStatus("Confirmed")}><Check size={14} /> Confirm</Button>}</div>
    </div>
  </CardContent></Card>;
}

function isSafeLink(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Company | null>(null);
  const jobsForCompany = (companyId: string) => useSmartHire().state.jobs.filter((job) => job.companyId === companyId && job.status === "Active");
  const visible = demoCompanies.filter((company) => `${company.name} ${company.industry} ${company.headquarters}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="page-stack"><PageIntro title="Sample companies, real interview practice" description="These fictional profiles are for project demonstration, not verified employer information." />
    <div className="search-field list-search"><Search size={16} /><Input aria-label="Search companies" placeholder="Search companies or industries" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
    <div className="company-grid">{visible.map((company) => <CompanyCard key={company.id} company={company} onSelect={() => setSelected(company)} jobs={jobsForCompany(company.id).length} />)}</div>
    <CompanyDetailsDialog company={selected} onClose={() => setSelected(null)} />
  </div>;
}

function CompanyCard({ company, onSelect, jobs }: { company: Company; onSelect: () => void; jobs: number }) {
  return <Card className="company-card rounded-lg shadow-none"><CardContent className="company-card-content"><div className="company-card-top"><CompanyMark company={company} /><Badge variant="outline">Sample profile</Badge></div><h3>{company.name}</h3><p className="company-industry">{company.industry} <span>·</span> {company.headquarters}</p><p className="company-about">{company.about}</p><div className="company-card-footer"><span>{jobs} sample opening{jobs === 1 ? "" : "s"}</span><Button variant="ghost" size="sm" onClick={onSelect}>Company profile <ArrowRight size={14} /></Button></div></CardContent></Card>;
}

function CompanyDetailsDialog({ company, onClose }: { company: Company | null; onClose: () => void }) {
  const { state } = useSmartHire();
  const roles = company ? state.jobs.filter((job) => job.companyId === company.id && job.status === "Active") : [];
  return <Dialog open={Boolean(company)} onOpenChange={(open) => { if (!open) onClose(); }}><DialogContent className="wide-dialog"><DialogHeader><DialogTitle>{company?.name ?? "Company"}</DialogTitle><DialogDescription>{company?.industry} · {company?.size} · sample information</DialogDescription></DialogHeader>
    {company && <div className="company-detail-body"><p>{company.about}</p><div className="company-facts"><div><span>Headquarters</span><strong>{company.headquarters}</strong></div><div><span>Locations</span><strong>{company.locations.join(", ")}</strong></div><div><span>Culture</span><strong>{company.culture}</strong></div><div><span>Products</span><strong>{company.products}</strong></div></div><div><span className="field-label">Technologies</span><div className="tag-row">{company.technologies.map((tech) => <Badge key={tech} variant="secondary">{tech}</Badge>)}</div></div><div><span className="field-label">Interview process</span><ol className="plain-list">{company.interviewProcess.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol></div><div><span className="field-label">Common interview topics</span><div className="tag-row">{company.interviewTopics.map((topic) => <Badge key={topic} variant="outline">{topic}</Badge>)}</div></div><div className="company-data-note"><ShieldCheck size={15} />Sample company details. External links are demonstration-only.</div></div>}
    <DialogFooter>{company && isSafeLink(company.website) && <Button asChild variant="outline"><a href={company.website} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Sample website</a></Button>}<Button variant="outline" onClick={onClose}>Close</Button>{roles.length > 0 && <Button asChild><Link to="/discover" onClick={onClose}>Browse roles</Link></Button>}</DialogFooter>
  </DialogContent></Dialog>;
}

const roadmapTasks = [
  "Research the company and map its product to the role",
  "Review the role’s core skills and note two examples",
  "Practice technical questions aloud and explain your steps",
  "Complete one role-relevant exercise without rushing",
  "Prepare a concise story about a project you built",
  "Rehearse behavioral answers using a clear example structure",
  "Run a mock interview, rest, and prepare thoughtful questions",
];

function PreparationPage() {
  const { state, toggleRoadmapDay } = useSmartHire();
  const [companyId, setCompanyId] = useState(demoCompanies[0]?.id ?? "");
  const [role, setRole] = useState(state.profile.preferredRole);
  const [level, setLevel] = useState("Early career");
  const [date, setDate] = useState("2026-12-01");
  const company = demoCompanies.find((item) => item.id === companyId);
  const completed = state.completedRoadmapDays.length;
  const progress = Math.round((completed / roadmapTasks.length) * 100);
  const companyTask = company ? roadmapTasks.map((task) => task.replace("the company", company.name).replace("the role", role || "your role")) : roadmapTasks;
  return <div className="page-stack"><PageIntro title="A focused week, made manageable" description="Choose a sample company and role to personalize this predefined practice plan." />
    <Card className="roadmap-settings rounded-lg shadow-none"><CardContent className="roadmap-settings-grid"><Field label="Company"><Select value={companyId} onValueChange={setCompanyId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{demoCompanies.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></Field><Field label="Job role"><Input value={role} onChange={(event) => setRole(event.target.value)} placeholder="e.g. Frontend Developer" /></Field><Field label="Experience level"><Select value={level} onValueChange={setLevel}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Early career">Early career</SelectItem><SelectItem value="1–3 years">1–3 years</SelectItem><SelectItem value="4+ years">4+ years</SelectItem></SelectContent></Select></Field><Field label="Interview date"><Input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></Field></CardContent></Card>
    <div className="roadmap-progress"><div><div><p className="eyebrow">YOUR PREPARATION</p><h2>{progress}% complete</h2></div><span>{completed} of 7 days checked off</span></div><Progress value={progress} aria-label={`Preparation ${progress}% complete`} /></div>
    <div className="roadmap-list">{companyTask.map((task, index) => { const day = index + 1; const checked = state.completedRoadmapDays.includes(day); return <Card key={day} className={`roadmap-day rounded-lg shadow-none${checked ? " is-complete" : ""}`}><CardContent className="roadmap-day-content"><div className="roadmap-day-number">{checked ? <Check size={17} /> : String(day).padStart(2, "0")}</div><div className="roadmap-day-copy"><p className="eyebrow">DAY {day}{date ? ` · ${formatDate(addDays(date, day - 1))}` : ""}</p><h3>{task}</h3><p>{roadmapSupportingText(day, role, level)}</p></div><Button variant={checked ? "secondary" : "outline"} size="sm" onClick={() => toggleRoadmapDay(day)}>{checked ? "Completed" : "Mark complete"}</Button></CardContent></Card>; })}</div>
    <div className="demo-disclosure"><Sparkles size={15} /> Predefined demo roadmap · recommendations are not live AI advice.</div>
  </div>;
}

function addDays(date: string, days: number): string {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  parsed.setDate(parsed.getDate() + days);
  return parsed.toISOString().slice(0, 10);
}

function roadmapSupportingText(day: number, role: string, level: string): string {
  const texts = [
    `Review the sample company context and write a 60-second introduction for ${role || "the role"}.`,
    `At ${level.toLowerCase()}, focus on explaining the fundamentals clearly and honestly.`,
    "Say your assumptions out loud; a clear approach matters as much as the final answer.",
    "Choose a small task from the job description and practice explaining trade-offs.",
    "Outline the problem, your contribution, the tools you chose, and what changed.",
    "Use one specific situation, the action you took, and the outcome you learned from.",
    "Prepare two questions for the interviewer and keep your schedule realistic.",
  ];
  return texts[day - 1] ?? texts[0] ?? "Work through a focused practice activity.";
}

function HireMateChat({ compact = false }: { compact?: boolean }) {
  const { state, setChatMessages, resetDemo } = useSmartHire();
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const shownMessages = state.chatMessages;
  const suggestions = ["Help me improve my resume", "How should I introduce myself?", "What should I practice for a frontend interview?", "How can I explain my project?"];

  function send(text = message) {
    const cleaned = text.trim();
    if (!cleaned || typing) return;
    const userMessage = { id: `message-${Date.now()}`, author: "user" as const, text: cleaned };
    const assistantMessage = { id: `reply-${Date.now()}`, author: "assistant" as const, text: hireMateReply(cleaned) };
    setChatMessages([...shownMessages, userMessage]);
    setMessage("");
    setTyping(true);
    window.setTimeout(() => {
      setChatMessages([...shownMessages, userMessage, assistantMessage]);
      setTyping(false);
    }, 550);
  }

  return <div className={compact ? "hiremate-panel compact" : "hiremate-page page-stack"}>
    {!compact && <div className="hiremate-banner"><div className="hiremate-mark large"><Sparkles size={21} /></div><div><p className="eyebrow">YOUR CAREER CO-PILOT</p><h2>Hi {state.profile.fullName.split(" ")[0]}, what are you working on?</h2><p>Get a useful next step for your job search, interview prep, or resume.</p></div><Badge variant="outline">Demo mode</Badge></div>}
    <div className="chat-transcript" aria-live="polite">{shownMessages.length === 0 ? <div className="chat-welcome"><div className="hiremate-mark"><Sparkles size={18} /></div><div><strong>Hi, I’m HireMate.</strong><p>I can help you think through the next step. My sample responses are predefined, not live AI advice.</p></div></div> : shownMessages.map((item) => <div key={item.id} className={`chat-message ${item.author}`}><span className="chat-avatar">{item.author === "assistant" ? <Sparkles size={14} /> : state.profile.fullName.charAt(0)}</span><div><small>{item.author === "assistant" ? "HireMate · demo" : "You"}</small><p>{item.text}</p></div></div>)}{typing && <div className="chat-message assistant"><span className="chat-avatar"><Sparkles size={14} /></span><div><small>HireMate</small><p className="typing-dots"><i /><i /><i /></p></div></div>}</div>
    {shownMessages.length === 0 && <div className="suggestion-list">{suggestions.slice(0, compact ? 2 : 4).map((suggestion) => <Button key={suggestion} variant="outline" size="sm" onClick={() => send(suggestion)}>{suggestion}</Button>)}</div>}
    <form className="chat-compose" onSubmit={(event) => { event.preventDefault(); send(); }}><Input aria-label="Message HireMate" placeholder="Ask a career question..." value={message} onChange={(event) => setMessage(event.target.value)} /><Button type="submit" size="icon" aria-label="Send message" disabled={!message.trim() || typing}><Send size={16} /></Button></form>
    {!compact && <div className="chat-footer"><span>Sample responses · no live AI connection</span><Button variant="ghost" size="sm" onClick={() => { resetDemo(); toast.message("Demo data restored"); }}>Clear demo conversation</Button></div>}
  </div>;
}

function hireMateReply(prompt: string): string {
  const text = prompt.toLowerCase();
  if (text.includes("resume") || text.includes("cv")) return "Start with the role you want, then put the most relevant project or result near the top. Use clear action verbs, name the tools you used, and add numbers only when they are accurate. These are demo suggestions—review them against your real experience.";
  if (text.includes("introduc") || text.includes("tell me about")) return "Try a 45–60 second introduction: where you are in your career, one strength supported by a project, and the kind of role you want next. Keep it conversational; this demo coach cannot assess your delivery.";
  if (text.includes("project")) return "Explain your project in four steps: the problem, your contribution, one technical decision, and what you would improve next. For Campus Connect, focus on what you personally built rather than listing every tool.";
  if (text.includes("skill") || text.includes("learn")) return "Choose one skill that appears in several roles you like. Build a small project using it, write down what you learned, then add the evidence to your profile. Your skill-match scores are based on exact listed skill overlap.";
  if (text.includes("interview") || text.includes("question")) return "Read the role description, prepare two project stories, and practice explaining your thinking aloud. Use the Preparation Roadmap or Mock Interview for a structured sample practice session.";
  if (text.includes("job") || text.includes("career") || text.includes("role")) return "Start with your preferred role and location, then compare the required skills with your current profile. Save interesting roles first; shortlist and application tracking are separate.";
  return "A helpful next step is to make your goal specific: which role, which skill, or which interview are you preparing for? I can offer predefined demo guidance, but not live AI analysis.";
}

function MockInterviewPage() {
  const { state, setMockAnswer } = useSmartHire();
  const [role, setRole] = useState("Frontend Developer");
  const [kind, setKind] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [evaluated, setEvaluated] = useState(false);
  const questions = mockQuestions(kind);
  const question = questions[questionIndex % questions.length] ?? questions[0] ?? "Tell me about a project you enjoyed building.";
  const answer = state.mockAnswers[questionIndex] ?? "";
  const score = answer.trim().length < 40 ? 48 : answer.trim().length < 110 ? 72 : 86;
  return <div className="page-stack"><PageIntro title="Practice with room to think" description="Choose a format and work through one sample question at a time." />
    <Card className="mock-settings rounded-lg shadow-none"><CardContent className="mock-settings-grid"><Field label="Job role"><Input value={role} onChange={(event) => setRole(event.target.value)} /></Field><Field label="Interview type"><Select value={kind} onValueChange={setKind}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Technical">Technical</SelectItem><SelectItem value="HR">HR</SelectItem><SelectItem value="Behavioral">Behavioral</SelectItem></SelectContent></Select></Field><Field label="Difficulty"><Select value={difficulty} onValueChange={setDifficulty}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Beginner">Beginner</SelectItem><SelectItem value="Intermediate">Intermediate</SelectItem><SelectItem value="Advanced">Advanced</SelectItem></SelectContent></Select></Field></CardContent></Card>
    <Card className="mock-question-card rounded-lg shadow-none"><CardContent className="mock-question-content"><div className="mock-question-meta"><Badge variant="secondary">{kind}</Badge><span>{difficulty} · Question {questionIndex + 1}</span></div><p className="eyebrow">{role.toUpperCase()}</p><h2>{question}</h2><Field label="Your answer"><Textarea value={answer} onChange={(event) => { setMockAnswer(questionIndex, event.target.value); setEvaluated(false); }} placeholder="Structure your answer with a specific example..." rows={6} /></Field><div className="mock-actions"><Button variant="outline" onClick={() => { setQuestionIndex((index) => index + 1); setEvaluated(false); }}><ArrowRight size={15} /> Next question</Button><Button onClick={() => setEvaluated(true)} disabled={!answer.trim()}><Sparkles size={15} /> Review answer</Button></div>
      {evaluated && <div className="feedback-panel"><div className="feedback-score"><strong>{score}</strong><span>/ 100 demo indicator</span></div><div><h3>{answer.trim().length < 40 ? "Add a specific example" : "A clear foundation"}</h3><p>{answer.trim().length < 40 ? "Try adding the situation, what you did, and the outcome. A short answer leaves little evidence to review." : "Your answer has a useful amount of detail. Make your own contribution and one concrete outcome easy to identify."}</p><p className="suggested-answer"><strong>Sample structure:</strong> Context → your decision → action → result → what you learned. This is fixed demo feedback, not an AI evaluation.</p></div></div>}
    </CardContent></Card>
    <div className="demo-disclosure"><Sparkles size={15} /> Questions and feedback are predefined for demonstration; no speech or AI scoring is used.</div>
  </div>;
}

function mockQuestions(kind: string): string[] {
  if (kind === "HR") return ["What kind of team helps you do your best work?", "What is one strength you are developing?", "Why does this role interest you right now?"];
  if (kind === "Behavioral") return ["Tell me about a time a project changed direction. How did you respond?", "Describe a disagreement on a team and how you handled it.", "What is a piece of feedback that changed your approach?"];
  return ["How would you make a React page feel responsive while its data is loading?", "When would you choose a relational database for an application?", "How would you test an API endpoint before release?"];
}

function ResumeAssistantPage() {
  const { state, saveProfile, setResumeText, setResumeJobDescription } = useSmartHire();
  const [analysisShown, setAnalysisShown] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const knownSkills = Array.from(new Set(state.jobs.flatMap((job) => job.skills)));
  const resumeAndJobText = `${state.resumeText} ${state.resumeJobDescription}`.toLowerCase();
  const matchingKeywords = knownSkills.filter((skill) => resumeAndJobText.includes(skill.toLowerCase()));
  const missingSkills = state.resumeJobDescription ? knownSkills.filter((skill) => state.resumeJobDescription.toLowerCase().includes(skill.toLowerCase()) && !state.resumeText.toLowerCase().includes(skill.toLowerCase())) : [];
  function saveDraft() {
    const blob = new Blob([state.resumeText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "smarthire-resume-draft.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }
  function createSummary() {
    const summary = `${state.profile.degree} graduate with hands-on experience in ${state.profile.skills.slice(0, 3).join(", ") || "software projects"}. Interested in ${state.profile.preferredRole || "a software role"} opportunities in ${state.profile.preferredLocation || "India"}.`;
    setResumeText(`${state.profile.fullName}\n\n${summary}\n\nSkills: ${state.profile.skills.join(", ")}\n\nProjects: ${state.profile.projects}`);
    toast.success("Sample summary added to your draft");
  }
  return <div className="page-stack"><PageIntro title="Make your experience easier to scan" description="Edit a sample text draft, check role keywords, and save a plain-text copy." action={<Button variant="outline" onClick={() => uploadRef.current?.click()}><Upload size={15} /> Choose resume</Button>} />
    <input ref={uploadRef} className="visually-hidden" type="file" accept=".txt,.pdf,.doc,.docx" aria-label="Choose a resume file" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; saveProfile({ ...state.profile, resumeName: file.name }); toast.message(`${file.name} selected`, { description: "Demo mode saves the file name only; the file is not uploaded or parsed." }); }} />
    <div className="resume-grid"><div className="resume-editor"><Card className="rounded-lg shadow-none"><CardContent className="resume-editor-content"><div className="resume-editor-heading"><div><p className="eyebrow">RESUME TEXT</p><h2>{state.profile.resumeName || "Resume draft"}</h2></div><Button variant="ghost" size="sm" onClick={createSummary}><WandSparkles size={15} /> Draft summary</Button></div><Textarea aria-label="Resume text" value={state.resumeText} onChange={(event) => setResumeText(event.target.value)} rows={14} /><Field label="Job description to compare"><Textarea aria-label="Job description" value={state.resumeJobDescription} onChange={(event) => setResumeJobDescription(event.target.value)} rows={6} placeholder="Paste a role description here to compare relevant skills..." /></Field><div className="resume-actions"><Button variant="outline" onClick={() => { setAnalysisShown(true); toast.message("Keyword comparison ready"); }}><Search size={15} /> Compare keywords</Button><Button onClick={saveDraft}><Download size={15} /> Download draft</Button></div></CardContent></Card></div>
      <aside className="resume-guidance"><Card className="rounded-lg shadow-none"><CardContent className="resume-guidance-content"><div className="panel-heading compact-heading"><div><p className="eyebrow">SAMPLE REVIEW</p><h2>Resume checklist</h2></div><FileCheck2 size={19} /></div><ul className="checklist"><li><CheckCircle2 size={16} />Contact details are easy to find</li><li><CheckCircle2 size={16} />Skills use consistent names</li><li><CheckCircle2 size={16} />Project contribution is specific</li><li><CircleHelp size={16} />Add measurable outcomes where accurate</li><li><CircleHelp size={16} />Proofread dates and role titles</li></ul><div className="guidance-divider" /><div className="keyword-summary"><span>Matched sample keywords</span><strong>{matchingKeywords.length}</strong><div className="tag-row">{(analysisShown ? matchingKeywords : matchingKeywords.slice(0, 4)).map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}{analysisShown && missingSkills.map((skill) => <Badge key={skill} variant="outline" className="missing-keyword">Missing · {skill}</Badge>)}</div></div><div className="demo-disclosure"><Sparkles size={14} /> Predefined checklist · not live AI or ATS scoring.</div></CardContent></Card></aside></div>
  </div>;
}

function RecruiterPage() {
  const { state, saveJob, deleteJob, changeApplicationStatus, scheduleInterview } = useSmartHire();
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [scheduleFor, setScheduleFor] = useState<Application | null>(null);
  const activeJobs = state.jobs.filter((job) => job.status === "Active");
  const selectedCount = state.applications.filter((item) => item.status === "Shortlisted").length;
  const interviewsCount = state.interviews.filter((item) => item.status === "Scheduled" || item.status === "Confirmed").length;

  function saveJobForm(job: Job) {
    saveJob(job);
    setFormOpen(false);
    setEditingJob(null);
    toast.success(editingJob ? "Sample role updated" : "Sample role posted");
  }

  return <div className="page-stack"><div className="demo-disclosure"><ShieldCheck size={15} /> Recruiter demo workspace · changes stay in this browser and are not visible to real applicants.</div>
    <div className="stats-grid recruiter-stats"><StatCard label="Roles posted" value={state.jobs.length} note="Sample listings" icon={BriefcaseBusiness} /><StatCard label="Active roles" value={activeJobs.length} note="Currently visible in demo" icon={CheckCircle2} tone="green" /><StatCard label="Applications" value={state.applications.length} note="Sample candidate activity" icon={FileText} tone="orange" /><StatCard label="Shortlisted" value={selectedCount} note={`${interviewsCount} interviews scheduled`} icon={Star} tone="pink" /></div>
    <div className="recruiter-toolbar"><div><h2>Manage job listings</h2><p>Create, edit, pause, or remove a sample role.</p></div><Button onClick={() => { setEditingJob(null); setFormOpen((open) => !open); }}><Plus size={16} /> Post a role</Button></div>
    {(formOpen || editingJob) && <JobForm key={editingJob?.id ?? "new"} initialJob={editingJob} onSave={saveJobForm} onCancel={() => { setEditingJob(null); setFormOpen(false); }} />}
    <div className="recruiter-job-list">{state.jobs.map((job) => <Card key={job.id} className="recruiter-job-row rounded-lg shadow-none"><CardContent><div><h3>{job.title}</h3><p><CompanyName companyId={job.companyId} /> · {job.location} · {formatSalary(job.salaryMin, job.salaryMax)}</p></div><Badge variant={job.status === "Active" ? "secondary" : "outline"}>{job.status}</Badge><div className="recruiter-job-actions"><Button variant="ghost" size="sm" onClick={() => { setEditingJob(job); setFormOpen(false); }}>Edit</Button><Button variant="outline" size="sm" onClick={() => saveJob({ ...job, status: job.status === "Active" ? "Paused" : "Active" })}>{job.status === "Active" ? "Pause" : "Resume"}</Button><Button variant="ghost" size="icon" aria-label={`Delete ${job.title}`} onClick={() => { deleteJob(job.id); toast.message("Sample role removed"); }}><Trash2 size={15} /></Button></div></CardContent></Card>)}</div>
    <div className="recruiter-toolbar applicants-heading"><div><h2>Candidate applications</h2><p>Review sample applications, change a status, or add interview details.</p></div></div>
    {state.applications.length ? <div className="candidate-review-list">{state.applications.map((application) => <CandidateReview key={application.id} application={application} onStatus={changeApplicationStatus} onSchedule={() => setScheduleFor(application)} />)}</div> : <EmptyState icon={Users} title="No sample applicants" body="Applications submitted in Candidate demo appear here." />}
    <ScheduleInterviewDialog application={scheduleFor} onClose={() => setScheduleFor(null)} onSchedule={(details) => { scheduleInterview(details); setScheduleFor(null); toast.success("Interview details saved", { description: "They now appear in the candidate interview hub." }); }} />
  </div>;
}

function JobForm({ initialJob, onSave, onCancel }: { initialJob: Job | null; onSave: (job: Job) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(initialJob?.title ?? "");
  const [companyId, setCompanyId] = useState(initialJob?.companyId ?? demoCompanies[0]?.id ?? "");
  const [description, setDescription] = useState(initialJob?.description ?? "");
  const [skills, setSkills] = useState(initialJob?.skills.join(", ") ?? "");
  const [qualification, setQualification] = useState(initialJob?.qualification ?? "");
  const [experience, setExperience] = useState(initialJob?.experience ?? "0–2 years");
  const [location, setLocation] = useState(initialJob?.location ?? "Bengaluru · Hybrid");
  const [salary, setSalary] = useState(initialJob ? String(Math.round(initialJob.salaryMin / 1000)) : "700");
  const [type, setType] = useState<JobType>(initialJob?.employmentType ?? "Full-time");
  const [openings, setOpenings] = useState(initialJob ? String(initialJob.openings) : "1");
  const [deadline, setDeadline] = useState(initialJob?.deadline ?? "2026-12-20");
  return <Card className="job-form-card rounded-lg shadow-none"><CardContent><div className="panel-heading"><div><p className="eyebrow">{initialJob ? "EDIT LISTING" : "NEW LISTING"}</p><h2>{initialJob ? "Update sample role" : "Create a sample role"}</h2></div><Button variant="ghost" size="icon" aria-label="Close job form" onClick={onCancel}><X size={17} /></Button></div>
    <form className="job-form" onSubmit={(event) => { event.preventDefault(); const job: Job = { id: initialJob?.id ?? `job-${Date.now()}`, title: title.trim(), companyId, location: location.trim(), salaryMin: Number(salary) * 1000, salaryMax: Number(salary) * 1000 * 1.35, experience, employmentType: type, skills: skills.split(",").map((item) => item.trim()).filter(Boolean), qualification, description, postedAt: "Just now", openings: Math.max(1, Number(openings) || 1), deadline, status: initialJob?.status ?? "Active" }; onSave(job); }}>
      <Field label="Job title"><Input required value={title} onChange={(event) => setTitle(event.target.value)} /></Field><Field label="Company"><Select value={companyId} onValueChange={setCompanyId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{demoCompanies.map((company) => <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>)}</SelectContent></Select></Field><Field label="Location"><Input required value={location} onChange={(event) => setLocation(event.target.value)} /></Field><Field label="Employment type"><Select value={type} onValueChange={(value) => setType(value as JobType)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Full-time">Full-time</SelectItem><SelectItem value="Internship">Internship</SelectItem><SelectItem value="Contract">Contract</SelectItem></SelectContent></Select></Field><Field label="Required skills · comma separated"><Input required value={skills} onChange={(event) => setSkills(event.target.value)} /></Field><Field label="Experience"><Input required value={experience} onChange={(event) => setExperience(event.target.value)} /></Field><Field label="Salary starting point · ₹ thousands / year"><Input required type="number" min="1" value={salary} onChange={(event) => setSalary(event.target.value)} /></Field><Field label="Openings"><Input type="number" min="1" value={openings} onChange={(event) => setOpenings(event.target.value)} /></Field><Field label="Application deadline"><Input type="date" required value={deadline} onChange={(event) => setDeadline(event.target.value)} /></Field><Field label="Qualification"><Input value={qualification} onChange={(event) => setQualification(event.target.value)} /></Field><Field className="form-wide" label="Job description"><Textarea required value={description} onChange={(event) => setDescription(event.target.value)} rows={4} /></Field><div className="form-wide job-form-footer"><span>Sample listing · not published to a real job board</span><div><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit">{initialJob ? "Save changes" : "Post sample role"}</Button></div></div>
    </form></CardContent></Card>;
}

function CandidateReview({ application, onStatus, onSchedule }: { application: Application; onStatus: (applicationId: string, status: ApplicationStatus) => void; onSchedule: () => void }) {
  const { state } = useSmartHire();
  const job = state.jobs.find((item) => item.id === application.jobId);
  if (!job) return null;
  const match = getMatchResult(job, state.profile);
  return <Card className="candidate-review-card rounded-lg shadow-none"><CardContent><div className="candidate-review-top"><div className="candidate-avatar">{state.profile.fullName.charAt(0)}</div><div><h3>{state.profile.fullName} <Badge variant="outline">Sample candidate</Badge></h3><p>{job.title} · {state.profile.degree} · {state.profile.experience}</p></div><MatchBadge job={job} profile={state.profile} /></div><div className="tag-row">{state.profile.skills.slice(0, 6).map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}</div><div className="candidate-review-actions"><Button variant="outline" size="sm" onClick={() => toast.message("Sample profile details are shown here.")}>View profile</Button><Button variant="outline" size="sm" onClick={() => toast.message(state.profile.resumeName ? `Sample resume: ${state.profile.resumeName}` : "No sample resume added.")}>Résumé: {state.profile.resumeName ? "sample file" : "not added"}</Button><span className="candidate-match-copy">{match.matchedSkills.length}/{job.skills.length} listed skills matched</span><div className="candidate-action-group"><Button variant="outline" size="sm" onClick={() => { onStatus(application.id, "Shortlisted"); toast.success("Sample candidate shortlisted"); }}><ThumbsUp size={14} /> Shortlist</Button><Button variant="ghost" size="sm" onClick={() => { onStatus(application.id, "Rejected"); toast.message("Sample application marked rejected"); }}><ThumbsDown size={14} /> Reject</Button><Button size="sm" onClick={onSchedule}><CalendarDays size={14} /> Schedule</Button></div></div></CardContent></Card>;
}

function ScheduleInterviewDialog({ application, onClose, onSchedule }: { application: Application | null; onClose: () => void; onSchedule: (details: { applicationId: string; jobId: string; companyId: string; date: string; time: string; type: Interview["type"]; rounds: string[]; interviewer: string; hrContact: string; address: string; meetingLink: string; instructions: string }) => void }) {
  const { state } = useSmartHire();
  const job = application ? state.jobs.find((item) => item.id === application.jobId) : undefined;
  const [date, setDate] = useState("2026-12-03");
  const [time, setTime] = useState("10:00 AM IST");
  const [type, setType] = useState<Interview["type"]>("Online");
  const [rounds, setRounds] = useState("Introductory round, Technical discussion");
  const [interviewer, setInterviewer] = useState("");
  const [hrContact, setHrContact] = useState("");
  const [address, setAddress] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [instructions, setInstructions] = useState("");
  return <Dialog open={Boolean(application)} onOpenChange={(open) => { if (!open) onClose(); }}><DialogContent className="wide-dialog"><DialogHeader><DialogTitle>Schedule an interview</DialogTitle><DialogDescription>{job ? `${job.title} · ${job.location}` : "Enter the details provided to the candidate."}</DialogDescription></DialogHeader>
    <form className="schedule-form" onSubmit={(event) => { event.preventDefault(); if (!application || !job) return; onSchedule({ applicationId: application.id, jobId: job.id, companyId: job.companyId, date, time, type, rounds: rounds.split(",").map((item) => item.trim()).filter(Boolean), interviewer, hrContact, address: type === "In-person" ? address : "", meetingLink: type === "Online" ? meetingLink : "", instructions }); }}>
      <Field label="Date"><Input required type="date" value={date} onChange={(event) => setDate(event.target.value)} /></Field><Field label="Time and time zone"><Input required value={time} onChange={(event) => setTime(event.target.value)} /></Field><Field label="Interview type"><Select value={type} onValueChange={(value) => setType(value as Interview["type"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Online">Online</SelectItem><SelectItem value="Phone">Phone</SelectItem><SelectItem value="In-person">In-person</SelectItem></SelectContent></Select></Field><Field label="Rounds · comma separated"><Input value={rounds} onChange={(event) => setRounds(event.target.value)} /></Field><Field label="Interviewer"><Input value={interviewer} onChange={(event) => setInterviewer(event.target.value)} placeholder="Not required" /></Field><Field label="HR contact"><Input type="email" value={hrContact} onChange={(event) => setHrContact(event.target.value)} placeholder="Not required" /></Field>{type === "Online" && <Field label="Meeting link"><Input type="url" value={meetingLink} onChange={(event) => setMeetingLink(event.target.value)} placeholder="https://..." /></Field>}{type === "In-person" && <Field className="form-wide" label="Interview address"><Input required value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Enter the actual interview address" /></Field>}<Field className="form-wide" label="Special instructions"><Textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} rows={3} /></Field><div className="form-wide schedule-form-footer"><span>Only details entered here are shared in the demo interview hub.</span><div><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit">Save interview</Button></div></div>
    </form>
  </DialogContent></Dialog>;
}

function AdminPage() {
  const { state, saveJob, deleteJob } = useSmartHire();
  const [tab, setTab] = useState<"activity" | "jobs" | "users">("activity");
  const active = state.jobs.filter((job) => job.status === "Active").length;
  const statusBars = [
    { label: "Applied", value: state.applications.filter((item) => item.status === "Applied").length + 3 },
    { label: "Review", value: state.applications.filter((item) => item.status === "Under Review").length + 2 },
    { label: "Shortlist", value: state.applications.filter((item) => item.status === "Shortlisted").length + 1 },
    { label: "Interview", value: state.interviews.length + 1 },
  ];
  const maxBar = Math.max(...statusBars.map((item) => item.value), 1);
  return <div className="page-stack"><div className="demo-disclosure"><ShieldCheck size={15} /> Admin demo only · sample activity and users; no production permissions are granted.</div>
    <div className="stats-grid"><StatCard label="Sample users" value="3" note="One demo account per role" icon={Users} /><StatCard label="Candidates" value="1" note="Sample profile" icon={GraduationCap} tone="green" /><StatCard label="Recruiters" value="1" note="Sample workspace" icon={BriefcaseBusiness} tone="orange" /><StatCard label="Active jobs" value={active} note="Sample listings" icon={Building2} tone="pink" /></div>
    <div className="admin-tabs" role="tablist" aria-label="Admin views">{(["activity", "jobs", "users"] as const).map((item) => <Button key={item} role="tab" aria-selected={tab === item} variant={tab === item ? "secondary" : "ghost"} size="sm" onClick={() => setTab(item)}>{item === "activity" ? "Activity" : item === "jobs" ? "Job listings" : "Demo users"}</Button>)}</div>
    {tab === "activity" && <div className="admin-grid"><Card className="admin-chart-card rounded-lg shadow-none"><CardContent><div className="panel-heading compact-heading"><div><p className="eyebrow">APPLICATION PIPELINE</p><h2>Sample activity</h2></div><span className="chart-legend"><i /> tracked actions</span></div><div className="admin-bars">{statusBars.map((item) => <div key={item.label} className="admin-bar-group"><strong>{item.value}</strong><span className="admin-bar-track"><i style={{ height: `${Math.round(item.value / maxBar * 100)}%` }} /></span><small>{item.label}</small></div>)}</div></CardContent></Card><Card className="admin-activity-card rounded-lg shadow-none"><CardContent><p className="eyebrow">PLATFORM SUMMARY</p><h2>Activity at a glance</h2><div className="admin-summary-list"><span>Applications <strong>{state.applications.length + 6}</strong></span><span>Scheduled interviews <strong>{state.interviews.length}</strong></span><span>Shortlisted roles <strong>{state.shortlistIds.length}</strong></span><span>Paused sample roles <strong>{state.jobs.length - active}</strong></span></div></CardContent></Card></div>}
    {tab === "jobs" && <div className="admin-list">{state.jobs.map((job) => <div className="admin-list-row" key={job.id}><div><strong>{job.title}</strong><span><CompanyName companyId={job.companyId} /> · {job.location}</span></div><Badge variant={job.status === "Active" ? "secondary" : "outline"}>{job.status}</Badge><div className="admin-list-actions"><Button variant="outline" size="sm" onClick={() => { saveJob({ ...job, status: job.status === "Active" ? "Paused" : "Active" }); toast.message("Sample job status updated"); }}>{job.status === "Active" ? "Pause" : "Resume"}</Button><Button variant="ghost" size="icon" aria-label={`Remove ${job.title}`} onClick={() => { deleteJob(job.id); toast.message("Sample listing removed"); }}><Trash2 size={15} /></Button></div></div>)}</div>}
    {tab === "users" && <div className="admin-users">{[{ name: "Aarav Mehta", role: "Candidate demo", email: "candidate.demo@smarthire.example", initial: "A" }, { name: "Riya Kapoor", role: "Recruiter demo", email: "recruiter.demo@smarthire.example", initial: "R" }, { name: "Sam Patel", role: "Admin demo", email: "admin.demo@smarthire.example", initial: "S" }].map((user) => <Card key={user.email} className="admin-user-card rounded-lg shadow-none"><CardContent><span className="candidate-avatar">{user.initial}</span><div><strong>{user.name}</strong><span>{user.email}</span></div><Badge variant="outline">{user.role}</Badge></CardContent></Card>)}</div>}
  </div>;
}

function NotificationsPage() {
  const { state, markNotificationRead, clearNotifications } = useSmartHire();
  const unread = state.notifications.filter((item) => !item.read).length;
  const iconMap = { job: Compass, application: BriefcaseBusiness, interview: CalendarDays, recruiter: Users };
  return <div className="page-stack"><PageIntro title={`${unread} unread updates`} description="New recommendations and sample status changes appear here." action={<Button variant="outline" size="sm" onClick={clearNotifications}><Trash2 size={14} /> Clear all</Button>} />
    {state.notifications.length ? <div className="notification-list">{state.notifications.map((item) => { const Icon = iconMap[item.kind]; return <Card key={item.id} className={`notification-card rounded-lg shadow-none${item.read ? " is-read" : ""}`}><CardContent><span className={`notification-icon notification-${item.kind}`}><Icon size={17} /></span><div className="notification-copy"><div className="recommendation-title-row"><h3>{item.title}</h3>{!item.read && <span className="unread-marker">NEW</span>}</div><p>{item.detail}</p><span>{item.createdAt}</span></div>{!item.read && <Button variant="ghost" size="sm" onClick={() => markNotificationRead(item.id)}>Mark read</Button>}</CardContent></Card>; })}</div> : <EmptyState icon={Bell} title="All caught up" body="New sample updates will appear here after you take action." />}
  </div>;
}

function ProfilePage() {
  const { state, saveProfile } = useSmartHire();
  const [draft, setDraft] = useState<CandidateProfile>(state.profile);
  const [skills, setSkills] = useState(state.profile.skills.join(", "));
  const [languages, setLanguages] = useState(state.profile.languages.join(", "));
  const completion = getProfileCompletion(state.profile);
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const profile = { ...draft, skills: skills.split(",").map((item) => item.trim()).filter(Boolean), languages: languages.split(",").map((item) => item.trim()).filter(Boolean) };
    saveProfile(profile);
    toast.success("Sample profile saved in this browser");
  }
  return <div className="page-stack"><div className="profile-overview"><div className="profile-avatar">{draft.fullName.charAt(0)}</div><div><p className="eyebrow">CANDIDATE PROFILE · SAMPLE</p><h2>{draft.fullName}</h2><p>{draft.preferredRole} · {draft.preferredLocation}</p></div><div className="profile-completion"><strong>{completion}%</strong><span>complete</span><Progress value={completion} aria-label={`Profile ${completion}% complete`} /></div></div>
    <form className="profile-form" onSubmit={save}><Card className="rounded-lg shadow-none"><CardContent className="profile-card-content"><div className="panel-heading"><div><p className="eyebrow">ABOUT YOU</p><h2>Personal details</h2></div></div><div className="profile-fields"><Field label="Full name"><Input required value={draft.fullName} onChange={(event) => setDraft({ ...draft, fullName: event.target.value })} /></Field><Field label="Email"><Input type="email" required value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></Field><Field label="Phone"><Input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></Field><Field label="Career objective"><Input value={draft.objective} onChange={(event) => setDraft({ ...draft, objective: event.target.value })} /></Field></div></CardContent></Card>
      <Card className="rounded-lg shadow-none"><CardContent className="profile-card-content"><div className="panel-heading"><div><p className="eyebrow">EDUCATION & EXPERIENCE</p><h2>Your background</h2></div></div><div className="profile-fields"><Field label="Degree"><Input value={draft.degree} onChange={(event) => setDraft({ ...draft, degree: event.target.value })} /></Field><Field label="College"><Input value={draft.college} onChange={(event) => setDraft({ ...draft, college: event.target.value })} /></Field><Field label="Graduation year"><Input value={draft.graduationYear} onChange={(event) => setDraft({ ...draft, graduationYear: event.target.value })} /></Field><Field label="Experience"><Input value={draft.experience} onChange={(event) => setDraft({ ...draft, experience: event.target.value })} /></Field><Field label="Certifications"><Input value={draft.certifications} onChange={(event) => setDraft({ ...draft, certifications: event.target.value })} /></Field><Field label="Projects"><Input value={draft.projects} onChange={(event) => setDraft({ ...draft, projects: event.target.value })} /></Field></div></CardContent></Card>
      <Card className="rounded-lg shadow-none"><CardContent className="profile-card-content"><div className="panel-heading"><div><p className="eyebrow">CAREER PREFERENCES</p><h2>What you’re looking for</h2></div></div><div className="profile-fields"><Field label="Skills · comma separated"><Input value={skills} onChange={(event) => setSkills(event.target.value)} /></Field><Field label="Programming languages · comma separated"><Input value={languages} onChange={(event) => setLanguages(event.target.value)} /></Field><Field label="Technologies"><Input value={draft.technologies.join(", ")} onChange={(event) => setDraft({ ...draft, technologies: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /></Field><Field label="Preferred role"><Input value={draft.preferredRole} onChange={(event) => setDraft({ ...draft, preferredRole: event.target.value })} /></Field><Field label="Preferred location"><Input value={draft.preferredLocation} onChange={(event) => setDraft({ ...draft, preferredLocation: event.target.value })} /></Field><Field label="Expected salary"><Input value={draft.expectedSalary} onChange={(event) => setDraft({ ...draft, expectedSalary: event.target.value })} /></Field><Field label="LinkedIn URL"><Input type="url" value={draft.linkedin} onChange={(event) => setDraft({ ...draft, linkedin: event.target.value })} /></Field><Field label="GitHub URL"><Input type="url" value={draft.github} onChange={(event) => setDraft({ ...draft, github: event.target.value })} /></Field><Field className="form-wide" label="Résumé file name"><Input value={draft.resumeName} onChange={(event) => setDraft({ ...draft, resumeName: event.target.value })} /></Field></div><div className="profile-save-row"><span>Demo profile data is saved only in this browser.</span><Button type="submit"><Check size={15} /> Save profile</Button></div></CardContent></Card>
    </form>
  </div>;
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return <div className={`field ${className ?? ""}`}><Label htmlFor={id}>{label}</Label><div id={id}>{children}</div></div>;
}

function EmptyState({ icon: Icon, title, body, action }: { icon: typeof BriefcaseBusiness; title: string; body: string; action?: React.ReactNode }) {
  return <div className="empty-state"><span className="empty-state-icon"><Icon size={22} /></span><h2>{title}</h2><p>{body}</p>{action}</div>;
}