"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Truck,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Info,
  Calendar,
  MapPin,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PageHero from "@/components/ui/PageHero";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ContactCTA from "@/components/sections/ContactCTA";
import { orderSchema } from "@/lib/validation/orderSchema";
import { submitOrderRequest } from "@/lib/services/submissionService";
import { getPublishedProducts } from "@/data/products";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { analyticsEvents } from "@/lib/analytics";

export default function OrderPage() {
  const publishedProducts = getPublishedProducts();
  const [submissionResult, setSubmissionResult] = useState(null);

  // Set today's date in YYYY-MM-DD for min date attribute
  const todayDateString = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      phoneNumber: "",
      email: "",
      selectedProduct: publishedProducts[0]?.name || "First Class Red Clay Bricks",
      quantity: 5000,
      productInstructions: "",
      villageOrCity: "",
      district: "Jind",
      state: "Haryana",
      pincode: "",
      expectedDeliveryDate: "",
      deliveryInstructions: "",
      consent: false,
      website_hp: "",
    },
  });

  const onSubmit = async (data) => {
    const result = await submitOrderRequest(data);
    if (result?.success) {
      const qtyTier = data.quantity >= 20000 ? "20k+" : data.quantity >= 10000 ? "10k-20k" : "under-10k";
      analyticsEvents.orderRequestSubmit(data.selectedProduct, qtyTier);
    }
    setSubmissionResult(result);
  };

  const handleReset = () => {
    setSubmissionResult(null);
    reset();
  };

  return (
    <div>
      {/* Page Hero */}
      <PageHero
        badge="Direct Batch Procurement"
        title="Request Your Brick Order."
        description="Tell us what you need and where you need delivery. Our team can contact you to discuss availability and pricing."
        breadcrumbs={[{ label: "Order Request" }]}
      />

      <section className="py-12 sm:py-16 bg-white border-b border-border-subtle">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Column: Form / Confirmation */}
            <div className="lg:col-span-7">
              <Card surface="white" className="p-6 sm:p-10 border-2 border-border-subtle shadow-xs">
                {submissionResult ? (
                  /* Verified Submission Screen */
                  <div className="space-y-6 py-4 animate-fadeIn">
                    <div className="flex items-center gap-3 pb-4 border-b border-border-subtle">
                      <div className="w-10 h-10 bg-[#E8F5E9] border border-[#2E7D32]/30 flex items-center justify-center text-[#2E7D32] shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="font-heading font-bold text-xl text-charcoal">
                          Order Request Submitted
                        </h2>
                        <p className="text-xs text-secondary-text">
                          Dhanda Bhatta Company • Direct Kiln Supply
                        </p>
                      </div>
                    </div>

                    {/* Official Order Request Reference ID */}
                    {submissionResult.reference && (
                      <div className="p-4 bg-white border border-terracotta/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-secondary-text block">
                            Order Request Reference ID
                          </span>
                          <span className="font-heading font-bold text-lg text-terracotta tracking-wide">
                            {submissionResult.reference}
                          </span>
                        </div>
                        <span className="text-xs text-secondary-text bg-warm-bg px-2.5 py-1 border border-border-subtle w-fit">
                          Quote reference for dispatch desk
                        </span>
                      </div>
                    )}

                    {/* Important Business Rule Alert */}
                    <div className="p-4 bg-warm-bg border-l-4 border-terracotta border-y border-r border-border-subtle space-y-2 text-xs sm:text-sm text-secondary-text">
                      <div className="flex items-center gap-2 font-heading font-bold text-charcoal">
                        <Info className="w-4 h-4 text-terracotta shrink-0" />
                        <span>Order Enquiry Notice:</span>
                      </div>
                      <p className="leading-relaxed">
                        This request is an <strong>order enquiry</strong>, not an automatically confirmed
                        order. Brick batch availability, confirmed delivery date, and total vehicle haulage
                        will be verified and confirmed by our dispatch team before loading.
                      </p>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white border border-border-subtle p-4 sm:p-5 space-y-2.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-border-subtle/70">
                        <span className="text-secondary-text">Customer Name:</span>
                        <span className="font-semibold text-charcoal">{submissionResult.payload.customerName}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-border-subtle/70">
                        <span className="text-secondary-text">Contact Mobile:</span>
                        <span className="font-semibold text-terracotta">{submissionResult.payload.phoneNumber}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-border-subtle/70">
                        <span className="text-secondary-text">Brick Product:</span>
                        <span className="font-semibold text-charcoal">{submissionResult.payload.selectedProduct}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-border-subtle/70">
                        <span className="text-secondary-text">Requested Quantity:</span>
                        <span className="font-semibold text-charcoal">
                          {submissionResult.payload.quantity.toLocaleString("en-IN")} Bricks
                        </span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-border-subtle/70">
                        <span className="text-secondary-text">Delivery Location:</span>
                        <span className="font-semibold text-charcoal">
                          {submissionResult.payload.deliveryLocation.villageOrCity},{" "}
                          {submissionResult.payload.deliveryLocation.district},{" "}
                          {submissionResult.payload.deliveryLocation.state}
                          {submissionResult.payload.deliveryLocation.pincode &&
                            ` - ${submissionResult.payload.deliveryLocation.pincode}`}
                        </span>
                      </div>

                      {submissionResult.payload.expectedDeliveryDate && (
                        <div className="flex justify-between py-1 border-b border-border-subtle/70">
                          <span className="text-secondary-text">Target Date:</span>
                          <span className="font-semibold text-charcoal">
                            {submissionResult.payload.expectedDeliveryDate}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Direct Dispatch Actions */}
                    <div className="space-y-3 pt-2">
                      <p className="text-xs font-heading font-semibold uppercase tracking-wider text-charcoal">
                        Confirm With Kiln Dispatch:
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          href={submissionResult.directActions.whatsappUrl}
                          variant="sandstone"
                          size="lg"
                          className="justify-center flex-1"
                          iconLeft={MessageSquare}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Confirm on WhatsApp (Pre-Filled)
                        </Button>

                        <Button
                          href={`tel:${submissionResult.directActions.phone}`}
                          variant="primary"
                          size="lg"
                          className="justify-center flex-1"
                          iconLeft={Phone}
                        >
                          Call Dispatch: {submissionResult.directActions.phoneDisplay}
                        </Button>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border-subtle text-center sm:text-left">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-xs text-terracotta underline hover:text-terracotta-hover inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Modify request or submit another order</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Main Order Request Form */
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
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

                    {/* Notice Banner */}
                    <div className="p-3.5 bg-warm-bg border border-border-subtle flex items-start gap-2.5 text-xs text-secondary-text">
                      <Info className="w-4 h-4 text-sandstone shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-charcoal font-semibold">Order Notice: </strong>
                        This is an order request enquiry. No online payment is requested. Actual batch availability,
                        unloading mode, and final rates are confirmed by the business.
                      </div>
                    </div>

                    {/* SECTION 1: CUSTOMER INFORMATION */}
                    <div className="space-y-4">
                      <div className="border-b border-border-subtle pb-2">
                        <h2 className="font-heading font-bold text-base text-charcoal uppercase tracking-wider text-xs sm:text-sm">
                          1. Customer Information
                        </h2>
                      </div>

                      <div className="space-y-4">
                        <FormField
                          id="customerName"
                          label="Customer Full Name"
                          required
                          error={errors.customerName?.message}
                        >
                          <input
                            type="text"
                            id="customerName"
                            autoComplete="name"
                            placeholder="e.g. Surender Dhanda"
                            aria-invalid={errors.customerName ? "true" : "false"}
                            className={cn(
                              "w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-warm-bg border text-charcoal focus:bg-white focus:border-terracotta focus:outline-none transition-colors",
                              errors.customerName ? "border-red-600 bg-red-50/30" : "border-border-subtle"
                            )}
                            {...register("customerName")}
                          />
                        </FormField>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            id="phoneNumber"
                            label="Contact Mobile Number"
                            required
                            helpText="10-digit Indian mobile number for delivery calls"
                            error={errors.phoneNumber?.message}
                          >
                            <input
                              type="tel"
                              id="phoneNumber"
                              inputMode="tel"
                              autoComplete="tel"
                              placeholder="e.g. 98123 45678"
                              aria-invalid={errors.phoneNumber ? "true" : "false"}
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
                              placeholder="e.g. surender@example.com"
                              aria-invalid={errors.email ? "true" : "false"}
                              className={cn(
                                "w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-warm-bg border text-charcoal focus:bg-white focus:border-terracotta focus:outline-none transition-colors",
                                errors.email ? "border-red-600 bg-red-50/30" : "border-border-subtle"
                              )}
                              {...register("email")}
                            />
                          </FormField>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: PRODUCT INFORMATION */}
                    <div className="space-y-4">
                      <div className="border-b border-border-subtle pb-2">
                        <h2 className="font-heading font-bold text-base text-charcoal uppercase tracking-wider text-xs sm:text-sm">
                          2. Product Information
                        </h2>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            id="selectedProduct"
                            label="Select Brick Product"
                            required
                            error={errors.selectedProduct?.message}
                          >
                            <select
                              id="selectedProduct"
                              aria-invalid={errors.selectedProduct ? "true" : "false"}
                              className="w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-warm-bg border border-border-subtle text-charcoal focus:bg-white focus:border-terracotta focus:outline-none transition-colors cursor-pointer"
                              {...register("selectedProduct")}
                            >
                              {publishedProducts.map((p) => (
                                <option key={p.id} value={p.name}>
                                  {p.name}
                                </option>
                              ))}
                              <option value="Help me choose the right bricks">
                                Help me choose the right bricks
                              </option>
                            </select>
                          </FormField>

                          <FormField
                            id="quantity"
                            label="Required Quantity (Bricks)"
                            required
                            helpText="Enter estimated number of bricks (e.g. 5000, 15000)"
                            error={errors.quantity?.message}
                          >
                            <input
                              type="number"
                              id="quantity"
                              inputMode="numeric"
                              placeholder="e.g. 5000"
                              min="1"
                              step="100"
                              aria-invalid={errors.quantity ? "true" : "false"}
                              className={cn(
                                "w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-warm-bg border text-charcoal focus:bg-white focus:border-terracotta focus:outline-none transition-colors",
                                errors.quantity ? "border-red-600 bg-red-50/30" : "border-border-subtle"
                              )}
                              {...register("quantity")}
                            />
                          </FormField>
                        </div>

                        <FormField
                          id="productInstructions"
                          label="Additional Product Instructions"
                          optional
                          error={errors.productInstructions?.message}
                        >
                          <textarea
                            id="productInstructions"
                            rows={2}
                            placeholder="e.g. Required for foundation soling, or exposed boundary wall..."
                            className="w-full px-3.5 py-2.5 text-sm bg-warm-bg border border-border-subtle text-charcoal focus:bg-white focus:border-terracotta focus:outline-none transition-colors resize-y"
                            {...register("productInstructions")}
                          />
                        </FormField>
                      </div>
                    </div>

                    {/* SECTION 3: DELIVERY INFORMATION */}
                    <div className="space-y-4">
                      <div className="border-b border-border-subtle pb-2">
                        <h2 className="font-heading font-bold text-base text-charcoal uppercase tracking-wider text-xs sm:text-sm">
                          3. Delivery Destination Information
                        </h2>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            id="villageOrCity"
                            label="Village / City"
                            required
                            error={errors.villageOrCity?.message}
                          >
                            <input
                              type="text"
                              id="villageOrCity"
                              placeholder="e.g. Village Kalwa or Pillukhera"
                              aria-invalid={errors.villageOrCity ? "true" : "false"}
                              className={cn(
                                "w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-warm-bg border text-charcoal focus:bg-white focus:border-terracotta focus:outline-none transition-colors",
                                errors.villageOrCity ? "border-red-600 bg-red-50/30" : "border-border-subtle"
                              )}
                              {...register("villageOrCity")}
                            />
                          </FormField>

                          <FormField
                            id="district"
                            label="District"
                            required
                            error={errors.district?.message}
                          >
                            <input
                              type="text"
                              id="district"
                              placeholder="e.g. Jind"
                              aria-invalid={errors.district ? "true" : "false"}
                              className={cn(
                                "w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-warm-bg border text-charcoal focus:bg-white focus:border-terracotta focus:outline-none transition-colors",
                                errors.district ? "border-red-600 bg-red-50/30" : "border-border-subtle"
                              )}
                              {...register("district")}
                            />
                          </FormField>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <FormField
                            id="state"
                            label="State"
                            required
                            error={errors.state?.message}
                          >
                            <input
                              type="text"
                              id="state"
                              defaultValue="Haryana"
                              className="w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-warm-bg border border-border-subtle text-charcoal focus:bg-white focus:border-terracotta focus:outline-none transition-colors"
                              {...register("state")}
                            />
                          </FormField>

                          <FormField
                            id="pincode"
                            label="PIN Code"
                            optional
                            helpText="6-digit Indian PIN"
                            error={errors.pincode?.message}
                          >
                            <input
                              type="text"
                              id="pincode"
                              inputMode="numeric"
                              maxLength={6}
                              placeholder="e.g. 126113"
                              aria-invalid={errors.pincode ? "true" : "false"}
                              className={cn(
                                "w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-warm-bg border text-charcoal focus:bg-white focus:border-terracotta focus:outline-none transition-colors",
                                errors.pincode ? "border-red-600 bg-red-50/30" : "border-border-subtle"
                              )}
                              {...register("pincode")}
                            />
                          </FormField>

                          <FormField
                            id="expectedDeliveryDate"
                            label="Target Delivery Date"
                            optional
                            helpText="Earliest preferred date"
                            error={errors.expectedDeliveryDate?.message}
                          >
                            <input
                              type="date"
                              id="expectedDeliveryDate"
                              min={todayDateString}
                              aria-invalid={errors.expectedDeliveryDate ? "true" : "false"}
                              className={cn(
                                "w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-warm-bg border text-charcoal focus:bg-white focus:border-terracotta focus:outline-none transition-colors cursor-pointer",
                                errors.expectedDeliveryDate ? "border-red-600 bg-red-50/30" : "border-border-subtle"
                              )}
                              {...register("expectedDeliveryDate")}
                            />
                          </FormField>
                        </div>

                        <FormField
                          id="deliveryInstructions"
                          label="Additional Delivery / Site Access Notes"
                          optional
                          error={errors.deliveryInstructions?.message}
                        >
                          <textarea
                            id="deliveryInstructions"
                            rows={2}
                            placeholder="e.g. Site is 500m past the canal bridge; 15-foot wide road; tractor-trolley accessible."
                            className="w-full px-3.5 py-2.5 text-sm bg-warm-bg border border-border-subtle text-charcoal focus:bg-white focus:border-terracotta focus:outline-none transition-colors resize-y"
                            {...register("deliveryInstructions")}
                          />
                        </FormField>
                      </div>
                    </div>

                    {/* SECTION 4: CONSENT */}
                    <div className="space-y-2 pt-2 border-t border-border-subtle">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 accent-[#963D32] border-border-subtle cursor-pointer"
                          {...register("consent")}
                        />
                        <span className="text-xs text-secondary-text leading-relaxed">
                          I confirm that the details provided are correct and understand that this order request
                          is subject to final availability, pricing, and scheduling confirmation by Dhanda Bhatta Company.
                        </span>
                      </label>
                      {errors.consent && (
                        <p role="alert" className="text-xs text-red-600 font-medium pl-6">
                          {errors.consent.message}
                        </p>
                      )}
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full justify-center min-h-[50px]"
                        iconRight={Truck}
                      >
                        {isSubmitting ? "Verifying Order..." : "Submit Order Request"}
                      </Button>
                      <p className="text-[11px] text-secondary-text text-center mt-2">
                        No online payment required. Batch verified at kiln gate.
                      </p>
                    </div>
                  </form>
                )}
              </Card>
            </div>

            {/* Right Column: Dispatch Desk Terms & Instant Booking */}
            <div className="lg:col-span-5 space-y-6">
              <Card surface="warm" className="p-6 sm:p-8 space-y-5 border-2 border-border-subtle">
                <div className="border-b border-border-subtle pb-3">
                  <Badge variant="terracotta" size="sm">
                    Kiln Dispatch Policies
                  </Badge>
                  <h3 className="font-heading font-bold text-lg text-charcoal mt-2">
                    How Order Processing Works
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-secondary-text leading-relaxed">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-charcoal block">No Advance Online Payment:</strong>
                      We do not collect credit cards or online payments. Payment is settled per mutual agreement
                      based on weighbridge slip upon physical delivery.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-sandstone shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-charcoal block">Nearby Area Dispatch:</strong>
                      We deliver bricks directly to building sites across Jind and nearby surrounding regions.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-charcoal block">Need Immediate Dispatch?</strong>
                      Speak directly with our bhatta manager for same-day or next-day batch scheduling:
                      <a
                        href={`tel:${siteConfig.contact.primaryPhone}`}
                        className="text-terracotta font-semibold hover:underline block mt-0.5"
                      >
                        {siteConfig.contact.primaryPhoneDisplay}
                      </a>
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
                    Call Transport Desk
                  </Button>
                </div>
              </Card>

              {/* Kalwa Site Address */}
              <div className="p-5 bg-white border border-border-subtle space-y-2 text-xs text-secondary-text">
                <div className="flex items-center gap-2 font-heading font-semibold text-charcoal">
                  <MapPin className="w-4 h-4 text-terracotta" />
                  <span>Manufacturing &amp; Weighbridge Hub</span>
                </div>
                <p>{siteConfig.location.displayAddress}</p>
                <p className="text-[11px] text-sandstone font-medium pt-1">
                  Operating Hours: {siteConfig.hours.display}
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Bottom Contact CTA */}
      <ContactCTA />
    </div>
  );
}
