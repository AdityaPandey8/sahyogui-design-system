import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  ArrowUp,
  Shield,
  Users,
  Building2
} from "lucide-react";

const footerLinks = {
  platform: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "Roadmap", href: "#roadmap" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Partners", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Documentation", href: "#" },
    { label: "Community", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Data Protection", href: "/data-protection" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-background border-t">
      {/* Newsletter Section */}
      <div className="border-b bg-secondary/20">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_400px] items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Stay Connected
              </h3>
              <p className="text-muted-foreground mb-4">
                Get the latest updates on crisis response initiatives and platform improvements.
              </p>
              <div className="flex gap-2 max-w-md">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button>
                  <Mail className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">98%</p>
                    <p className="text-xs text-muted-foreground">Response Accuracy</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success mx-auto">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">24/7</p>
                    <p className="text-xs text-muted-foreground">Active Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
                S
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">SahyogAI</h3>
                <p className="text-sm text-muted-foreground">AI-Powered Crisis Coordination</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Connecting communities with NGOs and volunteers through intelligent matching and real-time coordination during times of crisis.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary"
                    asChild
                  >
                    <a href={social.href} aria-label={social.label}>
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href="mailto:hello@sahyogai.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  hello@sahyogai.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href="tel:+1-555-0123"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +1 (555) 012-3456
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  123 Crisis Response Ave<br />
                  Emergency City, EC 12345
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Footer */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
            <span>© 2026 SahyogAI. All rights reserved.</span>
            {footerLinks.legal.map((link, index) => (
              <span key={link.label}>
                <Link
                  to={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
                {index < footerLinks.legal.length - 1 && <span className="mx-2">•</span>}
              </span>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            Back to top
          </Button>
        </div>
      </div>
    </footer>
  );
}