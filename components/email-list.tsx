'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useEmails } from '@/contexts/email-context';
import { RefreshCw, Mail, Inbox, Archive, Tag, Clock } from 'lucide-react';
import { Button } from './ui/button';

export function EmailList() {
  const { emails, loading, error, refreshEmails, categorizeEmail } = useEmails();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshEmails();
    } catch (error) {
      console.error('Error refreshing emails:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCategorize = (emailId: string, category: string) => {
    try {
      categorizeEmail(emailId, category);
      // Here you would typically call an API to update the email's category
    } catch (error) {
      console.error('Error categorizing email:', error);
    }
  };

  if (loading && emails.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error loading emails: {error}</p>
        <Button variant="outline" onClick={() => refreshEmails()} className="mt-2">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Inbox className="w-12 h-12 mb-4" />
        <p>No emails found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Emails</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      <div className="space-y-2">
        {emails.map((email) => (
          <div
            key={email.id}
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{email.subject || 'No Subject'}</h3>
                <p className="text-sm text-muted-foreground">
                  From: {email.from}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {email.snippet}
                </p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(email.date).toLocaleString()}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCategorize(email.id, 'important')}
                  className={`${email.category === 'important' ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                  <Tag className="w-4 h-4 mr-1 text-blue-500" />
                  Important
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCategorize(email.id, 'archive')}
                  className={`${email.category === 'archive' ? 'bg-gray-100' : ''}`}
                >
                  <Archive className="w-4 h-4 mr-1" />
                  Archive
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
