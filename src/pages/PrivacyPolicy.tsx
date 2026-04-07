import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, Lock, FileText, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Navbar onGetStarted={() => navigate("/auth")} />
      {/* Header */}
      <div className="border-b bg-secondary/20">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-4">
              <Shield className="h-4 w-4" />
              Legal Documentation
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              How we collect, use, and protect your personal information in our crisis response platform.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
              <span>Last updated: April 4, 2026</span>
              <Badge variant="outline">Version 2.1</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                SahyogAI ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our crisis response platform
                that connects communities with NGOs and volunteers during emergencies.
              </p>
              <p>
                By using our platform, you agree to the collection and use of information in accordance with this policy.
                We will not use or share your information except as described in this Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Name, email address, and phone number</li>
                  <li>Location data for crisis response coordination</li>
                  <li>Profile information (role: volunteer, NGO, admin, or public)</li>
                  <li>Emergency contact information</li>
                  <li>Skills and availability (for volunteers)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Crisis Report Data</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Issue descriptions and severity levels</li>
                  <li>Geographic coordinates of reported incidents</li>
                  <li>Photos or media related to crisis situations</li>
                  <li>Response status and volunteer assignments</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Technical Information</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Usage patterns and platform interactions</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Crisis Response Coordination</h4>
                    <p className="text-sm text-muted-foreground">
                      Match volunteers and NGOs with reported issues based on location, skills, and availability.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Communication</h4>
                    <p className="text-sm text-muted-foreground">
                      Send alerts, updates, and coordination messages during crisis situations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Platform Improvement</h4>
                    <p className="text-sm text-muted-foreground">
                      Analyze usage patterns to improve response times and platform effectiveness.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Legal Compliance</h4>
                    <p className="text-sm text-muted-foreground">
                      Meet legal requirements and ensure platform security and integrity.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Emergency Response Partners</h4>
                  <p className="text-xs text-muted-foreground">
                    NGOs and authorized emergency responders may receive necessary information to coordinate crisis response.
                  </p>
                </div>

                <div className="p-3 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Legal Requirements</h4>
                  <p className="text-xs text-muted-foreground">
                    When required by law, court order, or to protect public safety and our legal rights.
                  </p>
                </div>

                <div className="p-3 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Service Providers</h4>
                  <p className="text-xs text-muted-foreground">
                    Trusted third-party services that help us operate the platform (hosting, analytics, communication).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access,
                alteration, disclosure, or destruction. These measures include:
              </p>
              <ul>
                <li>End-to-end encryption for sensitive communications</li>
                <li>Secure data storage with regular backups</li>
                <li>Access controls and authentication requirements</li>
                <li>Regular security audits and updates</li>
                <li>Incident response procedures for data breaches</li>
              </ul>
              <p>
                However, no method of transmission over the internet or electronic storage is 100% secure.
                While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You have the following rights regarding your personal information:
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Access</h4>
                  <p className="text-xs text-muted-foreground">Request a copy of your personal data</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Correction</h4>
                  <p className="text-xs text-muted-foreground">Update inaccurate or incomplete information</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Deletion</h4>
                  <p className="text-xs text-muted-foreground">Request removal of your personal data</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Portability</h4>
                  <p className="text-xs text-muted-foreground">Receive your data in a structured format</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                To exercise these rights, contact us at privacy@sahyogai.com.
                We will respond to your request within 30 days.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Contact Us About Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> privacy@sahyogai.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-PRIVACY</p>
                <p><strong>Address:</strong> 123 Crisis Response Ave, Emergency City, EC 12345</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}