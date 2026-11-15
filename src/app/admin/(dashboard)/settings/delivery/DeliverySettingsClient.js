"use client";

import { useState } from "react";
import {
  Truck,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  MapPin,
} from "lucide-react";

export default function DeliverySettingsClient({ initialSettings }) {
  const currentDelivery = initialSettings?.delivery || {};

  const [zones, setZones] = useState(
    currentDelivery.zones || [
      {
        name: "Zone 1 (Local Kalwa & Pillukhera)",
        district: "Jind",
        maxDistanceKm: 15,
        minOrderQuantity: 1000,
        estimatedDays: "Same day to 24 hours",
      },
      {
        name: "Zone 2 (Safidon, Assandh & Jind Town)",
        district: "Jind / Karnal",
        maxDistanceKm: 35,
        minOrderQuantity: 3000,
        estimatedDays: "24 to 48 hours",
      },
      {
        name: "Zone 3 (Panipat & Gohana Outer Belt)",
        district: "Panipat / Sonipat",
        maxDistanceKm: 60,
        minOrderQuantity: 5000,
        estimatedDays: "2 to 3 days",
      },
    ]
  );

  const [unloadingNotice, setUnloadingNotice] = useState(
    currentDelivery.unloadingNotice ||
      "Standard delivery quote includes truck transport to motorable road. Site unloading requires manual labour or mechanical tipper arrangements."
  );

  const [vehicleTypes, setVehicleTypes] = useState(
    currentDelivery.vehicleTypes?.length > 0
      ? currentDelivery.vehicleTypes.join("\n")
      : "Tractor Trolley (3,000 - 4,000 bricks)\nMedium Commercial Truck (6,000 - 8,000 bricks)\nHeavy Multi-Axle Hauler (12,000 - 16,000 bricks)"
  );

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleAddZone = () => {
    setZones([
      ...zones,
      {
        name: "New Delivery Zone",
        district: "Haryana",
        maxDistanceKm: 50,
        minOrderQuantity: 3000,
        estimatedDays: "1 to 2 days",
      },
    ]);
  };

  const handleUpdateZone = (idx, field, val) => {
    const updated = [...zones];
    updated[idx] = { ...updated[idx], [field]: val };
    setZones(updated);
  };

  const handleRemoveZone = (idx) => {
    setZones(zones.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const vehiclesArray = vehicleTypes
        .split("\n")
        .map((v) => v.trim())
        .filter(Boolean);

      const payload = {
        delivery: {
          zones,
          unloadingNotice,
          vehicleTypes: vehiclesArray,
        },
      };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update delivery settings");
      }

      setMessage({ text: "Delivery logistics and zones updated successfully.", type: "success" });
    } catch (err) {
      console.error("[DeliverySettings] Save error:", err);
      setMessage({ text: err.message || "Error saving delivery settings", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border-subtle">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-sandstone uppercase block mb-1">
            Global Configuration
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
            Delivery Zones & Fleet Logistics
          </h1>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-terracotta hover:bg-[#833329] text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save Delivery Config</span>
        </button>
      </div>

      {message.text && (
        <div
          className={`p-3 border-l-4 flex items-center gap-2 text-xs ${
            message.type === "success"
              ? "bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32]"
              : "bg-[#FFEBEE] border-terracotta text-charcoal"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-terracotta" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Delivery Zones Card */}
      <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-terracotta" />
            <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal">
              Coverage Distance Zones
            </h2>
          </div>
          <button
            type="button"
            onClick={handleAddZone}
            className="inline-flex items-center gap-1 text-xs text-terracotta hover:underline font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Coverage Zone</span>
          </button>
        </div>

        <div className="space-y-4">
          {zones.map((zone, idx) => (
            <div key={idx} className="p-4 bg-warm-bg border border-border-subtle text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-xs uppercase text-charcoal">
                  Zone #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveZone(idx)}
                  className="text-secondary-text hover:text-terracotta p-1 cursor-pointer"
                  title="Remove Zone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Zone Name</label>
                  <input
                    type="text"
                    value={zone.name}
                    onChange={(e) => handleUpdateZone(idx, "name", e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-border-subtle text-xs text-charcoal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Covered District(s)</label>
                  <input
                    type="text"
                    value={zone.district}
                    onChange={(e) => handleUpdateZone(idx, "district", e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-border-subtle text-xs text-charcoal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Max Distance (KM)</label>
                  <input
                    type="number"
                    value={zone.maxDistanceKm}
                    onChange={(e) => handleUpdateZone(idx, "maxDistanceKm", Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-border-subtle text-xs text-charcoal font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Minimum Batch Qty</label>
                  <input
                    type="number"
                    value={zone.minOrderQuantity}
                    onChange={(e) => handleUpdateZone(idx, "minOrderQuantity", Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-border-subtle text-xs text-charcoal font-mono focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-charcoal mb-1">Estimated Lead Time</label>
                  <input
                    type="text"
                    value={zone.estimatedDays}
                    onChange={(e) => handleUpdateZone(idx, "estimatedDays", e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-border-subtle text-xs text-charcoal focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fleet Types & Unloading Notice */}
      <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
          <Truck className="w-4 h-4 text-sandstone" />
          <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal">
            Vehicle Fleet & Unloading Policy
          </h2>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Vehicle Fleets (One per line)
            </label>
            <textarea
              rows={3}
              value={vehicleTypes}
              onChange={(e) => setVehicleTypes(e.target.value)}
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs font-mono text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Customer Unloading Notice & Terms
            </label>
            <textarea
              rows={3}
              value={unloadingNotice}
              onChange={(e) => setUnloadingNotice(e.target.value)}
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta leading-relaxed"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
