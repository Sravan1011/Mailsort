'use client';

import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Zap, Shield, Brain, Loader2, User, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context";
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const { user, signInWithGoogle, signOut, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const getUserInitials = (name?: string, email?: string) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase();
    if (email) return email[0].toUpperCase();
    return <User className="h-4 w-4" />;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <Link href="/" className="font-bold text-lg hover:opacity-80 transition-opacity">MailSort</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/classifer">
                <Button 
                  variant="outline"
                  className="border-border hover:bg-muted"
                  disabled={!user && !loading}
                >
                  Start Building
                </Button>
              </Link>
              
              {loading ? (
                <Button variant="ghost" size="icon" disabled>
                  <Loader2 className="w-5 h-5 animate-spin" />
                </Button>
              ) : user ? (
                <div className="relative" ref={dropdownRef}>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-1 h-10 px-3"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      {getUserInitials(user.user_metadata?.name, user.email)}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-popover border border-border overflow-hidden z-50">
                      <div className="p-4 border-b border-border">
                        <p className="text-sm font-medium">
                          {user.user_metadata?.name || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  variant="default"
                  onClick={signInWithGoogle}
                  className="gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="currentColor"
                    />
                  </svg>
                  Sign In with Google
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <span className="text-sm font-medium text-blue-400">AI Email Classification</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-balance">
            Intelligent Email{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Classification
            </span>{" "}
            at Scale
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Harness the power of Google OAuth, Gmail API, and OpenAI GPT-4o to automatically categorize emails into
            important, promotional, social, marketing, and spam—all in your browser.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/classifer">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                Launch App <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-border hover:bg-muted bg-transparent">
              View Documentation
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl rounded-3xl"></div>
            <div className="relative bg-card border border-border rounded-2xl p-8 overflow-hidden">
              <div className="grid grid-cols-5 gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-2 bg-muted rounded-full"></div>
                ))}
              </div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                      <div className="h-2 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Core Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build a production-ready email classification system
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-xl border border-border hover:border-blue-500/50 transition-all duration-300 hover:bg-blue-500/5">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Google OAuth</h3>
              <p className="text-muted-foreground">
                Secure authentication with Google. Users log in with their existing Google account to access Gmail data
                safely.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-xl border border-border hover:border-cyan-500/50 transition-all duration-300 hover:bg-cyan-500/5">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                <Mail className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Gmail Integration</h3>
              <p className="text-muted-foreground">
                Fetch up to 15 emails directly from Gmail API. 
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-xl border border-border hover:border-purple-500/50 transition-all duration-300 hover:bg-purple-500/5">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Classification</h3>
              <p className="text-muted-foreground">
                Leverage Gemini Pro to intelligently categorize emails into 5 categories: Important, Promotional,
                Social, Marketing, and Spam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-center">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Authenticate", desc: "Sign in with Google OAuth" },
              { step: 2, title: "Configure", desc: "Add your Gemini API key" },
              { step: 3, title: "Fetch", desc: "Load your last 15 emails" },
              { step: 4, title: "Classify", desc: "AI categorizes in real-time" },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 text-white font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-7 -right-3 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Classify?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Classify your emails with our AI-powered system.
          </p>
          <Link href="/app">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              Start the Classification <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">MailSort</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 MagicSlides.</p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                GitHub
              </a>
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
