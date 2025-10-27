"use client"

import { Mail, Tag } from "lucide-react"

interface EmailCardProps {
  email: {
    id: string
    from: string
    subject: string
    snippet: string
    category?: string
  }
  categoryColor: string
}

export default function EmailCard({ email, categoryColor }: EmailCardProps) {
  const getCategoryLabel = (category?: string) => {
    const labels: Record<string, string> = {
      important: "Important",
      promotional: "Promotional",
      social: "Social",
      marketing: "Marketing",
      spam: "Spam",
    }
    return labels[category || ""] || "Uncategorized"
  }

  return (
    <div className="group p-4 rounded-lg border border-border hover:border-primary/50 bg-card hover:bg-card/80 transition-all duration-200 cursor-pointer">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
          <Mail className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{email.from}</p>
              <p className="text-sm text-muted-foreground truncate">{email.subject}</p>
            </div>
            {email.category && (
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white flex-shrink-0 ${categoryColor}`}
              >
                <Tag className="w-3 h-3" />
                {getCategoryLabel(email.category)}
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{email.snippet}</p>
        </div>
      </div>
    </div>
  )
}
