# Dhanda Bhatta Company - On-Site Photography & Media Guidelines

This guide specifies the real photographs to be captured at the kiln facility in Village Kalwa, Pillukhera, Jind, Haryana for subsequent phases.

> **Directive**: No generic stock imagery or synthetic AI visuals are to be used on the production website. All visual slots are designed with premium editorial aspect ratios and ready for these verified field photographs.

---

## 1. Directory Structure

```
public/
  images/
    branding/
      logo-mark.svg
      logo-full.svg
      favicon.ico
    facility/
      kiln-aerial-overview.webp       (Aspect 16:9, Min 1920x1080)
      kiln-trench-firing.webp         (Aspect 16:9, Min 1920x1080)
      clay-pugging-mill.webp          (Aspect 4:3,  Min 1600x1200)
      green-bricks-drying-hacks.webp  (Aspect 16:9, Min 1920x1080)
      kiln-chimney-morning.webp       (Aspect 4:3,  Min 1600x1200)
    products/
      class-1-rawal-closeup.webp      (Aspect 4:3,  Min 1600x1200)
      class-1-stack-macro.webp        (Aspect 4:3,  Min 1600x1200)
      class-2-doyam-closeup.webp      (Aspect 4:3,  Min 1600x1200)
      wirecut-smooth-brick.webp       (Aspect 4:3,  Min 1600x1200)
      soling-foundation-bricks.webp   (Aspect 4:3,  Min 1600x1200)
      jhama-clinker-vitrified.webp    (Aspect 4:3,  Min 1600x1200)
      metallic-ring-test.webp         (Aspect 4:3,  Min 1600x1200)
    delivery/
      tractor-trolley-loading.webp    (Aspect 4:3,  Min 1600x1200)
      tipper-fleet-dispatch.webp      (Aspect 16:9, Min 1920x1080)
      unloading-stacking-site.webp    (Aspect 4:3,  Min 1600x1200)
      village-kalwa-signage.webp      (Aspect 16:9, Min 1920x1080)
```

---

## 2. Technical Shot List & Composition Rules

### A. Kiln Operations (Facility)
1. **The Firing Trench (`kiln-trench-firing.webp`)**:
   - Time: Golden hour (early morning or late afternoon).
   - Angle: Ground perspective across the brick chimney and firing wicket.
   - Purpose: Convey authentic industrial heat, disciplined craftsmanship, and thermal scale.

2. **Drying Hacks (`green-bricks-drying-hacks.webp`)**:
   - Time: Crisp midday sunlight showing sharp linear shadows.
   - Angle: Vanishing point perspective along the rows of sun-drying green bricks.
   - Purpose: Highlight geometric discipline and natural curing.

3. **Clay Pugging (`clay-pugging-mill.webp`)**:
   - Action shot showing rich, dense alluvial clay entering and exiting the pugging machine.
   - Purpose: Document high clay density and lack of foreign aggregate.

### B. Brick Quality & Closeups (Products)
1. **Class-I Red Clay Brick (`class-1-rawal-closeup.webp`)**:
   - Lighting: Soft architectural directional lighting.
   - Details: Highlight sharp rectangular edges (arrises), uniform terracotta color, and clean face texture.
   - Background: Neutral warm sandstone stone or kiln ground.

2. **Resonant Ring Test (`metallic-ring-test.webp`)**:
   - Close crop of experienced craftsman striking two bricks together over the finished stack.

### C. Logistics & Dispatch
1. **Tractor-Trolley Stacking (`tractor-trolley-loading.webp`)**:
   - Ground level showing careful manual interlocking stacking inside the trolley bed.
2. **Heavy Tipper Fleet (`tipper-fleet-dispatch.webp`)**:
   - Wide shot at the facility entrance with Pillukhera - Kalwa road background.

---

## 3. Formatting & Performance Requirements
- **Format**: Modern WebP or AVIF with fallback JPEG.
- **Color Profile**: sRGB.
- **Compression**: 80-85% quality to maintain brick texture sharpness while keeping file sizes under 250KB per hero image.
- **Responsiveness**: Next.js `<Image />` component with `sizes` attributes.
