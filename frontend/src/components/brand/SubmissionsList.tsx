import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { Submission } from '@/types/submission';
// import { toast } from '@/components/ui/use-toast';
import Image from "next/image";
import { toast } from '@/hooks/use-toast';
import { formatDistance } from 'date-fns';


export function SubmissionsList() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions/pending');
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmissionUpdate = async (submissionId: string, status: 'APPROVED' | 'REJECTED', feedback?: string) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, feedback }),
      });

      if (!response.ok) throw new Error('Failed to update submission');

      toast({
        title: 'Success',
        description: `Submission ${status.toLowerCase()} successfully`,
      });

      fetchSubmissions();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update submission',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading submissions...</div>;
  }

  return (
    <div className="space-y-6">
      {submissions.map((submission) => (
        <Card key={submission.id} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Submission Info */}
            <div className="md:col-span-2">
              <div className="flex items-start space-x-4">
                <div className="relative h-20 w-20">
                  <Image
                    src={submission.content.thumbnailUrl || '/placeholder.png'}
                    alt="Content thumbnail"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {submission.content.platform} Content
                  </h3>
                  <p className="text-sm text-gray-500">
                    Submitted {formatDistance(new Date(submission.submittedAt), new Date(), { addSuffix: true })}
                  </p>
                  <a
                    href={submission.content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View Content
                  </a>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Metrics</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Views</p>
                  <p className="font-semibold">{submission.metrics.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Likes</p>
                  <p className="font-semibold">{submission.metrics.likes.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Comments</p>
                  <p className="font-semibold">{submission.metrics.comments.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Engagement</p>
                  <p className="font-semibold">{submission.metrics.engagement}%</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-center space-y-2">
              <Button
                onClick={() => handleSubmissionUpdate(submission.id, 'APPROVED')}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Approve
              </Button>
              <Button
                onClick={() => {
                  const feedback = window.prompt('Enter rejection feedback:');
                  if (feedback) {
                    handleSubmissionUpdate(submission.id, 'REJECTED', feedback);
                  }
                }}
                variant="destructive"
                className="w-full"
              >
                Reject
              </Button>
              {/* <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const feedback = window.prompt('Enter revision feedback:');
                  if (feedback) {
                    handleSubmissionUpdate(submission.id, 'REVISION_REQUESTED', feedback);
                  }
                }}
              >
                Request Revision
              </Button> */}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}