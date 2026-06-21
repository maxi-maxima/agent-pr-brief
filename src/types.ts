export type RiskLevel = "low" | "medium" | "high";
export type AssessmentStatus = "pass" | "review" | "block";

export interface FileChange {
  path: string;
  oldPath?: string;
  added: number;
  removed: number;
  hunks: number;
  isDeleted: boolean;
  isRenamed: boolean;
  risk: RiskLevel;
  reasons: string[];
}

export interface ReviewBrief {
  title: string;
  files: FileChange[];
  totals: {
    files: number;
    added: number;
    removed: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
  };
  assessment: {
    status: AssessmentStatus;
    reason: string;
  };
  reviewOrder: FileChange[];
  questions: string[];
}
