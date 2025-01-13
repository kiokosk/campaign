import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SubmissionsList } from '@/components/brand/SubmissionsList';
import { CampaignOverview } from '@/components/brand/CampaignOverview';
import { PerformanceMetrics } from '@/components/brand/PerformanceMetrics';

export default function BrandDashboard() {
  const [statistics, setStatistics] = useState({
    totalCampaigns: 0,
    activeInfluencers: 0,
    pendingSubmissions: 0,
    totalEngagement: 0,
  });

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchStatistics = async () => {
      const response = await fetch('/api/brand/statistics');
      const data = await response.json();
      setStatistics(data);
    };

    fetchStatistics();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Brand Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Campaigns</h3>
          <p className="text-3xl font-bold">{statistics.totalCampaigns}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Influencers</h3>
          <p className="text-3xl font-bold">{statistics.activeInfluencers}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Pending Submissions</h3>
          <p className="text-3xl font-bold">{statistics.pendingSubmissions}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Engagement</h3>
          <p className="text-3xl font-bold">{statistics.totalEngagement}%</p>
        </Card>
      </div>

      <Tabs defaultValue="submissions">
        <TabsList>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions">
          <SubmissionsList />
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignOverview />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
}