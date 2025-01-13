
import { BarChart as BarChartIcon, Activity, Users, Heart, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface MetricsProps {
  metrics: {
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
}

export function CampaignMetrics({ metrics }: MetricsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Campaign Performance</h3>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChartIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Posts</p>
              <p className="text-2xl font-bold">{metrics.totalPosts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Reach</p>
              <p className="text-2xl font-bold">
                {(metrics.totalReach / 1000).toFixed(1)}K
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Engagement Rate</p>
              <p className="text-2xl font-bold">{metrics.engagementRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Engagement Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <Heart className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Average Likes</p>
              <p className="text-xl font-semibold">
                {(metrics.averageLikes / 1000).toFixed(1)}K
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Share2 className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Average Shares</p>
              <p className="text-xl font-semibold">
                {(metrics.averageShares / 1000).toFixed(1)}K
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Timeline */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Daily Performance</h4>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.performanceByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [value, name === 'posts' ? 'Posts' : 'Engagement']}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="posts"
                stroke="#2563eb"
                name="Posts"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="engagement"
                stroke="#16a34a"
                name="Engagement"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}




