import { Campaign } from '@/types/campaign';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import Image from 'next/image';

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const daysLeft = formatDistance(
    new Date(campaign.timeline.submissionDeadline),
    new Date(),
    { addSuffix: true }
  );

  const statusColors = {
    ACTIVE: 'bg-green-500',
    PAUSED: 'bg-yellow-500',
    COMPLETED: 'bg-blue-500',
    DRAFT: 'bg-gray-500',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="relative pb-0">
        <div className="absolute top-4 right-4 z-10">
          <Badge className={statusColors[campaign.status]}>
            {campaign.status}
          </Badge>
        </div>
        <div className="relative h-40 rounded-t-lg overflow-hidden">
          <Image
            src={campaign.brand.logo}
            alt={campaign.brand.name}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-semibold">{campaign.title}</h3>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {campaign.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Budget</p>
            <p className="font-semibold">
              {campaign.budget.currency} {campaign.budget.perPost}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Platform</p>
            <p className="font-semibold">{campaign.requirements.platform}</p>
          </div>
          <div>
            <p className="text-gray-500">Deadline</p>
            <p className="font-semibold">{daysLeft}</p>
          </div>
          <div>
            <p className="text-gray-500">Min. Followers</p>
            <p className="font-semibold">
              {campaign.requirements.minimumFollowers.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );
}