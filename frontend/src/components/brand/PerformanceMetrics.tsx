import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Campaign, SocialPlatform } from '@/types/campaign';
import { Submission } from '@/types/submission';

interface PlatformMetrics {
  platform: SocialPlatform;
  submissions: number;
  engagement: number;
  reach: number;
}

interface AggregatedMetrics {
  totalReach: number;
  totalEngagements: number;
  engagementRate: number;
  averageLikes: number;
  averageShares: number;
  platformPerformance: PlatformMetrics[];
}

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculatePlatformPerformance = useCallback((submissions: Submission[]): PlatformMetrics[] => {
    const platformData = submissions.reduce<Record<SocialPlatform, PlatformMetrics>>((acc, submission) => {
      const platform = submission.content.platform;
      if (!acc[platform]) {
        acc[platform] = {
          platform,
          submissions: 0,
          engagement: 0,
          reach: 0
        };
      }
      acc[platform].submissions++;
      acc[platform].engagement += submission.metrics.engagement;
      acc[platform].reach += submission.metrics.views;
      return acc;
    }, {} as Record<SocialPlatform, PlatformMetrics>);

    return Object.values(platformData);
  }, []);

  const calculateAggregatedMetrics = useCallback((campaigns: Campaign[], submissions: Submission[]): AggregatedMetrics => {
    return {
      totalReach: campaigns.reduce((acc, curr) => acc + curr.metrics.totalReach, 0),
      totalEngagements: campaigns.reduce((acc, curr) => acc + curr.metrics.totalEngagements, 0),
      engagementRate: campaigns.reduce((acc, curr) => acc + curr.metrics.engagementRate, 0) / campaigns.length,
      averageLikes: campaigns.reduce((acc, curr) => acc + curr.metrics.averageLikes, 0) / campaigns.length,
      averageShares: campaigns.reduce((acc, curr) => acc + curr.metrics.averageShares, 0) / campaigns.length,
      platformPerformance: calculatePlatformPerformance(submissions)
    };
  }, [calculatePlatformPerformance]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [campaignsRes, submissionsRes] = await Promise.all([
          fetch('/api/brand/campaigns'),
          fetch('/api/brand/submissions')
        ]);

        if (!campaignsRes.ok || !submissionsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const campaignsData: Campaign[] = await campaignsRes.json();
        const submissionsData: Submission[] = await submissionsRes.json();

       
        const aggregatedMetrics = calculateAggregatedMetrics(campaignsData, submissionsData);
        setMetrics(aggregatedMetrics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [calculateAggregatedMetrics]);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading performance data...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{metrics?.totalReach.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Reach</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{metrics?.engagementRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Engagement Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{metrics?.averageLikes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Average Likes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{metrics?.averageShares.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Average Shares</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics?.platformPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="submissions" fill="#2563eb" name="Submissions" />
                <Bar dataKey="engagement" fill="#16a34a" name="Engagement" />
                <Bar dataKey="reach" fill="#eab308" name="Reach" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}