import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitLead } from "@workspace/api-client-react";
import { trackEvent } from "@/lib/analytics";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const ROLE_OPTIONS = [
  { value: "startup", label: "Startup founder/team" },
  { value: "mentor", label: "Mentor" },
  { value: "investor", label: "Investor" },
  { value: "business_user", label: "Business/user looking for startups" },
  { value: "other", label: "Other" },
];

const INTENT_OPTIONS = [
  { id: "sell_services", label: "I want to sell services to startups" },
  { id: "find_services", label: "I want to find services for my startup" },
  { id: "find_collaborators", label: "I want to find collaborators" },
  { id: "mentor", label: "I want to mentor startups" },
  { id: "invest", label: "I want to discover startups to invest in" },
  { id: "early_access", label: "I want early access as a user" },
];

const SERVICE_TAGS = [
  "Marketing", "Technology", "Logistics", "Analytics", "FMCG", "AI", "Legal",
  "Finance", "Branding", "Sales", "Design", "HR", "Operations", "Funding",
  "Manufacturing", "Consulting", "Other"
];

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(255),
  companyName: z.string().min(1, "Company name is required").max(120, "Company name must be less than 120 characters"),
  roleType: z.enum(["startup", "mentor", "investor", "business_user", "other"], {
    required_error: "Please select a role",
  }),
  startupIntent: z.array(z.string()).min(1, "Please select at least one option"),
  servicesOffered: z.array(z.string()).optional(),
  servicesNeeded: z.array(z.string()).optional(),
  message: z.string().max(1000, "Message must be less than 1000 characters").optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export function WaitlistForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitLead = useSubmitLead();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      companyName: "",
      roleType: undefined,
      startupIntent: [],
      servicesOffered: [],
      servicesNeeded: [],
      message: "",
    },
  });

  function onSubmit(values: FormValues) {
    trackEvent("lead_form_submitted");
    setSubmitError(null);
    submitLead.mutate(
      { data: values },
      {
        onSuccess: () => {
          setIsSuccess(true);
          trackEvent("lead_form_success");
        },
        onError: () => {
          setSubmitError("Something went wrong. Please try again.");
          trackEvent("lead_form_error");
        },
      }
    );
  }

  if (isSuccess) {
    return (
      <div className="p-8 text-center bg-primary/5 border border-primary/20 rounded-xl">
        <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">You're on the early access list.</h3>
        <p className="text-muted-foreground">We'll reach out when the first version is ready.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card p-6 md:p-8 rounded-xl border border-border shadow-xl relative overflow-hidden z-0">
        
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-primary/5 blur-2xl -z-10 pointer-events-none" />

        {submitError && (
          <div className="p-4 text-sm text-destructive-foreground bg-destructive rounded-lg">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="jane@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company / Startup Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Corp" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ROLE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="startupIntent"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">What best describes you? *</FormLabel>
                <FormDescription>
                  Select all that apply.
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INTENT_OPTIONS.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="startupIntent"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition-colors"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer leading-snug">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-6 pt-4 border-t border-border">
          <FormField
            control={form.control}
            name="servicesOffered"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Services Offered (Optional)</FormLabel>
                <FormDescription>Click to toggle services you provide.</FormDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SERVICE_TAGS.map((tag) => {
                    const isSelected = field.value?.includes(tag);
                    return (
                      <Badge
                        key={`offered-${tag}`}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer hover:opacity-80 transition-opacity text-sm py-1.5 px-3"
                        onClick={() => {
                          const current = field.value || [];
                          const newValue = isSelected
                            ? current.filter((t) => t !== tag)
                            : [...current, tag];
                          field.onChange(newValue);
                        }}
                      >
                        {tag}
                      </Badge>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="servicesNeeded"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Services Needed (Optional)</FormLabel>
                <FormDescription>Click to toggle services you are looking for.</FormDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SERVICE_TAGS.map((tag) => {
                    const isSelected = field.value?.includes(tag);
                    return (
                      <Badge
                        key={`needed-${tag}`}
                        variant={isSelected ? "secondary" : "outline"}
                        className="cursor-pointer hover:opacity-80 transition-opacity text-sm py-1.5 px-3"
                        onClick={() => {
                          const current = field.value || [];
                          const newValue = isSelected
                            ? current.filter((t) => t !== tag)
                            : [...current, tag];
                          field.onChange(newValue);
                        }}
                      >
                        {tag}
                      </Badge>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us what you would want this platform to help you with."
                  className="min-h-[100px] resize-y"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            By joining, you agree that we may contact you about early access, product updates, and research for this startup marketplace.
          </p>
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-medium" 
            disabled={submitLead.isPending}
          >
            {submitLead.isPending ? "Submitting..." : "Request Early Access"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
