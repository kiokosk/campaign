import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Campaign } from '@/types/campaign';
import  {SubmissionForm}  from '@/components/campaigns/SubmissionForm';
import { CampaignMetrics } from '@/components/campaigns/CampaignMetrics';
import { CampaignRequirements } from '@/components/campaigns/CampaignRequirements';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Image from 'next/image';

export default function CampaignDetails() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`/api/campaigns/${id}`);
        const data = await response.json();
        setCampaign(data);
      } catch (error) {
        console.error('Failed to fetch campaign:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Campaign Info */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src={campaign.brand.logo}
                      alt={campaign.brand.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="font-medium">{campaign.brand.name}</span>
                  </div>
                  <Badge>{campaign.status}</Badge>
                </div>
              </div>
              {session?.user?.role === 'INFLUENCER' && (
                <Button size="lg">Apply Now</Button>
              )}
            </div>

            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="submit">Submit Content</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="prose max-w-none">
                  <h2>Campaign Description</h2>
                  <p>{campaign.description}</p>
                  <CampaignMetrics metrics={campaign.metrics} />
                </div>
              </TabsContent>

              <TabsContent value="requirements">
                <CampaignRequirements requirements={campaign.requirements} />
              </TabsContent>

              <TabsContent value="submit">
                <SubmissionForm campaignId={campaign.id} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Right Column - Campaign Stats */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Campaign Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Budget per Post</p>
                <p className="font-semibold">
                  {campaign.budget.currency} {campaign.budget.perPost}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Timeline</p>
                <p className="font-semibold">
                  {format(new Date(campaign.timeline.startDate), 'MMM d, yyyy')} - 
                  {format(new Date(campaign.timeline.endDate), 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submission Deadline</p>
                <p className="font-semibold">
                  {format(new Date(campaign.timeline.submissionDeadline), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Campaign Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Influencers</span>
                <span className="font-semibold">{campaign.metrics.totalInfluencers}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Submissions</span>
                <span className="font-semibold">{campaign.metrics.totalSubmissions}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg. Engagement</span>
                <span className="font-semibold">{campaign.metrics.averageEngagement}%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}