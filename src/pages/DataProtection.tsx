import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, Database, AlertTriangle, CheckCircle, FileText } from "lucide-react";

export default function DataProtection() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-secondary/20">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-4">
              <Shield className="h-4 w-4" />
              Legal Documentation
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Data Protection Policy
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive approach to protecting personal data and ensuring privacy in crisis response operations.
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
                <Lock className="h-5 w-5" />
                Data Protection Commitment
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                SahyogAI is committed to protecting the personal data of all users of our crisis response platform.
                We implement comprehensive data protection measures to ensure that personal information is handled
                responsibly, securely, and in compliance with applicable data protection laws and regulations.
              </p>
              <p>
                This Data Protection Policy outlines our practices for collecting, processing, storing, and protecting
                personal data, as well as your rights regarding your personal information.
              </p>
            </CardContent>
          </Card>

          {/* Legal Framework */}
          <Card>
            <CardHeader>
              <CardTitle>Legal Framework</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Our data protection practices comply with applicable laws and regulations, including:
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">GDPR</h4>
                  <p className="text-xs text-muted-foreground">General Data Protection Regulation (EU)</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">CCPA</h4>
                  <p className="text-xs text-muted-foreground">California Consumer Privacy Act</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Data Protection Act</h4>
                  <p className="text-xs text-muted-foreground">Local data protection legislation</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Industry Standards</h4>
                  <p className="text-xs text-muted-foreground">Emergency response data handling standards</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Processing Principles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Data Processing Principles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We adhere to the following principles when processing personal data:
              </p>

              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Lawfulness, Fairness, and Transparency</h4>
                    <p className="text-xs text-muted-foreground">
                      We process data lawfully and transparently, providing clear information about our practices.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Purpose Limitation</h4>
                    <p className="text-xs text-muted-foreground">
                      Data is collected for specific, explicit, and legitimate purposes related to crisis response.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Data Minimization</h4>
                    <p className="text-xs text-muted-foreground">
                      We collect only the minimum data necessary for effective crisis response operations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Accuracy</h4>
                    <p className="text-xs text-muted-foreground">
                      We ensure personal data is accurate and kept up to date.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Storage Limitation</h4>
                    <p className="text-xs text-muted-foreground">
                      Data is retained only as long as necessary for the purposes for which it was collected.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Security and Confidentiality</h4>
                    <p className="text-xs text-muted-foreground">
                      We implement appropriate security measures to protect personal data from unauthorized access.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security Measures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Data Security Measures
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Technical Security</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>End-to-end encryption for data transmission</li>
                  <li>Secure data storage with encryption at rest</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Multi-factor authentication for administrative access</li>
                  <li>Automated threat detection and response systems</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Organizational Security</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Staff training on data protection and privacy</li>
                  <li>Access controls and role-based permissions</li>
                  <li>Regular data protection impact assessments</li>
                  <li>Incident response and breach notification procedures</li>
                  <li>Third-party vendor security evaluations</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Physical Security</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Secure data center facilities with 24/7 monitoring</li>
                  <li>Controlled access to physical infrastructure</li>
                  <li>Redundant backup systems and disaster recovery</li>
                  <li>Secure destruction of physical media</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Retention and Deletion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We retain personal data only for as long as necessary to fulfill the purposes for which it was collected:
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Active Crisis Data</h4>
                  <p className="text-xs text-muted-foreground">
                    Retained during active crisis response operations and for 2 years thereafter for analysis and improvement.
                  </p>
                </div>

                <div className="p-3 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">User Account Data</h4>
                  <p className="text-xs text-muted-foreground">
                    Retained while account is active and for 3 years after account deactivation for legal and audit purposes.
                  </p>
                </div>

                <div className="p-3 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Communication Logs</h4>
                  <p className="text-xs text-muted-foreground">
                    Emergency communications retained for 5 years to support legal investigations and response analysis.
                  </p>
                </div>

                <div className="p-3 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Analytics Data</h4>
                  <p className="text-xs text-muted-foreground">
                    Aggregated, anonymized analytics data retained indefinitely for platform improvement.
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                When data is no longer needed, it is securely deleted or anonymized according to our data retention schedule.
              </p>
            </CardContent>
          </Card>

          {/* International Data Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                As a global crisis response platform, we may transfer personal data internationally to provide our services.
                When transferring data outside your country, we ensure appropriate safeguards are in place:
              </p>
              <ul>
                <li>Adequacy decisions by relevant data protection authorities</li>
                <li>Standard contractual clauses approved by data protection authorities</li>
                <li>Binding corporate rules for intra-group transfers</li>
                <li>Certification schemes and codes of conduct</li>
                <li>Your explicit consent where required</li>
              </ul>
              <p>
                We regularly review our international transfer mechanisms to ensure they provide adequate protection for your data.
              </p>
            </CardContent>
          </Card>

          {/* Data Subject Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Data Subject Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Under applicable data protection laws, you have the following rights:
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Right to Access</h4>
                  <p className="text-xs text-muted-foreground">Request information about how your data is processed</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Right to Rectification</h4>
                  <p className="text-xs text-muted-foreground">Correct inaccurate or incomplete personal data</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Right to Erasure</h4>
                  <p className="text-xs text-muted-foreground">Request deletion of your personal data</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Right to Restriction</h4>
                  <p className="text-xs text-muted-foreground">Limit how your data is processed</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Right to Portability</h4>
                  <p className="text-xs text-muted-foreground">Receive your data in a structured format</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Right to Object</h4>
                  <p className="text-xs text-muted-foreground">Object to processing based on legitimate interests</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                To exercise these rights, contact our Data Protection Officer at dpo@sahyogai.com.
                We will respond to your request within 30 days.
              </p>
            </CardContent>
          </Card>

          {/* Data Breach Notification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Data Breach Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                In the event of a data breach that poses a risk to individuals' rights and freedoms,
                we will notify the relevant supervisory authority within 72 hours and affected individuals
                without undue delay. Our incident response procedures include:
              </p>
              <ul>
                <li>Immediate assessment of breach impact and risk</li>
                <li>Containment and mitigation measures</li>
                <li>Notification to affected individuals with clear information</li>
                <li>Communication with regulatory authorities</li>
                <li>Post-incident review and improvement measures</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Protection Officer */}
          <Card>
            <CardHeader>
              <CardTitle>Data Protection Officer</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                We have appointed a Data Protection Officer (DPO) who is responsible for overseeing our data protection strategy
                and ensuring compliance with data protection laws. The DPO can be contacted at:
              </p>
              <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm"><strong>Email:</strong> dpo@sahyogai.com</p>
                <p className="text-sm"><strong>Phone:</strong> +1 (555) 123-DATA</p>
                <p className="text-sm"><strong>Address:</strong> 123 Crisis Response Ave, Emergency City, EC 12345</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contact Us About Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                For any questions about this Data Protection Policy or to exercise your data subject rights, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>General Inquiries:</strong> privacy@sahyogai.com</p>
                <p><strong>Data Protection Officer:</strong> dpo@sahyogai.com</p>
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