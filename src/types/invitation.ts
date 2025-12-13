export interface InvitationCode {
  id: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  status: InvitationStatus;
  usedBy?: string;
  usedAt?: Date;
  shareUrl: string;
  metadata?: {
    isCopied: boolean;
    copyCount: number;
    lastCopiedAt?: Date;
  };
}

export enum InvitationStatus {
  UNUSED = 'unused',
  USED = 'used',
  EXPIRED = 'expired',
  INVALID = 'invalid'
}

export interface CreateInvitationCodeRequest {
  count?: number;
  expiresIn?: number; // in hours
}

export interface UseInvitationCodeRequest {
  code: string;
  userId: string;
}

export interface UseInvitationCodeResponse {
  success: boolean;
  message: string;
  invitation?: InvitationCode;
}