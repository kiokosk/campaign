
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
// import { toast } from '@/components/ui/use-toast';

const submissionSchema = z.object({
  contentUrl: z.string().url('Please enter a valid URL'),
  caption: z.string().min(10, 'Caption must be at least 10 characters'),
  tags: z.string().optional(),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

interface SubmissionFormProps {
  campaignId: string;
}

export function SubmissionForm({ campaignId }: SubmissionFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      contentUrl: '',
      caption: '',
      tags: '',
    },
  });

  const onSubmit = async (data: SubmissionFormData) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId,
          ...data,
          tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit content');
      }

      toast({
        title: 'Success!',
        description: 'Your content has been submitted for review.',
      });
      form.reset();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="contentUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption</FormLabel>
              <FormControl>
                <textarea 
                  className="min-h-[100px] w-full p-3 rounded-md border"
                  placeholder="Write your caption here..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="#campaign, #brand" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Content'}
        </Button>
      </form>
    </Form>
  );
}

