import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { useInvitationCode } from '../services/invitationService';

interface UseInvitationCodeProps {
  code: string;
}

export const UseInvitationCode: React.FC<UseInvitationCodeProps> = ({ code }) => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUseCode = async () => {
    if (!userId.trim()) {
      toast.error('Please enter a user ID');
      return;
    }

    setLoading(true);
    try {
      const result = await useInvitationCode({ code, userId: userId.trim() });
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Failed to use code:', error);
      toast.error('Failed to use invitation code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-2xl font-bold text-center">Use Invitation Code</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-5">
            <div>
              <Label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Invitation Code
              </Label>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md font-mono text-center text-lg tracking-wider border border-slate-200 dark:border-slate-700">
                {code}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userId" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Your User ID
              </Label>
              <Input
                id="userId"
                type="text"
                placeholder="Enter your user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={loading}
                className="text-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <Button
              onClick={handleUseCode}
              size="lg"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Use Invitation Code'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};