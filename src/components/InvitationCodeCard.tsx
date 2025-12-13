import React from 'react';
import { InvitationCode, InvitationStatus } from '../types/invitation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Copy } from 'lucide-react';

interface InvitationCodeCardProps {
  invitation: InvitationCode;
  onCopy: (code: string) => void;
}

const getStatusConfig = (status: InvitationStatus) => {
  const configs = {
    [InvitationStatus.UNUSED]: {
      variant: 'default' as const,
      text: 'Unused'
    },
    [InvitationStatus.USED]: {
      variant: 'outline' as const,
      text: 'Used'
    },
    [InvitationStatus.EXPIRED]: {
      variant: 'destructive' as const,
      text: 'Expired'
    },
    [InvitationStatus.INVALID]: {
      variant: 'secondary' as const,
      text: 'Invalid'
    }
  };
  return configs[status] || configs[InvitationStatus.INVALID];
};

export const InvitationCodeCard: React.FC<InvitationCodeCardProps> = ({ invitation, onCopy }) => {
  const statusConfig = getStatusConfig(invitation.status);

  const handleCopy = () => {
    onCopy(invitation.code);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg md:text-xl font-bold font-mono tracking-wider break-all">
              {invitation.code}
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Shared on {new Date(invitation.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge 
            variant={statusConfig.variant} 
            className="px-3 py-1 text-xs font-medium"
          >
            {statusConfig.text}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4 pt-3">
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
          {invitation.metadata?.copyCount && (
            <div className="flex items-center gap-1.5">
              <Copy className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <span>{invitation.metadata.copyCount} {invitation.metadata.copyCount === 1 ? 'copy' : 'copies'}</span>
            </div>
          )}
          {invitation.usedAt && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 dark:text-slate-500">Used:</span>
              <span>{new Date(invitation.usedAt).toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="default"
          size="sm"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={handleCopy}
          disabled={invitation.status !== InvitationStatus.UNUSED}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Copy className="h-4 w-4" />
            Copy Code
          </div>
        </Button>
      </CardFooter>
    </Card>
  );
};