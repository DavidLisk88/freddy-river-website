"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, AlertCircle } from "lucide-react"
import { useAdmin } from "@/hooks/use-admin"

export function AdminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAdmin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const success = login(password)
    if (!success) {
      setError("Invalid password. Try 'admin123' for demo.")
      setPassword("")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-md mx-auto px-4 py-16">
        <Card className="border-border">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-accent" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Admin Login</CardTitle>
            <p className="text-muted-foreground">Enter your password to access the admin dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Demo Access:</strong> Use password "admin123" to access the admin dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
