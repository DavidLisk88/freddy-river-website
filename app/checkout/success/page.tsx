import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Download, Mail, Home } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-accent mx-auto mb-6" />
          <h1 className="text-4xl font-bold font-[family-name:var(--font-heading)] text-foreground mb-4">
            Order Complete!
          </h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase. Your order has been processed successfully.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-border">
            <CardContent className="p-6 text-center">
              <Download className="h-12 w-12 text-accent mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Download Your Files</h2>
              <p className="text-muted-foreground mb-4">
                Your beats and sample packs are ready for download. Check your email for download links.
              </p>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Now
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6 text-center">
              <Mail className="h-12 w-12 text-accent mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Check Your Email</h2>
              <p className="text-muted-foreground mb-4">
                We've sent you a confirmation email with your order details and download instructions.
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                <Mail className="h-4 w-4 mr-2" />
                Resend Email
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Order Number:</span>
                <p className="font-medium text-foreground">#FR-{Date.now().toString().slice(-6)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Order Date:</span>
                <p className="font-medium text-foreground">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Payment Method:</span>
                <p className="font-medium text-foreground">Credit Card</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <p className="font-medium text-accent">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">What's Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Download Your Files</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the download links in your email or click the download button above.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Review License Terms</h3>
                  <p className="text-sm text-muted-foreground">
                    Each purchase includes a commercial use license. Review the terms included with your download.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Start Creating</h3>
                  <p className="text-sm text-muted-foreground">
                    Import your new beats into your DAW and start making music!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/shop">
                <Home className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@freddyriver.com" className="text-accent hover:underline">
              support@freddyriver.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
