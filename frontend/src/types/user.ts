import { SocialPlatform } from "./campaign";

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    socialProfiles: SocialProfile[];
    verified: boolean;
    createdAt: Date;
  }
  
  export interface SocialProfile {
    platform: SocialPlatform;
    handle: string;
    url: string;
    followers: number;
    verified: boolean;
  }
  
  export type UserRole = 'ADMIN' | 'BRAND' | 'INFLUENCER';