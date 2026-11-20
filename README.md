# Aevell

Parent-company website for **aevell.com**. Company slogan: **For what’s next.** Aevell introduces the companies it runs; it does not sell services on this website.

## Content

- Halenn is the only current company. The supplied horizontal white logo and wordmark are preserved, with an external link to https://www.halenn.com/.
- The Looking ahead section describes planned SaaS and technology ventures without implying that any are already launched.
- No invented company statistics, contact details, product launches or service enquiry forms.

## Local preview

Requires Node.js 20+. No dependencies or installation required.

```sh
npm run dev
```

Open http://127.0.0.1:4173. Set PORT to use another port.

## Build and hosting

```sh
npm run build
```

Deploy `dist/` to a static host. `vercel.json` configures a Vercel import to use this build and output directory. The canonical URL and sitemap target https://aevell.com/. Connecting the domain requires configuring it with the chosen hosting provider and its DNS records.

## Visual direction

Black and dark graphite surfaces, Manrope Light headings, Geist body text, generous spacing and thin separators. The editorial layout pairs the slogan with the favicon’s crossbar-free A directly alongside the slogan and gives Halenn a prominent feature. Both brand wordmarks and the supplied Halenn logo are preserved without cropping, distortion or recoloring.

## Editing

Content: `index.html`. Design and responsive layouts: `styles.css`. A 3.35-second opening begins with the exact Aevell header wordmark centered on black. The decorative screen fades away after a brief hold, revealing the header, two slogan lines, monogram, introduction and navigation cue in sequence. The opening screen never captures clicks, locks scrolling or takes keyboard focus; CSS hides it after 1.85 seconds even if JavaScript is unavailable. Masking, opacity and transforms preserve the final layout and logo artwork. It plays on opening or refreshing the top of the page, skips restored scroll positions and anchor destinations, and yields immediately to clicking, keyboard focus or scrolling. CSS keeps the page usable without JavaScript. JavaScript updates the footer year and adds restrained, one-time section reveals. Reduced-motion preferences and restored scroll positions are respected. Local fonts are preloaded with optional font display to prevent late font swaps. All navigation and company links work without JavaScript.

When another company launches, add a venture article under Our companies and update the Looking ahead copy. Keep future ideas separate from operating companies.

Geist and Manrope are bundled locally under their included font licenses. The hero monogram uses the exact favicon path and stroke proportions, with mouse-controlled directional illumination, a fine highlighted edge and a shadow cast away from the pointer. A softly feathered viewport light follows the cursor across the entire website. All headings (including the Halenn SVG heading and footer slogan) cast subtle shadows away from that same source, with frame-rate-independent smoothing and scroll-aware direction. Layout, text colors and logo artwork stay fixed. Upper-left lighting is the default on exit, touch devices and reduced motion, without a panel or frame. The slogan and monogram share one aligned row at every screen size. Halenn artwork belongs to Halenn. `halenn-lockup.png` preserves the user-supplied horizontal logo (672×216). The card displays `halenn-lockup-sharp-2x.png` (1344×432), a conservative non-AI derivative: Pillow UnsharpMask(radius=0.65, percent=80, threshold=3) on RGB, original alpha preserved, followed by uniform 2× Lanczos resampling. Layout, proportions, and lettering are unchanged. This improves edge contrast without inventing detail. The company heading separately uses the exact SVG lettering from Halenn’s website header. The AEVELL wordmark uses custom SVG lettering derived from Halenn’s geometric wordmark style: consistent 1.6-unit line weight, equal 16×18 letter bounds, 14-unit gaps, a shared top and baseline, and a crossbar-free A. It is not an installed font. Body text stays in Geist for readability.
