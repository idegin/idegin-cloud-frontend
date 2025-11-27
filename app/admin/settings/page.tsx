"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { Database, Download, Loader2, ShieldCheck, HardDrive } from "lucide-react"

export default function AdminSettingsPage() {
    const { toast } = useToast()
    const [isBackingUp, setIsBackingUp] = useState(false)

    const handleBackupDatabase = async () => {
        setIsBackingUp(true)
        try {
            const response = await apiClient.get("/backups/database")
            
            toast({
                title: "Backup Successful",
                description: response.data?.message || "Database backup has been created successfully.",
            })
        } catch (error: any) {
            toast({
                title: "Backup Failed",
                description: error.response?.data?.message || "Failed to create database backup. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsBackingUp(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage system settings and administrative tasks
                </p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <Database className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Database Backup</CardTitle>
                                    <CardDescription>
                                        Create a backup of the entire database
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                Secure
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg border bg-muted/50 p-4">
                            <div className="flex items-start gap-3">
                                <HardDrive className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">About Database Backups</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        This will create a complete backup of your database including all organizations, 
                                        projects, users, and CMS content. Backups are stored securely and can be used 
                                        for disaster recovery.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                            <p className="text-sm text-muted-foreground">
                                Click the button to initiate a database backup
                            </p>
                            <Button 
                                onClick={handleBackupDatabase} 
                                disabled={isBackingUp}
                                className="min-w-[140px]"
                            >
                                {isBackingUp ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Backing up...
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4 mr-2" />
                                        Backup Now
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
