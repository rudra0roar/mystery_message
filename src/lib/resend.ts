import EmailTemplate from '@/../Emails/VerificationEmails';
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);