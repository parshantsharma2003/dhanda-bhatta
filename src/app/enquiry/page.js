"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Send,
  Phone,
  MessageSquare,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Info,
  Clock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PageHero from "@/components/ui/PageHero";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ContactCTA from "@/components/sections/ContactCTA";
import { enquirySchema, ENQUIRY_TYPES } from "@/lib/validation/enquirySchema";
import { submitEnquiry } from "@/lib/services/submissionService";
import { getPublishedProducts } from "@/data/products";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { analyticsEvents } from "@/lib/analytics";

function EnquiryFormContainer() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get("product") || "";

  const publishedProducts = getPublishedProducts();

  // Find matching product name if slug was passed
  const initialProduct = publishedProducts.find((p) => p.slug === productParam)?.name || "";

  const [submissionResult, setSubmissionResult] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      enquiryType: "Product availability",
      interestedProduct: initialProduct,
      message: "",
      preferredContactMethod: "Phone",
      consent: false,
      website_hp: "",
    },
  });

  const onSubmit = async (data) => {
    const result = await submitEnquiry(data);
    if (result?.success) {
      analyticsEvents.enquirySubmit(data.enquiryType, data.interestedProduct);
    }
    setSubmissionResult(result);
  };

  const handleResetForm = () => {
    setSubmissionResult(null);
    reset();
  };

  if (submissionResult) {
    const { payload, directActions, reference } = submissionResult;

    return (
      <div className="space-y-6 py-4 animate-fadeIn">
        {/* Verification Confirmation Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-border-subtle">
          <div className="w-10 h-10 bg-[#E8F5E9] border border-[#2E7D32]/30 flex items-center justify-center text-[#2E7D32] shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-charcoal">
              Enquiry Submitted Successfully
            </h2>
            <p className="text-xs text-secondary-text">
              Dhanda Bhatta Company • Dispatch Desk
            </p>
          </div>
        </div>

        {/* Official Reference ID Badge */}
        {reference && (
          <div className="p-4 bg-white border border-terracotta/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-secondary-text block">
                Official Reference ID
              </span>
              <span className="font-heading font-bold text-lg text-terracotta tracking-wide">
                {reference}
              </span>
            </div>
            <span className="text-xs text-secondary-text bg-warm-bg px-2.5 py-1 border border-border-subtle w-fit">
              Save for all follow-up communications
            </span>
          </div>
        )}

        {/* Backend Confirmation Notice */}
        <div className="p-4 bg-warm-bg border-l-4 border-sandstone border-y border-r border-border-subtle space-y-2 text-xs sm:text-sm text-secondary-text">
          <div className="flex items-center gap-2 font-heading font-semibold text-charcoal">
            <Info className="w-4 h-4 text-sandstone shrink-0" />
            <span>Enquiry Confirmation:</span>
          </div>
          <p className="leading-relaxed">
            Your enquiry has been received by our dispatch team. We will review your requirement and reach out via your preferred method ({payload.preferredContactMethod}). For instantaneous response, you can tap either direct channel below with your pre-filled reference.
          </p>
        </div>

        {/* Structured Payload Summary */}
        <div className="bg-white border border-border-subtle p-4 sm:p-5 space-y-2.5 text-xs">
          <div className="flex justify-between py-1 border-b border-border-subtle/70">
            <span className="text-secondary-text">Customer Name:</span>
            <span className="font-semibold text-charcoal">{payload.fullName}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-border-subtle/70">
            <span className="text-secondary-text">Contact Phone:</span>
            <span className="font-semibold text-terracotta">{payload.phoneNumber}</span>
          </div>

          {payload.email && (
            <div className="flex justify-between py-1 border-b border-border-subtle/70">
              <span className="text-secondary-text">Email Address:</span>
              <span className="text-charcoal">{payload.email}</span>
            </div>
          )}

          <div className="flex justify-between py-1 border-b border-border-subtle/70">
            <span className="text-secondary-text">Enquiry Category:</span>
            <span className="font-semibold text-charcoal">{payload.enquiryType}</span>
          </div>

          {payload.interestedProduct && (
            <div className="flex justify-between py-1 border-b border-border-subtle/70">
              <span className="text-secondary-text">Interested Product:</span>
              <span className="font-semibold text-charcoal">{payload.interestedProduct}</span>
            </div>
          )}

          <div className="flex justify-between py-1 border-b border-border-subtle/70">
            <span className="text-secondary-text">Preferred Response Channel:</span>
            <span className="font-semibold text-charcoal">{payload.preferredContactMethod}</span>
          </div>

          <div className="pt-2">
            <span className="text-secondary-text block mb-1">Your Message:</span>
            <p className="p-3 bg-warm-bg border border-border-subtle text-charcoal leading-relaxed whitespace-pre-wrap">
              {payload.message}
            </p>
          </div>
        </div>

        {/* Direct Action Hotlines */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-heading font-semibold uppercase tracking-wider text-charcoal">
            Connect Directly with Kiln Dispatch:
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              href={directActions.whatsappUrl}
              variant="sandstone"
              size="lg"
              className="justify-center flex-1"
              iconLeft={MessageSquare}
              target="_blank"
              rel="noopener noreferrer"
            >
              Send via WhatsApp (Pre-Filled)
            </Button>

            <Button
              href={`tel:${directActions.phone}`}
              variant="primary"
              size="lg"
              className="justify-center flex-1"
              iconLeft={Phone}
            >
              Call Dispatch: {directActions.phoneDisplay}
            </Button>
          </div>
        </div>

        <div className="pt-3 border-t border-border-subtle text-center sm:text-left">
          <button
            type="button"
            onClick={handleResetForm}
            className="text-xs text-terracotta underline hover:text-terracotta-hover inline-flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Edit details or submit another enquiry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Honeypot Spam Protection Field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_hp">Leave this field blank</label>
        <input
          type="text"
          id="website_hp"
          autoComplete="off"
          tabIndex={-1}
          {...register("website_hp")}
        />
      </div>

      <div className="border-b border-border-subtle pb-4">
        <h2 className="font-heading font-bold text-xl text-charcoal">
          Enquiry Form
        </h2>
        <p className="text-xs text-secondary-text mt-0.5">
          Please fill in the details below. We review and respond to inquiries during regular dispatch hours.
        </p>
      </div>

      {/* 1. Full Name */}
      <FormField
        id="fullName"
        label="Full Name"
        required
        error={errors.fullName?.message}
      >
        <input
          type="text"
          id="fullName"
          autoComplete="name"
          placeholder="e.g. Ramesh Kumar"
          aria-invalid={errors.fullName ? "true" : "false"}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          className={cn(
            "w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-warm-bg border text-charcoal focus:bg-white focus:border-terracotta focus:outline-none transition-colors",
            errors.fullName ? "border-red-600 bg-red-50/30" : "border-border-subtle"
          )}
          {...register("fullName")}
        />
      </FormField>

      {/* 2 & 3. Mobile Number & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField
          id="phoneNumber"
          label="Mobile Number"
          required
          helpText="10-digit Indian mobile number (e.g. 98123 45678)"
          error={errors.phoneNumber?.message}
        >
          <input
            type="tel"
            id="phoneNumber"
            inputMode="tel"
            autoComplete="tel"
            placeholder="e.g. 98123 45678"
            aria-invalid={errors.phoneNumber ? "true" : "false"}
            aria-describedby={errors.phoneNumber ? "phoneNumber-error" : "phoneNumber-help"}
            className={cn(
              "w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-warm-bg border text-charcoal focus:bg-white focus:border-terracotta focus:outline-none transition-colors",
              errors.phoneNumber ? "border-red-600 bg-red-50/30" : "border-border-subtle"
            )}
            {...register("phoneNumber")}
          />
        </FormField>

        <FormField
          id="email"
          label="Email Address"
          optional
          error={errors.email?.message}
        >
          <input
            type="email"
            id="email"
            inputMode="email"
            autoComplete="email"
            placeholder="e.g. ramesh@example.com"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(
              "w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-warm-bg border text-charcoal focus:bg-white focus:border-terracotta focus:outline-none transition-colors",
              errors.email ? "border-red-600 bg-red-50/30" : "border-border-subtle"
            )}
            {...register("email")}
          />
        </FormField>
      </div>

      {/* 4 & 5. Enquiry Type & Interested Product */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField
          id="enquiryType"
          label="Enquiry Type"
          required
          error={errors.enquiryType?.message}
        >
          <select
            id="enquiryType"
            aria-invalid={errors.enquiryType ? "true" : "false"}
            aria-describedby={errors.enquiryType ? "enquiryType-error" : undefined}
            className={cn(
              "w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-warm-bg border text-charcoal focus:bg-white focus:border-terracotta focus:outline-none transition-colors cursor-pointer",
              errors.enquiryType ? "border-red-600 bg-red-50/30" : "border-border-subtle"
            )}
            {...register("enquiryType")}
          >
            {ENQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id="interestedProduct"
          label="Interested Product"
          optional
          error={errors.interestedProduct?.message}
        >
          <select
            id="interestedProduct"
            aria-invalid={errors.interestedProduct ? "true" : "false"}
            className="w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-warm-bg border border-border-subtle text-charcoal focus:bg-white focus:border-terracotta focus:outline-none transition-colors cursor-pointer"
            {...register("interestedProduct")}
          >
            <option value="">-- General / Not specified --</option>
            {publishedProducts.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* 6. Message */}
      <FormField
        id="message"
        label="Your Message"
        required
        helpText="Please describe your brick question, construction requirement, or delivery query."
        error={errors.message?.message}
      >
        <textarea
          id="message"
          rows={4}
          placeholder="e.g. Inquiring about brick availability and delivery to our site in Safidon..."
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "message-error" : "message-help"}
          className={cn(
            "w-full px-3.5 py-2.5 text-sm bg-warm-bg border text-charcoal focus:bg-white focus:border-terracotta focus:outline-none transition-colors resize-y min-h-[100px]",
            errors.message ? "border-red-600 bg-red-50/30" : "border-border-subtle"
          )}
          {...register("message")}
        />
      </FormField>

      {/* 7. Preferred Contact Method */}
      <div className="space-y-2 pt-1">
        <label className="text-xs font-heading uppercase tracking-wider font-semibold text-charcoal block">
          Preferred Contact Method <span className="text-terracotta">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Preferred contact method">
          <label className="flex items-center gap-2.5 p-3 border border-border-subtle bg-warm-bg text-charcoal has-[:checked]:border-terracotta has-[:checked]:bg-terracotta-tint/50 has-[:checked]:text-terracotta cursor-pointer transition-colors text-xs font-heading font-semibold select-none min-h-[46px]">
            <input
              type="radio"
              value="Phone"
              className="accent-[#963D32]"
              {...register("preferredContactMethod")}
            />
            <Phone className="w-4 h-4 shrink-0" />
            <span>Phone Call</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 border border-border-subtle bg-warm-bg text-charcoal has-[:checked]:border-[#2E7D32] has-[:checked]:bg-[#E8F5E9]/50 has-[:checked]:text-[#2E7D32] cursor-pointer transition-colors text-xs font-heading font-semibold select-none min-h-[46px]">
            <input
              type="radio"
              value="WhatsApp"
              className="accent-[#2E7D32]"
              {...register("preferredContactMethod")}
            />
            <MessageSquare className="w-4 h-4 shrink-0 text-[#2E7D32]" />
            <span>WhatsApp</span>
          </label>
        </div>
      </div>

      {/* 8. Consent Checkbox */}
      <div className="space-y-1 pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-[#963D32] border-border-subtle cursor-pointer"
            {...register("consent")}
          />
          <span className="text-xs text-secondary-text leading-relaxed">
            I confirm that the details provided are accurate and authorize Dhanda Bhatta Company to
            contact me regarding this enquiry.
          </span>
        </label>
        {errors.consent && (
          <p role="alert" className="text-xs text-red-600 font-medium pl-6">
            {errors.consent.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          className="w-full justify-center min-h-[50px]"
          iconRight={Send}
        >
          {isSubmitting ? "Verifying Enquiry..." : "Submit Enquiry"}
        </Button>
        <p className="text-[11px] text-secondary-text text-center mt-2">
          Kiln dispatch responds during regular operating hours (7:00 AM – 7:00 PM).
        </p>
      </div>
    </form>
  );
}

export default function EnquiryPage() {
  return (
    <div>
      {/* Page Hero */}
      <PageHero
        badge="Direct Customer Enquiry"
        title="How Can We Help You?"
        description="Have a question about our bricks, pricing or delivery? Send us an enquiry."
        breadcrumbs={[{ label: "Enquiry" }]}
      />

      <section className="py-12 sm:py-16 bg-white border-b border-border-subtle">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Column: Form with Suspense */}
            <div className="lg:col-span-7">
              <Card surface="white" className="p-6 sm:p-10 border-2 border-border-subtle shadow-xs">
                <Suspense
                  fallback={
                    <div className="py-12 text-center text-xs text-secondary-text animate-pulse">
                      Loading enquiry form...
                    </div>
                  }
                >
                  <EnquiryFormContainer />
                </Suspense>
              </Card>
            </div>

            {/* Right Column: Direct Dispatch Desk Info */}
            <div className="lg:col-span-5 space-y-6">
              <Card surface="warm" className="p-6 sm:p-8 space-y-5 border-2 border-border-subtle">
                <div className="border-b border-border-subtle pb-3">
                  <Badge variant="terracotta" size="sm">
                    Direct Kiln Access
                  </Badge>
                  <h3 className="font-heading font-bold text-lg text-charcoal mt-2">
                    Prefer Direct Contact?
                  </h3>
                  <p className="text-xs text-secondary-text mt-0.5">
                    Speak directly with our bhatta coordinator
                  </p>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-secondary-text">
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-charcoal block">Dispatch Phone:</strong>
                      <a
                        href={`tel:${siteConfig.contact.primaryPhone}`}
                        className="text-terracotta font-semibold hover:underline"
                      >
                        {siteConfig.contact.primaryPhoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-charcoal block">WhatsApp Channel:</strong>
                      <a
                        href={`https://wa.me/${siteConfig.contact.whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2E7D32] font-semibold hover:underline"
                      >
                        Chat with Sales ({siteConfig.contact.whatsappDisplay})
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-sandstone shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-charcoal block">Operating Schedule:</strong>
                      <span>{siteConfig.hours.display}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-charcoal block">Kiln Facility:</strong>
                      <span>{siteConfig.location.displayAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-subtle">
                  <Button
                    href={`tel:${siteConfig.contact.primaryPhone}`}
                    variant="outline"
                    size="sm"
                    className="w-full justify-center"
                    iconLeft={Phone}
                  >
                    Call Dispatch Desk
                  </Button>
                </div>
              </Card>

              {/* Business Policy Note */}
              <div className="p-5 bg-white border border-border-subtle space-y-2 text-xs text-secondary-text">
                <div className="flex items-center gap-2 font-heading font-semibold text-charcoal">
                  <ShieldCheck className="w-4 h-4 text-terracotta" />
                  <span>Transparent Communication</span>
                </div>
                <p className="leading-relaxed">
                  We supply bricks directly from the kiln gate to construction plots in nearby areas.
                  Batch availability and direct delivery timelines are confirmed upfront before dispatch.
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Bottom CTA */}
      <ContactCTA />
    </div>
  );
}
