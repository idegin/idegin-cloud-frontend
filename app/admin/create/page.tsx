"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProjectInfoStep } from "./components/project-info-step";
import { ClientSelectionStep } from "./components/client-selection-step";
import { ProvidersStep, type Provider } from "./components/providers-step";
import { SuccessState } from "./components/success-state";
import { CheckCircle2 } from "lucide-react";
import { ProjectsService } from "@/lib/api/services/ProjectsService";
import { useToast } from "@/hooks/use-toast";

const STEPS = [
    {
        id: 1,
        title: "Project Information",
        description: "Basic details about your project",
    },
    {
        id: 2,
        title: "Client Selection",
        description: "Choose the client for this project",
    },
    {
        id: 3,
        title: "Providers",
        description: "Add hosting provider configurations",
    },
];

export default function CreateProjectPage() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        budget: "",
        maxStorageGB: "1",
        clientId: "",
        providerProjects: [] as Array<{
            id: string;
            provider: Provider;
            projectId: string;
            description: string;
        }>,
        enableCms: true,
        enableEmailMarketing: true,
        enableCrm: true,
    });

    console.log(formData);

    const progress = (currentStep / STEPS.length) * 100;

    const handleNext = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsLoading(false);

        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            // Map provider values to API format
            const providerTypeMap: Record<
                Provider,
                "fly.io" | "mortar_studio"
            > = {
                fly: "fly.io",
                "mortar-studio": "mortar_studio",
            };

            const providers = formData.providerProjects.map((project) => ({
                type: providerTypeMap[project.provider],
                appName: project.projectId,
            }));

            console.log(
                "client id from create project page",
                formData.clientId
            );

            await ProjectsService.postProjects({
                projectName: formData.name,
                description: formData.description,
                organizationId: formData.clientId,
                monthly_billing: parseFloat(formData.budget),
                maxStorageGB: parseInt(formData.maxStorageGB) || 1,
                providers: providers,
                status: "in_dev",
                is_payment_active: false,
                enableCms: formData.enableCms,
                enableEmailMarketing: formData.enableEmailMarketing,
                enableCrm: formData.enableCrm,
            });

            toast({
                title: "Success!",
                description: "Project created successfully.",
            });

            setIsSubmitted(true);
        } catch (error: any) {
            console.error("Failed to create project:", error);

            toast({
                variant: "destructive",
                title: "Error",
                description:
                    error?.body?.message ||
                    "Failed to create project. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAnother = () => {
        setIsSubmitted(false);
        setCurrentStep(1);
        setFormData({
            name: "",
            description: "",
            budget: "",
            maxStorageGB: "1",
            clientId: "",
            providerProjects: [],
            enableCms: true,
            enableEmailMarketing: true,
            enableCrm: true,
        });
    };

    const updateFormData = (data: Partial<typeof formData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1:
                return formData.name && formData.description && formData.budget;
            case 2:
                return formData.clientId;
            case 3:
                return formData.providerProjects.length > 0;
            default:
                return false;
        }
    };

    if (isSubmitted) {
        return (
            <SuccessState
                projectName={formData.name}
                onCreateAnother={handleCreateAnother}
            />
        );
    }

    return (
        <div className='container mx-auto max-w-4xl px-4'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold tracking-tight'>
                    Create New Project
                </h1>
                <p className='text-muted-foreground mt-2'>
                    Set up a new project with client and infrastructure details
                </p>
            </div>

            <div className='mb-8'>
                <div className='flex items-center justify-between mb-4'>
                    {STEPS.map((step, index) => (
                        <div key={step.id} className='flex items-center flex-1'>
                            <div className='flex flex-col items-center relative w-full'>
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                        currentStep > step.id
                                            ? "bg-primary border-primary text-primary-foreground"
                                            : currentStep === step.id
                                            ? "border-primary text-primary"
                                            : "border-muted-foreground/30 text-muted-foreground"
                                    }`}
                                >
                                    {currentStep > step.id ? (
                                        <CheckCircle2 className='w-6 h-6' />
                                    ) : (
                                        <span className='font-semibold'>
                                            {step.id}
                                        </span>
                                    )}
                                </div>
                                <div className='mt-2 text-center hidden md:block'>
                                    <p className='text-sm font-medium'>
                                        {step.title}
                                    </p>
                                    <p className='text-xs text-muted-foreground'>
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div
                                    className={`h-[2px] flex-1 mx-2 transition-colors ${
                                        currentStep > step.id
                                            ? "bg-primary"
                                            : "bg-muted-foreground/30"
                                    }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <Progress value={progress} className='h-2' />
            </div>

            <Card className='border-border/40 shadow-lg'>
                <CardHeader>
                    <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
                    <CardDescription>
                        {STEPS[currentStep - 1].description}
                    </CardDescription>
                </CardHeader>
                <CardContent className='min-h-[400px]'>
                    {currentStep === 1 && (
                        <ProjectInfoStep
                            data={formData}
                            onChange={updateFormData}
                            isLoading={isLoading}
                        />
                    )}
                    {currentStep === 2 && (
                        <ClientSelectionStep
                            selectedClientId={formData.clientId}
                            onChange={(clientId) => {
                                console.log(clientId);
                                updateFormData({ clientId });
                            }}
                        />
                    )}
                    {currentStep === 3 && (
                        <ProvidersStep
                            projects={formData.providerProjects}
                            onChange={(providerProjects) =>
                                updateFormData({ providerProjects })
                            }
                        />
                    )}
                </CardContent>
                <CardFooter className='flex justify-between border-t pt-6'>
                    <Button
                        variant='outline'
                        onClick={handleBack}
                        disabled={currentStep === 1 || isLoading}
                    >
                        Back
                    </Button>
                    <div className='flex gap-2'>
                        {currentStep < STEPS.length ? (
                            <Button
                                onClick={handleNext}
                                disabled={!isStepValid() || isLoading}
                            >
                                {isLoading ? "Loading..." : "Next"}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={!isStepValid() || isLoading}
                            >
                                {isLoading ? "Creating..." : "Create Project"}
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
