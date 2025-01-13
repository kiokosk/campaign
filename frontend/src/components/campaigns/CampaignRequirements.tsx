import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RequirementsProps {
  requirements: {
    contentType: string[];
    minimumFollowers: number;
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
}

export function CampaignRequirements({ requirements }: RequirementsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Eligibility Requirements */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Eligibility
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Minimum Followers</p>
              <p className="font-semibold">
                {(requirements.minimumFollowers / 1000).toFixed(1)}K
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Content Types</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {requirements.contentType.map((type) => (
                  <Badge key={type} variant="secondary">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Preferred Niches</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {requirements.preferredNiches.map((niche) => (
                  <Badge key={niche} variant="outline">
                    {niche}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Deliverables */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Required Deliverables
          </h3>
          <div className="space-y-4">
            {requirements.deliverables.map((deliverable, index) => (
              <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{deliverable.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {deliverable.description}
                    </p>
                  </div>
                  <Badge>{deliverable.count}x</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Guidelines and Restrictions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          Guidelines & Restrictions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Must Have</h4>
            <ul className="space-y-2">
              {requirements.mustHave.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Restrictions</h4>
            <ul className="space-y-2">
              {requirements.restrictions.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}


