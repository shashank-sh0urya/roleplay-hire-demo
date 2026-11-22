import { describe, expect, it } from "vitest";

import { demoJobs, demoProfile, getMatchResult } from "@/lib/smart-hire-data";

describe("job skill matching", () => {
  it("scores the exact required-skill overlap instead of a random percentage", () => {
    const job = demoJobs[0];
    if (!job) throw new Error("Expected the first demo job to be available");

    const result = getMatchResult(job, {
      ...demoProfile,
      skills: ["python", "Django", "Git"],
    });

    expect(result.matchedSkills).toEqual(["Python", "Django"]);
    expect(result.missingSkills).toEqual(["PostgreSQL", "REST APIs"]);
    expect(result.percentage).toBe(50);
  });

  it("returns zero when a job has no required skills", () => {
    const job = demoJobs[0];
    if (!job) throw new Error("Expected the first demo job to be available");
    const result = getMatchResult({ ...job, skills: [] }, demoProfile);

    expect(result.percentage).toBe(0);
    expect(result.matchedSkills).toEqual([]);
    expect(result.missingSkills).toEqual([]);
  });
});