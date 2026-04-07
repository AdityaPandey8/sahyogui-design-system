import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Scale, AlertTriangle, Users, Shield } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Navbar onGetStarted={() => navigate("/auth")} />
      {/* Header */}
      <div className="border-b bg-secondary/20">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-4">
              <Scale className="h-4 w-4" />
              Legal Documentation
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The rules and guidelines for using SahyogAI's crisis response platform.
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
          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                By accessing and using SahyogAI ("the Platform"), you accept and agree to be bound by the terms and provision
                of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p>
                These Terms of Service apply to all users of the Platform, including volunteers, NGOs, administrators,
                and the general public who report or view crisis information.
              </p>
            </CardContent>
          </Card>

          {/* Description of Service */}
          <Card>
            <CardHeader>
              <CardTitle>Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                SahyogAI is a crisis response coordination platform that connects communities with NGOs and volunteers
                during emergencies. Our services include:
              </p>
              <ul>
                <li>Crisis reporting and real-time mapping</li>
                <li>Volunteer and NGO coordination</li>
                <li>AI-powered issue analysis and prioritization</li>
                <li>Communication tools for emergency response</li>
                <li>Resource allocation and tracking</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">All Users</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Provide accurate and truthful information</li>
                  <li>Respect the privacy and dignity of others</li>
                  <li>Use the platform only for legitimate crisis response purposes</li>
                  <li>Report emergencies accurately and without delay</li>
                  <li>Follow local laws and emergency protocols</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Volunteers</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Respond to assignments in a timely manner</li>
                  <li>Maintain appropriate conduct during crisis response</li>
                  <li>Report progress and status updates accurately</li>
                  <li>Follow safety protocols and NGO guidelines</li>
                  <li>Respect the chain of command in emergency situations</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">NGOs and Administrators</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Verify organization credentials and authority</li>
                  <li>Coordinate response efforts efficiently</li>
                  <li>Ensure volunteer safety and appropriate task assignment</li>
                  <li>Maintain accurate records of response activities</li>
                  <li>Comply with data protection and privacy regulations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Prohibited Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You agree not to engage in any of the following prohibited activities:
              </p>

              <div className="grid gap-3">
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1 text-destructive">False Reporting</h4>
                  <p className="text-xs text-muted-foreground">
                    Submitting false or misleading crisis reports that could waste emergency resources.
                  </p>
                </div>

                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1 text-destructive">Harassment</h4>
                  <p className="text-xs text-muted-foreground">
                    Harassing, threatening, or intimidating other users, volunteers, or NGOs.
                  </p>
                </div>

                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1 text-destructive">Unauthorized Access</h4>
                  <p className="text-xs text-muted-foreground">
                    Attempting to gain unauthorized access to other accounts or system resources.
                  </p>
                </div>

                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1 text-destructive">Data Misuse</h4>
                  <p className="text-xs text-muted-foreground">
                    Using personal data obtained through the platform for unauthorized purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Termination */}
          <Card>
            <CardHeader>
              <CardTitle>Account Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                We reserve the right to terminate or suspend your account and access to the Platform immediately,
                without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p>
                Upon termination, your right to use the Platform will cease immediately. If you wish to terminate your account,
                you may simply discontinue using the Platform or contact us to request account deletion.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle>Disclaimers and Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 text-yellow-800 dark:text-yellow-200">Emergency Response Disclaimer</h4>
                <p className="text-sm text-muted-foreground">
                  The Platform is designed to facilitate crisis response but does not guarantee response times,
                  volunteer availability, or successful resolution of emergencies. Always contact local emergency services
                  for immediate threats to life or property.
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 text-blue-800 dark:text-blue-200">Service Availability</h4>
                <p className="text-sm text-muted-foreground">
                  We strive to maintain platform availability but cannot guarantee uninterrupted service.
                  The Platform may be temporarily unavailable due to maintenance, technical issues, or circumstances beyond our control.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                In no event shall SahyogAI, its directors, employees, partners, agents, suppliers, or affiliates be liable
                for any indirect, incidental, special, consequential, or punitive damages, including without limitation,
                loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul>
                <li>Your use of or inability to use the Platform</li>
                <li>Any unauthorized access to or use of our servers</li>
                <li>Any interruption or cessation of transmission to or from the Platform</li>
                <li>Any bugs, viruses, trojan horses, or the like</li>
                <li>Any errors or omissions in any content</li>
              </ul>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which SahyogAI operates,
                without regard to conflict of law provisions. Our failure to enforce any right or provision of these Terms
                will not be considered a waiver of those rights.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p>
                What constitutes a material change will be determined at our sole discretion. By continuing to access
                or use our Platform after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> legal@sahyogai.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-LEGAL</p>
                <p><strong>Address:</strong> 123 Crisis Response Ave, Emergency City, EC 12345</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}