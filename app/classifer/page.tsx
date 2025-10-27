"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mail, LogOut, Settings, Filter, Loader2, AlertCircle } from "lucide-react"
import EmailCard from "@/components/email-card"
import CategoryFilter from "@/components/category-filter"
import ApiKeyModal from "@/components/api-key-modal"

interface Email {
  id: string
  from: string
  subject: string
  snippet: string
  category?: string
}

export default function AppPage() {
  const [emails, setEmails] = useState<Email[]>([])
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [isClassifying, setIsClassifying] = useState(false)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ email: string } | null>(null)

  const categories = [
    { id: "all", label: "All Emails", color: "bg-gray-500" },
    { id: "important", label: "Important", color: "bg-red-500" },
    { id: "promotional", label: "Promotional", color: "bg-blue-500" },
    { id: "social", label: "Social", color: "bg-green-500" },
    { id: "marketing", label: "Marketing", color: "bg-yellow-500" },
    { id: "spam", label: "Spam", color: "bg-orange-500" },
  ]

  // Check for API key on mount
  useEffect(() => {
    const apiKey = localStorage.getItem("openai_api_key")
    setHasApiKey(!!apiKey)
  }, [])

  // Filter emails by category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredEmails(emails)
    } else {
      setFilteredEmails(emails.filter((email) => email.category === selectedCategory))
    }
  }, [emails, selectedCategory])

  const handleFetchEmails = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Simulate fetching emails from Gmail API
      // In production, this would call your backend route handler
      const mockEmails: Email[] = [
        {
          id: "1",
          from: "noreply@amazon.com",
          subject: "Your order has been shipped",
          snippet: "Your order #123456 has been shipped and is on its way...",
        },
        {
          id: "2",
          from: "friend@example.com",
          subject: "Hey! How are you doing?",
          snippet: "I wanted to catch up and see how things are going with you...",
        },
        {
          id: "3",
          from: "marketing@techcompany.com",
          subject: "Limited Time Offer - 50% Off",
          snippet: "Don't miss out! Get 50% off all products this weekend only...",
        },
      ]
      setEmails(mockEmails)
    } catch (err) {
      setError("Failed to fetch emails. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClassifyEmails = async () => {
    if (!hasApiKey) {
      setShowApiKeyModal(true)
      return
    }

    setIsClassifying(true)
    setError(null)
    try {
      // Simulate classification with OpenAI
      // In production, this would call your backend route handler
      const classifiedEmails = emails.map((email) => ({
        ...email,
        category: ["important", "promotional", "social", "marketing", "spam"][Math.floor(Math.random() * 5)],
      }))
      setEmails(classifiedEmails)
    } catch (err) {
      setError("Failed to classify emails. Please check your API key.")
      console.error(err)
    } finally {
      setIsClassifying(false)
    }
  }

  const handleSaveApiKey = (apiKey: string) => {
    localStorage.setItem("openai_api_key", apiKey)
    setHasApiKey(true)
    setShowApiKeyModal(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("openai_api_key")
    localStorage.removeItem("gmail_access_token")
    setEmails([])
    setUser(null)
    setHasApiKey(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">MailSort</h1>
              <p className="text-xs text-muted-foreground">Email Classification</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-muted-foreground">{hasApiKey ? "API Key Set" : "No API Key"}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowApiKeyModal(true)} className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleFetchEmails}
            disabled={isLoading}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Fetch Emails (Last 15)
              </>
            )}
          </Button>

          <Button
            onClick={handleClassifyEmails}
            disabled={isClassifying || emails.length === 0 || !hasApiKey}
            className="gap-2 bg-cyan-600 text-white hover:bg-cyan-700"
          >
            {isClassifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Classifying...
              </>
            ) : (
              <>
                <Filter className="w-4 h-4" />
                Classify with AI
              </>
            )}
          </Button>

          {!hasApiKey && (
            <Button onClick={() => setShowApiKeyModal(true)} variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Add API Key
            </Button>
          )}
        </div>

        {/* Category Filter */}
        {emails.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            emailCounts={{
              all: emails.length,
              important: emails.filter((e) => e.category === "important").length,
              promotional: emails.filter((e) => e.category === "promotional").length,
              social: emails.filter((e) => e.category === "social").length,
              marketing: emails.filter((e) => e.category === "marketing").length,
              spam: emails.filter((e) => e.category === "spam").length,
            }}
          />
        )}

        {/* Emails Grid */}
        {filteredEmails.length > 0 ? (
          <div className="grid gap-4">
            {filteredEmails.map((email) => (
              <EmailCard
                key={email.id}
                email={email}
                categoryColor={categories.find((c) => c.id === email.category)?.color || "bg-gray-500"}
              />
            ))}
          </div>
        ) : emails.length > 0 ? (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No emails in this category</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h2 className="text-2xl font-bold mb-2">No emails yet</h2>
            <p className="text-muted-foreground mb-6">Click "Fetch Emails" to load your last 15 emails from Gmail</p>
          </div>
        )}
      </main>

      {/* API Key Modal */}
      <ApiKeyModal isOpen={showApiKeyModal} onClose={() => setShowApiKeyModal(false)} onSave={handleSaveApiKey} />
    </div>
  )
}
