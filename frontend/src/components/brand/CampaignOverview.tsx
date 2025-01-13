import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Campaign, CampaignStatus } from '@/types/campaign';
import { Badge } from "@/components/ui/badge";

export function CampaignOverview() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/brand/campaigns');
        
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }

        const data = await response.json();
        setCampaigns(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const getStatusColor = (status: CampaignStatus) => {
    const colors = {
      DRAFT: 'bg-gray-500',
      ACTIVE: 'bg-green-500',
      PAUSED: 'bg-yellow-500',
      COMPLETED: 'bg-blue-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading campaigns...</div>;
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
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{campaign.title}</h4>
                        <Badge variant="secondary" className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {campaign.metrics.totalInfluencers} influencers • 
                        {campaign.metrics.totalSubmissions} submissions
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Budget: {campaign.budget.currency} {campaign.budget.total}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {campaigns.length > 0 && (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={campaigns[0].metrics.performanceByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="posts" 
                      stroke="#2563eb" 
                      name="Posts"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="engagement" 
                      stroke="#16a34a" 
                      name="Engagement"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}