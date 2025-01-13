export interface Campaign {
    id: string;
    title: string;
    description: string;
    brand: {
      name: string;
      logo: string;
    };
    requirements: {
      platform: SocialPlatform;
      minimumFollowers: number;
      contentType: ContentType[];
      //
      preferredNiches: string[];
    mustHave: string[];
    restrictions: string[];
    guidelines: string[];
    deliverables: {
      type: string;
      count: number;
      description: string;
    }[];

    };
    budget: {
      total: number;
      perPost: number;
      currency: string;
    };
    timeline: {
      startDate: Date;
      endDate: Date;
      submissionDeadline: Date;
    };
    status: CampaignStatus;
    metrics: {
      totalInfluencers: number;
      totalSubmissions: number;
      averageEngagement: number;
      //
      totalPosts: number;
    totalReach: number;
    totalEngagements: number;
    engagementRate: number;
    averageLikes: number;
    averageShares: number;
    performanceByDay: {
      date: string;
      posts: number;
      engagement: number;
    }[];
    };
    tags: string[];
  }
  
  export type SocialPlatform = 'TIKTOK' | 'INSTAGRAM' | 'YOUTUBE' | 'TWITTER';
  export type ContentType = 'VIDEO' | 'IMAGE' | 'STORY' | 'REEL';
  export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  
  export interface CampaignFilters {
    platform?: SocialPlatform;
    minBudget?: number;
    maxBudget?: number;
    status?: CampaignStatus;
    contentType?: ContentType;
    search?: string;
  }