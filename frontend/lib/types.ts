export type LanguageCode = 'en' | 'hi' | string;

export interface SourceItem {
  id: string;
  domain: string;
  credibility: number; // 0-100
  snippet: string;
  url: string;
  isOpenSource?: boolean;
}

export interface Verdict {
  score: number; // 0-100
  label: string;
  justification: string;
  sources: SourceItem[];
}

export interface Claim {
  claim_id: string;
  text: string;
  lang?: LanguageCode;
  timestamp: string; // ISO UTC
  status: 'pending' | 'done';
  verdict?: Verdict;
  role: 'user' | 'system';
}

export interface SubmitClaimRequest {
  text: string;
  lang?: LanguageCode;
}

export interface SubmitClaimResponse {
  claim_id: string;
  status: 'pending' | 'done';
  verdict?: Verdict;
  timestamp: string;
}

export type FeedbackType = 'upvote' | 'downvote' | 'report';

export interface FeedbackRequest {
  claim_id: string;
  feedback_type: FeedbackType;
  comment?: string;
}


