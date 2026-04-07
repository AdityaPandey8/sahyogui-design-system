import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Cookie, Settings, Eye, Shield, Database } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";

export default function CookiePolicy() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Navbar onGetStarted={() => navigate("/auth")} />
      {/* Header */}
      <div className="border-b bg-secondary/20">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-4">
              <Cookie className="h-4 w-4" />
              Legal Documentation
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              How we use cookies and similar technologies to enhance your experience on our crisis response platform.
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
          {/* What Are Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                What Are Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Cookies are small text files that are stored on your device when you visit our website.
                They help us provide you with a better browsing experience by remembering your preferences
                and understanding how you use our platform.
              </p>
              <p>
                Cookies can be "persistent" (they remain on your device until you delete them) or "session"
                (they are deleted when you close your browser). We also use similar technologies like web beacons,
                pixels, and local storage.
              </p>
            </CardContent>
          </Card>

          {/* Types of Cookies We Use */}
          <Card>
            <CardHeader>
              <CardTitle>Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <h4 className="font-semibold">Essential Cookies</h4>
                    <Badge variant="secondary">Required</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    These cookies are necessary for the platform to function properly.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>Authentication and session management</li>
                    <li>Security features and fraud prevention</li>
                    <li>Emergency alert delivery</li>
                    <li>Basic platform functionality</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <h4 className="font-semibold">Functional Cookies</h4>
                    <Badge variant="outline">Optional</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    These cookies enhance your experience and remember your preferences.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>Language and location preferences</li>
                    <li>Theme selection (light/dark mode)</li>
                    <li>Dashboard customization settings</li>
                    <li>Form auto-fill preferences</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <h4 className="font-semibold">Analytics Cookies</h4>
                    <Badge variant="outline">Optional</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    These cookies help us understand how users interact with our platform.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>Page view tracking and user journey analysis</li>
                    <li>Performance monitoring and error tracking</li>
                    <li>Response time optimization</li>
                    <li>Platform usage patterns</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <h4 className="font-semibold">Third-Party Cookies</h4>
                    <Badge variant="outline">Optional</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Cookies from trusted third-party services that enhance our platform.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>Google Maps for location services</li>
                    <li>Authentication providers (if applicable)</li>
                    <li>Communication tools for emergency alerts</li>
                    <li>CDN services for faster content delivery</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                How We Use Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We use cookies for the following purposes:
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Platform Functionality</h4>
                  <p className="text-xs text-muted-foreground">
                    Ensure the platform works correctly and securely for crisis response operations.
                  </p>
                </div>

                <div className="p-3 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">User Experience</h4>
                  <p className="text-xs text-muted-foreground">
                    Remember your preferences and provide personalized features.
                  </p>
                </div>

                <div className="p-3 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Performance Monitoring</h4>
                  <p className="text-xs text-muted-foreground">
                    Track platform performance and identify areas for improvement.
                  </p>
                </div>

                <div className="p-3 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Security</h4>
                  <p className="text-xs text-muted-foreground">
                    Detect and prevent fraudulent activities and security threats.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Managing Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Managing Your Cookie Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Browser Settings</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  You can control cookies through your browser settings:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</p>
                  <p><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</p>
                  <p><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</p>
                  <p><strong>Edge:</strong> Settings → Cookies and site permissions</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Platform Cookie Settings</h4>
                <p className="text-sm text-muted-foreground">
                  You can manage non-essential cookies through our cookie preference center.
                  Essential cookies required for platform functionality cannot be disabled.
                </p>
                <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm">
                    <strong>Note:</strong> Disabling certain cookies may affect platform functionality,
                    especially during crisis response operations where real-time communication is critical.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Some cookies are set by third-party services that appear on our platform. We use these services
                to enhance functionality and provide better crisis response capabilities:
              </p>
              <ul>
                <li><strong>Mapping Services:</strong> For displaying crisis locations and coordinating responses</li>
                <li><strong>Communication Tools:</strong> For sending emergency alerts and updates</li>
                <li><strong>Analytics:</strong> To understand platform usage and improve performance</li>
                <li><strong>Security Services:</strong> To protect against threats and ensure platform integrity</li>
              </ul>
              <p>
                These third parties have their own privacy policies and cookie practices.
                We encourage you to review their policies to understand how they use cookies.
              </p>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle>Cookie Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Cookies have different lifespans depending on their purpose:
              </p>
              <ul>
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain until deleted or expired (typically 30 days to 2 years)</li>
                <li><strong>Essential Cookies:</strong> May persist longer for security and functionality purposes</li>
              </ul>
              <p>
                You can delete cookies at any time through your browser settings.
                However, this may affect your experience and require re-configuration of preferences.
              </p>
            </CardContent>
          </Card>

          {/* Updates to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices
                or for other operational, legal, or regulatory reasons. We will notify you of any material
                changes by posting the updated policy on our platform and updating the "Last updated" date.
              </p>
              <p>
                We encourage you to review this policy periodically to stay informed about our cookie practices.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Contact Us About Cookies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you have questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> privacy@sahyogai.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-COOKIE</p>
                <p><strong>Address:</strong> 123 Crisis Response Ave, Emergency City, EC 12345</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}