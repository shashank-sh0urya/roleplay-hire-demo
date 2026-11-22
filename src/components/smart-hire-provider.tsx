import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import {
  demoApplications,
  demoInterviews,
  demoJobs,
  demoNotifications,
  demoProfile,
  type Application,
  type ApplicationStatus,
  type AppNotification,
  type CandidateProfile,
  type DemoRole,
  type Interview,
  type Job,
} from "@/lib/smart-hire-data";

export interface ChatMessage {
  id: string;
  author: "user" | "assistant";
  text: string;
}

export interface WorkspaceState {
  role: DemoRole;
  profile: CandidateProfile;
  jobs: Job[];
  applications: Application[];
  interviews: Interview[];
  notifications: AppNotification[];
  shortlistIds: string[];
  skippedIds: string[];
  completedRoadmapDays: number[];
  chatMessages: ChatMessage[];
  resumeText: string;
  resumeJobDescription: string;
  mockAnswers: string[];
}

interface NewInterview {
  applicationId: string;
  jobId: string;
  companyId: string;
  date: string;
  time: string;
  type: Interview["type"];
  rounds: string[];
  interviewer: string;
  hrContact: string;
  address: string;
  meetingLink: string;
  instructions: string;
}

interface SmartHireContextValue {
  state: WorkspaceState;
  hydrated: boolean;
  setRole: (role: DemoRole) => void;
  saveProfile: (profile: CandidateProfile) => void;
  addToShortlist: (jobId: string) => void;
  removeFromShortlist: (jobId: string) => void;
  skipJob: (jobId: string) => void;
  restoreSkippedJob: (jobId: string) => void;
  applyToJob: (jobId: string) => boolean;
  saveJob: (job: Job) => void;
  deleteJob: (jobId: string) => void;
  changeApplicationStatus: (applicationId: string, status: ApplicationStatus) => void;
  scheduleInterview: (interview: NewInterview) => void;
  setInterviewStatus: (interviewId: string, status: Interview["status"]) => void;
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: () => void;
  toggleRoadmapDay: (day: number) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  setResumeText: (text: string) => void;
  setResumeJobDescription: (text: string) => void;
  setMockAnswer: (index: number, answer: string) => void;
  resetDemo: () => void;
}

const STORAGE_KEY = "smarthire-ai-demo-v1";
const SmartHireContext = createContext<SmartHireContextValue | null>(null);

function createDemoState(): WorkspaceState {
  return {
    role: "candidate",
    profile: { ...demoProfile, skills: [...demoProfile.skills], languages: [...demoProfile.languages], technologies: [...demoProfile.technologies] },
    jobs: demoJobs.map((job) => ({ ...job, skills: [...job.skills] })),
    applications: demoApplications.map((application) => ({ ...application, recruiterUpdates: [...application.recruiterUpdates] })),
    interviews: demoInterviews.map((interview) => ({ ...interview, rounds: [...interview.rounds] })),
    notifications: demoNotifications.map((notification) => ({ ...notification })),
    shortlistIds: ["job-04", "job-11"],
    skippedIds: [],
    completedRoadmapDays: [1],
    chatMessages: [],
    resumeText: "Aarav Mehta\nMCA graduate\nSkills: Python, SQL, React, JavaScript\nProject: Campus Connect — student collaboration portal built with React and Node.js.",
    resumeJobDescription: "",
    mockAnswers: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function readDemoState(raw: string): WorkspaceState | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;

    const defaults = createDemoState();
    const profile = isRecord(parsed.profile)
      ? ({ ...defaults.profile, ...parsed.profile } as CandidateProfile)
      : defaults.profile;

    return {
      ...defaults,
      role: parsed.role === "recruiter" || parsed.role === "admin" ? parsed.role : "candidate",
      profile,
      jobs: Array.isArray(parsed.jobs) ? (parsed.jobs as Job[]) : defaults.jobs,
      applications: Array.isArray(parsed.applications) ? (parsed.applications as Application[]) : defaults.applications,
      interviews: Array.isArray(parsed.interviews) ? (parsed.interviews as Interview[]) : defaults.interviews,
      notifications: Array.isArray(parsed.notifications) ? (parsed.notifications as AppNotification[]) : defaults.notifications,
      shortlistIds: isStringArray(parsed.shortlistIds) ? parsed.shortlistIds : defaults.shortlistIds,
      skippedIds: isStringArray(parsed.skippedIds) ? parsed.skippedIds : defaults.skippedIds,
      completedRoadmapDays: Array.isArray(parsed.completedRoadmapDays)
        ? parsed.completedRoadmapDays.filter((day): day is number => typeof day === "number")
        : defaults.completedRoadmapDays,
      chatMessages: Array.isArray(parsed.chatMessages) ? (parsed.chatMessages as ChatMessage[]) : defaults.chatMessages,
      resumeText: typeof parsed.resumeText === "string" ? parsed.resumeText : defaults.resumeText,
      resumeJobDescription:
        typeof parsed.resumeJobDescription === "string" ? parsed.resumeJobDescription : defaults.resumeJobDescription,
      mockAnswers: isStringArray(parsed.mockAnswers) ? parsed.mockAnswers : defaults.mockAnswers,
    };
  } catch {
    return null;
  }
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

export function SmartHireProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkspaceState>(createDemoState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const restored = readDemoState(saved);
      if (restored) setState(restored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // The current session remains usable if this browser blocks local storage.
    }
  }, [hydrated, state]);

  const value: SmartHireContextValue = {
    state,
    hydrated,
    setRole: (role) => setState((current) => ({ ...current, role })),
    saveProfile: (profile) => setState((current) => ({ ...current, profile })),
    addToShortlist: (jobId) =>
      setState((current) =>
        current.shortlistIds.includes(jobId)
          ? current
          : { ...current, shortlistIds: [...current.shortlistIds, jobId] },
      ),
    removeFromShortlist: (jobId) =>
      setState((current) => ({
        ...current,
        shortlistIds: current.shortlistIds.filter((id) => id !== jobId),
      })),
    skipJob: (jobId) =>
      setState((current) =>
        current.skippedIds.includes(jobId)
          ? current
          : { ...current, skippedIds: [...current.skippedIds, jobId] },
      ),
    restoreSkippedJob: (jobId) =>
      setState((current) => ({ ...current, skippedIds: current.skippedIds.filter((id) => id !== jobId) })),
    applyToJob: (jobId) => {
      if (state.applications.some((application) => application.jobId === jobId)) return false;
      const application: Application = {
        id: makeId("application"),
        jobId,
        appliedAt: new Date().toISOString().slice(0, 10),
        status: "Applied",
        recruiterUpdates: ["Application submitted"],
      };
      setState((current) =>
        current.applications.some((existing) => existing.jobId === jobId)
          ? current
          : {
              ...current,
              applications: [application, ...current.applications],
              notifications: [
                {
                  id: makeId("notice"),
                  title: "Application submitted",
                  detail: `Your application for ${current.jobs.find((job) => job.id === jobId)?.title ?? "this job"} was added to your tracker.`,
                  createdAt: "Just now",
                  read: false,
                  kind: "application",
                },
                ...current.notifications,
              ],
            },
      );
      return true;
    },
    saveJob: (job) =>
      setState((current) => {
        const exists = current.jobs.some((item) => item.id === job.id);
        return {
          ...current,
          jobs: exists ? current.jobs.map((item) => (item.id === job.id ? job : item)) : [job, ...current.jobs],
        };
      }),
    deleteJob: (jobId) =>
      setState((current) => ({ ...current, jobs: current.jobs.filter((job) => job.id !== jobId) })),
    changeApplicationStatus: (applicationId, status) =>
      setState((current) => ({
        ...current,
        applications: current.applications.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status,
                recruiterUpdates: [...application.recruiterUpdates, `Status updated to ${status}`],
              }
            : application,
        ),
      })),
    scheduleInterview: (details) =>
      setState((current) => {
        const interviewId = makeId("interview");
        const interview: Interview = {
          ...details,
          id: interviewId,
          status: "Scheduled",
          isSample: false,
        };
        return {
          ...current,
          interviews: [interview, ...current.interviews],
          applications: current.applications.map((application) =>
            application.id === details.applicationId
              ? {
                  ...application,
                  status: "Interview Scheduled",
                  interviewId,
                  recruiterUpdates: [...application.recruiterUpdates, `Interview scheduled for ${details.date}`],
                }
              : application,
          ),
          notifications: [
            {
              id: makeId("notice"),
              title: "Interview scheduled",
              detail: `Interview scheduled for ${details.date} at ${details.time}.`,
              createdAt: "Just now",
              read: false,
              kind: "interview",
            },
            ...current.notifications,
          ],
        };
      }),
    setInterviewStatus: (interviewId, status) =>
      setState((current) => ({
        ...current,
        interviews: current.interviews.map((interview) =>
          interview.id === interviewId ? { ...interview, status } : interview,
        ),
      })),
    markNotificationRead: (notificationId) =>
      setState((current) => ({
        ...current,
        notifications: current.notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        ),
      })),
    clearNotifications: () => setState((current) => ({ ...current, notifications: [] })),
    toggleRoadmapDay: (day) =>
      setState((current) => ({
        ...current,
        completedRoadmapDays: current.completedRoadmapDays.includes(day)
          ? current.completedRoadmapDays.filter((completed) => completed !== day)
          : [...current.completedRoadmapDays, day],
      })),
    setChatMessages: (chatMessages) => setState((current) => ({ ...current, chatMessages })),
    setResumeText: (resumeText) => setState((current) => ({ ...current, resumeText })),
    setResumeJobDescription: (resumeJobDescription) => setState((current) => ({ ...current, resumeJobDescription })),
    setMockAnswer: (index, answer) =>
      setState((current) => {
        const mockAnswers = [...current.mockAnswers];
        mockAnswers[index] = answer;
        return { ...current, mockAnswers };
      }),
    resetDemo: () => setState(createDemoState()),
  };

  return <SmartHireContext.Provider value={value}>{children}</SmartHireContext.Provider>;
}

export function useSmartHire(): SmartHireContextValue {
  const context = useContext(SmartHireContext);
  if (!context) throw new Error("useSmartHire must be used inside SmartHireProvider");
  return context;
}