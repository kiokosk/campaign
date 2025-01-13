import { ContentType, SocialPlatform } from "./campaign";

export interface Submission {
  id: string;
  campaignId: string;
  influencerId: string;
  content: {
    platform: SocialPlatform;
    type: ContentType;
    url: string;
    thumbnailUrl?: string;
  };
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagement: number;
  };
  status: SubmissionStatus;
  feedback?: string;
  submittedAt: Date;
  reviewedAt?: Date;
}

export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';
