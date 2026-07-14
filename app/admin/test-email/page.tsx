"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sendTestEmail } from "@/lib/email/actions/email.actions";
import { toast } from "sonner";
import { Loader, Mail, CheckCircle } from "lucide-react";

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleTest = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setSent(false);

    const result = await sendTestEmail(email);
    setLoading(false);

    if (result.success) {
      toast.success(`Test email sent to ${email}! Check your inbox.`);
      setSent(true);
    } else {
      toast.error(`Failed: ${result.error}`);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Test Email Integration</h1>
        <p className="text-muted-foreground mb-8">
          Send a test email to verify your Gmail SMTP configuration is working correctly.
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Test Email
            </CardTitle>
            <CardDescription>
              Enter an email address to send a test email. Check if emails are going to spam.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleTest()}
              />
            </div>
            
            <Button onClick={handleTest} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : sent ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Sent! Send Another?
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Test Email
                </>
              )}
            </Button>

            {sent && (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✅ Test email sent successfully! Check your inbox (and spam folder).
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Email Configuration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">EMAIL_FROM</span>
                <span className="text-sm font-mono">
                  {process.env.NEXT_PUBLIC_EMAIL_FROM || '⚠️ Not set'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">EMAIL_PASSWORD</span>
                <span className="text-sm">
                  {process.env.EMAIL_PASSWORD ? '✅ Configured' : '⚠️ Not set'}
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Setup Instructions:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>Enable 2FA on Gmail</li>
                <li>Generate App Password at myaccount.google.com/apppasswords</li>
                <li>Add EMAIL_FROM and EMAIL_PASSWORD to .env</li>
                <li>Restart dev server</li>
                <li>Test email above</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">
            📚 Need Help?
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            See <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">
              .kiro/specs/email-notifications/QUICK-START.md
            </code> for detailed setup instructions.
          </p>
        </div>
      </div>
    </div>
  );
}
