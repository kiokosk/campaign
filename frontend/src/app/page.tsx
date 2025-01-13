'use client';

import { useParams } from 'next/navigation';
import { SubmissionForm } from '@/components/campaigns/SubmissionForm';
import { CampaignRequirements } from '@/components/campaigns/CampaignRequirements';
import { CampaignMetrics } from '@/components/campaigns/CampaignMetrics';

export default function CampaignDetailsPage() {
  const params = useParams();
  const campaignId = typeof params?.id === 'string' ? params.id : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Title */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Campaign Details</h1>
        <p className="mt-2 text-sm text-gray-600">
          Review the campaign instructions and upload your submissions below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column - Campaign Details */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
            <CampaignRequirements
              requirements={{
                contentType: [],
                minimumFollowers: 0,
                preferredNiches: [],
                mustHave: [],
                restrictions: [],
                guidelines: [],
                deliverables: []
              }}
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Metrics</h2>
            <CampaignMetrics
              metrics={{
                totalPosts: 0,
                totalReach: 0,
                totalEngagements: 0,
                engagementRate: 0,
                averageLikes: 0,
                averageShares: 0,
                performanceByDay: []
              }}
            />
          </div>
        </div>

        {/* Right Column - Submission Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Your Content</h2>
          <SubmissionForm campaignId={campaignId} />
        </div>
      </div>

      {/* Campaign Status Indicator */}
      <div className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Submission Status</span>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          Pending Review
        </span>
      </div>
    </div>
  );
}
