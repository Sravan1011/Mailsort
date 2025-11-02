import { createClient } from './supabase/client';

type Email = {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
    parts?: Array<{
      mimeType: string;
      body: {
        data?: string;
        size: number;
      };
      parts?: any[];
    }>;
    body: {
      data?: string;
      size: number;
    };
  };
  internalDate: string;
  category?: string;
};

export type ParsedEmail = {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  labels: string[];
  isRead: boolean;
  category?: string;
};

const EMAIL_STORAGE_KEY = 'gmail_emails';
const EMAIL_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface CachedEmails {
  emails: ParsedEmail[];
  timestamp: number;
}

function getCachedEmails(): CachedEmails | null {
  if (typeof window === 'undefined') return null;
  
  const cached = localStorage.getItem(EMAIL_STORAGE_KEY);
  if (!cached) return null;

  try {
    const { emails, timestamp } = JSON.parse(cached);
    // Check if cache is still valid
    if (Date.now() - timestamp < EMAIL_EXPIRY) {
      return { emails, timestamp };
    }
  } catch (error) {
    console.error('Error parsing cached emails:', error);
  }
  
  return null;
}

function cacheEmails(emails: ParsedEmail[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(
      EMAIL_STORAGE_KEY,
      JSON.stringify({
        emails,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error('Error caching emails:', error);
  }
}

export async function getGmailClient() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.provider_token) {
    throw new Error('No active session or access token found');
  }

  return {
    getAccessToken: () => session.provider_token as string,
    getAuthHeader: () => ({
      'Authorization': `Bearer ${session.provider_token}`,
      'Content-Type': 'application/json',
    }),
  };
}

export async function fetchEmails(maxResults = 15) {
  try {
    const gmail = await getGmailClient();
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`,
      {
        headers: gmail.getAuthHeader(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to fetch emails');
    }

    const { messages } = await response.json();
    if (!messages || messages.length === 0) return [];

    // Fetch full details for each email
    const emailPromises = messages.map(async (message: { id: string }) => {
      const emailResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
        {
          headers: gmail.getAuthHeader(),
        }
      );
      return emailResponse.json();
    });

    return await Promise.all(emailPromises);
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}

export function parseEmailData(email: Email): ParsedEmail {
  const headers = email.payload.headers || [];
  const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
  const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
  const to = headers.find(h => h.name === 'To')?.value || '';
  const date = headers.find(h => h.name === 'Date')?.value || new Date().toISOString();
  
  return {
    id: email.id,
    threadId: email.threadId,
    subject,
    from,
    to,
    date: new Date(date).toLocaleString(),
    snippet: email.snippet,
    labels: email.labelIds || [],
    isRead: !email.labelIds?.includes('UNREAD'),
  };
}

export async function fetchAndParseEmails(maxResults = 15): Promise<ParsedEmail[]> {
  // Check cache first
  const cached = getCachedEmails();
  if (cached) {
    return cached.emails;
  }

  try {
    const emails = await fetchEmails(maxResults);
    const parsedEmails = emails.map(parseEmailData);
    
    // Cache the parsed emails
    cacheEmails(parsedEmails);
    
    return parsedEmails;
  } catch (error) {
    console.error('Error fetching and parsing emails:', error);
    
    // Return cached data even if it's expired when there's an error
    const expiredCache = getCachedEmails();
    if (expiredCache) {
      console.log('Using expired cache due to error');
      return expiredCache.emails;
    }
    
    throw error;
  }
}

export function updateCachedEmail(emailId: string, updates: Partial<ParsedEmail>): void {
  const cached = getCachedEmails();
  if (!cached) return;

  const updatedEmails = cached.emails.map(email => 
    email.id === emailId ? { ...email, ...updates } : email
  );
  
  cacheEmails(updatedEmails);
}
