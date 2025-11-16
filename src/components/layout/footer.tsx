"use client";

import Link from "next/link";
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Mail, 
  HelpCircle, 
  FileText, 
  Shield, 
  Zap,
  Globe,
  ArrowRight
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Integrations", href: "/integrations" },
      { label: "API Documentation", href: "/api-docs" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Press Kit", href: "/press" },
    ],
    resources: [
      { label: "Documentation", href: "/docs" },
      { label: "Help Center", href: "/help" },
      { label: "Community", href: "/community" },
      { label: "Status", href: "/status" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "GDPR", href: "/gdpr" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/brandwatch", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/brandwatch", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/brandwatch", label: "GitHub" },
    { icon: Mail, href: "mailto:support@brandwatch.com", label: "Email" },
  ];

  return (
    <footer className="relative border-t border-slate-200/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Brand Watch
                </p>
                <p className="text-sm font-semibold text-white">
                  Reputation AI
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-4 max-w-xs">
              Advanced brand reputation monitoring and analytics platform powered by AI. 
              Track, analyze, and protect your brand across all channels.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-700/50 hover:text-white hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-slate-700/50 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white mb-1">
                Stay updated with brand insights
              </h3>
              <p className="text-sm text-slate-300">
                Get weekly reports and industry insights delivered to your inbox.
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 min-w-[200px]"
              />
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <p>© {currentYear} Brand Watch. All rights reserved.</p>
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-slate-400" />
                <span>English (US)</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/help"
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
              >
                <HelpCircle size={16} />
                <span>Support</span>
              </Link>
              <Link
                href="/status"
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
              >
                <Shield size={16} />
                <span>System Status</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

