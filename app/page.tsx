
// import { AuthForm } from '@/components/auth/auth-form'

// export default function AuthPage() {
//   return (
    
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
//       <AuthForm />
//     </div>
//   )
// }


"use client";

import React, { useState, useEffect } from 'react';
import {
  Sparkles, Zap, FileText, Globe, CheckCircle, ArrowRight, Menu, X,
  Shield, BarChart3, Download, Upload, Settings, Layout, Languages,
  Users, Clock, Star, ChevronDown, ChevronRight,
  PenTool, Search, Rocket, Play, Quote
} from 'lucide-react';
import Link from 'next/link';

// ----------------------------------------------------------------------------
// Footer types (fixes the union-type error when accessing .href / .a)
// ----------------------------------------------------------------------------
type FooterLink = { l: string; href?: string; a?: () => void };
type FooterColumn = { title: string; links: FooterLink[] };

export default function BlogGeneratorLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate workflow steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const workflowSteps = [
    {
      icon: PenTool,
      title: "Describe Your Vision",
      short: "Brief",
      desc: "Set your topic, target keywords, word count, tone, language, and reference images. Fine-tune every parameter to match your brand voice.",
      bullets: ["25+ language support", "Custom tone & style", "Keyword targeting", "Image references"]
    },
    {
      icon: Sparkles,
      title: "AI Crafts Your Blog",
      short: "Generate",
      desc: "Our AI-powered engine reads your entire brief and generates a research-backed, SEO-optimized blog post in under 30 seconds.",
      bullets: ["Gemini powered", "Research-backed", "Structured output", "Real-time generation"]
    },
    {
      icon: BarChart3,
      title: "Review Your SEO Score",
      short: "Analyze",
      desc: "Every blog gets an instant SEO score with actionable insights. Optimize readability, keyword density, and structure before publishing.",
      bullets: ["Instant SEO score", "Keyword analysis", "Readability check", "Actionable tips"]
    },
    {
      icon: Rocket,
      title: "Edit, Export & Publish",
      short: "Publish",
      desc: "Fine-tune in our rich editor, download as Markdown/HTML/PDF, or publish directly to your favorite platforms with one click.",
      bullets: ["Rich text editor", "Multi-format export", "One-click publish", "Version history"]
    }
  ];

  const faqs = [
    {
      q: "How does BlogForge actually generate blogs?",
      a: "You provide a detailed brief — topic, keywords, word count, tone, language, and image preferences. Our backend sends this to Google's Gemini models, which craft a complete, structured blog post. The result is stored securely in your Supabase account and appears in your dashboard ready to edit or publish."
    },
    {
      q: "Is the content really 100% original?",
      a: "Yes. Every generation is unique and plagiarism-checked. We don't recycle content across users. You own the full rights to everything you generate on your plan."
    },
    {
      q: "Do I need a credit card to start?",
      a: "No. The Starter plan is free forever with 5 blog posts per month. You can upgrade anytime from your dashboard when you need more."
    },
    {
      q: "Can I edit or download the generated blogs?",
      a: "Absolutely. Every blog is fully editable in our rich text editor. You can also download it as Markdown, HTML, or PDF, and publish directly to WordPress, Medium, and other supported platforms."
    },
    {
      q: "How does the SEO score work?",
      a: "Each blog is analyzed across 20+ signals — keyword density, readability, structure, meta tags, and more. You get a score from 0-100 with specific suggestions to improve it before publishing."
    },
    {
      q: "What happens to my data and account security?",
      a: "We use Supabase Auth with email verification for secure signups. Your data is isolated per-user with row-level security. Only you can access your blogs."
    }
  ];

  // --------------------------------------------------------------------------
  // Footer columns — typed so TypeScript allows optional .href / .a on each link
  // --------------------------------------------------------------------------
  const footerColumns: FooterColumn[] = [
    {
      title: "Product",
      links: [
        { l: "Features", a: () => scrollToSection("features") },
        { l: "How it Works", a: () => scrollToSection("workflow") },
        { l: "FAQ", a: () => scrollToSection("faq") },
      ],
    },
    {
      title: "Company",
      links: [
        { l: "About" },
        { l: "Blog" },
        { l: "Careers" },
        { l: "Contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { l: "Privacy" },
        { l: "Terms" },
        { l: "Security" },
        { l: "DPA" },
      ],
    },
    {
      title: "Account",
      links: [
        { l: "Sign In", href: "/login" },
        { l: "Sign Up", href: "/login" },
        { l: "Dashboard", href: "/dashboard" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0612] text-white selection:bg-purple-500/30 overflow-x-hidden">

      {/* Ambient gradient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a0612]/85 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-purple-400 group-hover:rotate-12 transition-transform" />
                <div className="absolute inset-0 blur-lg bg-purple-500/50 group-hover:bg-purple-400/60 transition-colors" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                BlogForge
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <button onClick={() => scrollToSection('features')} className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Features</button>
              <button onClick={() => scrollToSection('workflow')} className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">How it Works</button>
              <button onClick={() => scrollToSection('faq')} className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">FAQ</button>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login" className="px-5 py-2 text-sm text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/login">
                <button className="relative px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-600/30 group">
                  <span className="flex items-center gap-1.5">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              </Link>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="px-4 pb-4 space-y-1 bg-[#0a0612]/95 backdrop-blur-xl border-b border-white/5">
            <button onClick={() => scrollToSection('features')} className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Features</button>
            <button onClick={() => scrollToSection('workflow')} className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">How it Works</button>
            <button onClick={() => scrollToSection('faq')} className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">FAQ</button>
            <div className="pt-3 flex gap-2">
              <Link href="/login" className="flex-1">
                <button className="w-full px-4 py-2.5 rounded-lg border border-white/10 text-sm font-semibold hover:bg-white/5 transition-colors">Sign In</button>
              </Link>
              <Link href="/login" className="flex-1">
                <button className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-semibold">Get Started</button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Asymmetric */}
      <section id="home" className="pt-32 lg:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-purple-500/10 rounded-full border border-purple-500/20">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-xs font-medium text-purple-300">Powered by Gemini · 25+ Languages</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-bold mb-6 leading-[1.05] tracking-tight">
                Write blogs that
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                  rank, convert & scale.
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-gray-400 mb-8 max-w-xl leading-relaxed">
                BlogForge turns a simple brief into a fully-researched, SEO-scored blog post in under 30 seconds. Built for founders, marketers, and content teams who ship fast.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/login">
                  <button className="group w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-xl shadow-purple-600/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
                    Start Creating Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <button
                  onClick={() => scrollToSection('workflow')}
                  className="group w-full sm:w-auto px-7 py-3.5 rounded-xl border border-white/15 hover:border-white/30 hover:bg-white/5 font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                  See How It Works
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>No credit card needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>5 free posts / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Right: Product Preview Mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a0f2e]/90 to-[#0f0819]/90 backdrop-blur-xl overflow-hidden shadow-2xl">
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/20">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <div className="ml-3 flex-1 px-3 py-1 rounded-md bg-white/5 text-xs text-gray-500 truncate">
                    app.blogforge.io/create
                  </div>
                </div>

                {/* Mock dashboard */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Create New Blog</div>
                      <div className="text-sm font-semibold">AI-Powered Generator</div>
                    </div>
                    <div className="px-2.5 py-1 rounded-md bg-purple-500/20 border border-purple-500/30 text-xs text-purple-300 font-medium">
                      Gemini
                    </div>
                  </div>

                  {/* Field rows */}
                  <div className="space-y-2.5 mb-4">
                    {[
                      { label: "Topic", value: "The Future of AI in Content Marketing", icon: FileText },
                      { label: "Keywords", value: "ai, content, seo, marketing", icon: Search },
                      { label: "Word Count", value: "1,200 words", icon: BarChart3 },
                      { label: "Language", value: "English (US)", icon: Languages },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                        <f.icon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-gray-500 uppercase tracking-wide">{f.label}</div>
                          <div className="text-xs text-gray-200 truncate">{f.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Generate button */}
                  <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30">
                    <Sparkles className="w-4 h-4" />
                    Generate Blog
                  </button>

                  {/* SEO Score */}
                  <div className="mt-4 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-400">SEO Score</span>
                      <span className="text-sm font-bold text-green-400">94/100</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[94%] bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 px-3 py-2 rounded-xl bg-[#1a0f2e] border border-purple-500/30 shadow-xl backdrop-blur-md flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <div>
                  <div className="text-[10px] text-gray-500">Generated in</div>
                  <div className="text-xs font-bold text-white">28 seconds</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 px-3 py-2 rounded-xl bg-[#1a0f2e] border border-pink-500/30 shadow-xl backdrop-blur-md flex items-center gap-2">
                <Shield className="w-4 h-4 text-pink-400" />
                <div>
                  <div className="text-[10px] text-gray-500">Plagiarism</div>
                  <div className="text-xs font-bold text-white">100% Original</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Bento Grid */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-medium text-purple-300 uppercase tracking-wide">Features</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 tracking-tight">
              Everything you need.
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent"> Nothing you don't.</span>
            </h2>
            <p className="text-lg text-gray-400">
              A complete content engine — from brief to publish — with the intelligence to keep your brand consistent at scale.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 lg:gap-5">
            {/* Large feature 1 */}
            <div className="md:col-span-3 group relative p-8 rounded-2xl bg-gradient-to-br from-purple-900/30 to-purple-900/5 border border-purple-500/20 hover:border-purple-500/40 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Gemini Generation Engine</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Trained on structure, tone, and SEO best practices. Give it a brief — get a publish-ready blog with proper headings, keywords, and meta descriptions.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Structured Output", "Context Aware", "Multi-turn Editing"].map((t, i) => (
                    <span key={i} className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Large feature 2 */}
            <div className="md:col-span-3 group relative p-8 rounded-2xl bg-gradient-to-br from-pink-900/30 to-pink-900/5 border border-pink-500/20 hover:border-pink-500/40 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-colors" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-pink-300" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Real-Time SEO Scoring</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Every blog is analyzed across 20+ signals — keyword density, readability, structure, meta tags. Get actionable insights before you hit publish.
                </p>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-black/30 border border-white/5">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">Your SEO Score</span>
                      <span className="font-bold text-green-400">94 / 100</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[94%] bg-gradient-to-r from-green-500 to-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Small feature cards */}
            {[
              { icon: Languages, title: "25+ Languages", desc: "Reach a global audience with native-quality translations." },
              { icon: Layout, title: "Smart Templates", desc: "Dozens of niche-specific layouts built in." },
              { icon: Shield, title: "100% Original", desc: "Every generation is unique and plagiarism-checked." },
              { icon: Download, title: "Multi-Format Export", desc: "Download as Markdown, HTML, or PDF instantly." },
              { icon: Upload, title: "One-Click Publish", desc: "Push to WordPress, Medium, and more." },
              { icon: Settings, title: "Full Customization", desc: "Tone, style, word count, keywords — all yours." },
            ].map((f, i) => (
              <div key={i} className="md:col-span-2 group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-5 h-5 text-purple-300" />
                </div>
                <h3 className="text-base font-bold mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase / Workflow - Interactive Tabs */}
      <section id="workflow" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
              <Rocket className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-medium text-purple-300 uppercase tracking-wide">Workflow</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 tracking-tight">
              From idea to published in minutes.
            </h2>
            <p className="text-lg text-gray-400">
              Four steps. Zero friction. Full control.
            </p>
          </div>

          {/* Step tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10 max-w-4xl mx-auto">
            {workflowSteps.map((step, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`relative p-4 rounded-xl text-left transition-all ${
                  activeStep === i
                    ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/50 shadow-lg shadow-purple-600/10'
                    : 'bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    activeStep === i ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-sm font-semibold ${activeStep === i ? 'text-white' : 'text-gray-400'}`}>
                    {step.short}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 hidden lg:block">{step.title}</div>
                {activeStep === i && (
                  <div className="absolute -bottom-px left-4 right-4 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Active step content */}
          <div className="relative max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8 items-center p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 backdrop-blur-sm">
              <div className="lg:col-span-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
                    {React.createElement(workflowSteps[activeStep].icon, { className: "w-7 h-7" })}
                  </div>
                  <div>
                    <div className="text-xs text-purple-400 font-semibold uppercase tracking-wide">Step {activeStep + 1}</div>
                    <h3 className="text-2xl lg:text-3xl font-bold">{workflowSteps[activeStep].title}</h3>
                  </div>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {workflowSteps[activeStep].desc}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {workflowSteps[activeStep].bullets.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual side */}
              <div className="lg:col-span-2">
                <div className="relative p-5 rounded-2xl bg-black/40 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">
                      {["Brief", "Generation", "Analysis", "Output"][activeStep]}
                    </div>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    </div>
                  </div>
                  {activeStep === 0 && (
                    <div className="space-y-2">
                      {["Topic: AI in 2026", "Tone: Professional", "Words: 1,500", "Language: English"].map((t, i) => (
                        <div key={i} className="text-xs px-2.5 py-1.5 rounded bg-white/5 text-gray-300">{t}</div>
                      ))}
                    </div>
                  )}
                  {activeStep === 1 && (
                    <div className="space-y-2">
                      {[80, 95, 70, 88, 60].map((w, i) => (
                        <div key={i} className="h-2 rounded bg-white/5 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" style={{ width: `${w}%` }} />
                        </div>
                      ))}
                      <div className="text-[10px] text-purple-400 mt-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 animate-pulse" /> Generating...
                      </div>
                    </div>
                  )}
                  {activeStep === 2 && (
                    <div className="space-y-2.5">
                      {[
                        { l: "SEO", v: 94 },
                        { l: "Readability", v: 88 },
                        { l: "Keywords", v: 91 },
                      ].map((s, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                            <span>{s.l}</span>
                            <span className="font-bold text-white">{s.v}</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: `${s.v}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeStep === 3 && (
                    <div className="space-y-2">
                      {[
                        { icon: FileText, l: "Markdown", c: "text-gray-300" },
                        { icon: Globe, l: "HTML", c: "text-blue-300" },
                        { icon: Download, l: "PDF", c: "text-red-300" },
                        { icon: Upload, l: "WordPress", c: "text-cyan-300" },
                      ].map((o, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                          <o.icon className={`w-3.5 h-3.5 ${o.c}`} />
                          <span className="text-xs text-gray-300">{o.l}</span>
                          <ChevronRight className="w-3 h-3 text-gray-500 ml-auto" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
              <Quote className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-medium text-purple-300 uppercase tracking-wide">Loved by creators</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 tracking-tight">
              Don't take our word for it.
            </h2>
            <p className="text-lg text-gray-400">
              See how teams use BlogForge to ship content 10x faster.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                quote: "We went from publishing 4 blogs a month to 40. BlogForge handles the heavy lifting so our team focuses on strategy and edits.",
                name: "Sarah Chen",
                role: "Content Lead @ Flowbase",
                avatar: "SC",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                quote: "The SEO scores are scarily accurate. Every blog we've published through BlogForge ranks on page one within 3 weeks. That's not normal.",
                name: "Marcus Williams",
                role: "Founder @ GrowthLabs",
                avatar: "MW",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                quote: "I run 6 client blogs solo. BlogForge is my entire content team now. The multi-language support is a game-changer for my global clients.",
                name: "Priya Sharma",
                role: "Freelance SEO Consultant",
                avatar: "PS",
                gradient: "from-amber-500 to-orange-500"
              }
            ].map((t, i) => (
              <div key={i} className="group p-7 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-bold text-white`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-medium text-purple-300 uppercase tracking-wide">FAQ</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 tracking-tight">
              Frequently Asked Questions.
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-xl border transition-all ${
                  openFaq === i
                    ? 'bg-white/[0.04] border-purple-500/30'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-semibold text-white">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96' : 'max-h-0'}`}>
                  <p className="px-5 pb-5 text-gray-400 leading-relaxed text-sm">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 rounded-3xl blur-3xl" />
          <div className="relative rounded-3xl p-10 lg:p-16 bg-gradient-to-br from-[#1a0f2e] to-[#0f0819] border border-purple-500/30 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.6) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-lg shadow-purple-600/40">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight max-w-2xl mx-auto">
                Your next blog is 30 seconds away.
              </h2>
              <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
                Join thousands of creators shipping content at the speed of AI. Start free — no card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link href="/login">
                  <button className="group px-8 py-4 rounded-xl bg-white text-purple-700 hover:bg-gray-100 font-semibold shadow-xl transition-all transform hover:scale-[1.02] flex items-center gap-2">
                    Start Creating Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="px-8 py-4 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/5 font-semibold transition-all">
                    Sign In
                  </button>
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-400" /> No credit card</div>
                <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-400" /> 5 free posts</div>
                <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-400" /> Cancel anytime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">BlogForge</span>
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed">
                AI-powered content engine for creators who ship fast.
              </p>
            </div>

            {footerColumns.map((col, i) => (
              <div key={i}>
                <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      {link.href ? (
                        <Link href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                          {link.l}
                        </Link>
                      ) : link.a ? (
                        <button onClick={link.a} className="text-sm text-gray-500 hover:text-white transition-colors">
                          {link.l}
                        </button>
                      ) : (
                        <span className="text-sm text-gray-500">{link.l}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">© 2026 BlogForge. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}