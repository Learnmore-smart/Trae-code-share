import { InvitationCode, InvitationStatus, UseInvitationCodeRequest } from '../types/invitation';

// Mock database for invitation codes
const invitationCodes: Map<string, InvitationCode> = new Map();

// Generate a share URL for an invitation code
const generateShareUrl = (code: string): string => {
  return `${window.location.origin}/use/${code}`;
};

// Share an existing invitation code
export const shareExistingCode = async (code: string): Promise<InvitationCode> => {
  // Check if code already exists
  const existingCode = invitationCodes.get(code);
  if (existingCode) {
    return existingCode;
  }

  // Create new shared code entry
  const invitation: InvitationCode = {
    id: crypto.randomUUID(),
    code,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: InvitationStatus.UNUSED,
    shareUrl: generateShareUrl(code),
    metadata: {
      isCopied: false,
      copyCount: 0
    }
  };

  invitationCodes.set(code, invitation);
  return invitation;
};

// Get invitation code by code
export const getInvitationCode = async (code: string): Promise<InvitationCode | null> => {
  const invitation = invitationCodes.get(code);
  return invitation || null;
};

// Use an invitation code
export const useInvitationCode = async (request: UseInvitationCodeRequest): Promise<{ success: boolean; message: string; invitation?: InvitationCode }> => {
  const { code, userId } = request;
  const invitation = invitationCodes.get(code);

  if (!invitation) {
    return {
      success: false,
      message: 'Invalid invitation code'
    };
  }

  if (invitation.status === InvitationStatus.USED) {
    return {
      success: false,
      message: 'Invitation code already used'
    };
  }

  if (invitation.status === InvitationStatus.EXPIRED) {
    return {
      success: false,
      message: 'Invitation code has expired'
    };
  }

  // Update invitation code status
  const updatedInvitation: InvitationCode = {
    ...invitation,
    status: InvitationStatus.USED,
    usedBy: userId,
    usedAt: new Date(),
    updatedAt: new Date()
  };

  invitationCodes.set(code, updatedInvitation);

  return {
    success: true,
    message: 'Invitation code used successfully',
    invitation: updatedInvitation
  };
};

// Mark invitation code as copied
export const markAsCopied = async (code: string): Promise<InvitationCode | null> => {
  const invitation = invitationCodes.get(code);
  if (!invitation) return null;

  const updatedInvitation: InvitationCode = {
    ...invitation,
    metadata: {
      isCopied: true,
      copyCount: (invitation.metadata?.copyCount || 0) + 1,
      lastCopiedAt: new Date()
    },
    updatedAt: new Date()
  };

  invitationCodes.set(code, updatedInvitation);
  return updatedInvitation;
};

// Get all invitation codes
export const getAllInvitationCodes = async (): Promise<InvitationCode[]> => {
  return Array.from(invitationCodes.values())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};