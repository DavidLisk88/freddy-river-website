import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Award, Users, Headphones } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black font-[family-name:var(--font-heading)] text-foreground mb-6">
            About
            <span className="block text-accent">FREDDY RIVER</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Crafting premium digital beats and sample packs that inspire creativity and elevate musical expression.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <Card className="border-border">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-foreground mb-6">
                The Story Behind the Sound
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Freddy River began as a passion project in a small home studio, driven by the belief that every artist
                  deserves access to professional-quality beats and samples. What started as late-night sessions
                  experimenting with different sounds and rhythms has evolved into a comprehensive platform for digital
                  music production.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our journey is rooted in understanding the creative process. We know that the right beat can spark
                  inspiration, transform an idea into a masterpiece, and give artists the foundation they need to
                  express their unique voice. Every product in our catalog is meticulously crafted with this philosophy
                  in mind.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, Freddy River serves musicians, rappers, content creators, and producers worldwide, providing
                  them with the tools they need to bring their creative visions to life. We're not just selling beats –
                  we're fostering a community of creators who push the boundaries of what's possible in music.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground text-center mb-12">
            What Drives Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-border">
              <CardContent className="p-6 text-center">
                <Music className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Quality First</h3>
                <p className="text-muted-foreground">
                  Every beat and sample pack undergoes rigorous quality control to ensure professional-grade audio that
                  meets industry standards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Artist-Focused</h3>
                <p className="text-muted-foreground">
                  We understand artists' needs because we are artists. Our products are designed to inspire and enhance
                  creativity, not limit it.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  We constantly explore new sounds, techniques, and genres to keep our catalog fresh and ahead of
                  current trends.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 text-center">
                <Headphones className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Community</h3>
                <p className="text-muted-foreground">
                  Building a supportive ecosystem where creators can find the resources and inspiration they need to
                  succeed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="border-border bg-gradient-to-r from-card to-muted/30">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-foreground mb-4">
                Ready to Create Something Amazing?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of artists who trust Freddy River for their music production needs. Explore our
                collection and find the perfect sound for your next project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/shop">Browse Our Catalog</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
