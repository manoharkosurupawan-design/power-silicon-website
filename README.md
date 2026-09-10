# Power Silicon Technologies — Corporate Website

Official production-ready corporate website for **Power Silicon Technologies Pvt. Ltd.** (*"Design • Innovate • Deliver"*), specializing in **VLSI Engineering** (ASIC/SoC, RTL Design, UVM Verification, Physical Design, STA Signoff) and **Embedded Systems & Firmware Support**.

---

## 🌟 Key Features

- **16 High-Performance HTML5 Pages**: Complete corporate portal including dedicated services, R&D innovations, vertical domain solutions, silicon IP portfolio, career center, engineering whitepapers, and interactive RFQ / contact hub.
- **Interactive 60fps Semiconductor Canvas**: Custom lightweight HTML5 Canvas hero animation featuring interconnected circuit nodes, pulsing data packets, and mouse interaction with zero third-party dependencies.
- **VLSI & Embedded Systems Specialization Branding**: Tailored messaging reflecting the company's precise engineering expertise.
- **Authentic Brand Assets**: Vector SVG logo with 3D ribbon emblem, gold AI processor badge for the 'O' in SILICON, and amber lightning trace motif.
- **Zero Third-Party Lock-in**: Built with pure semantic HTML5, Vanilla CSS3 (custom design system tokens), and lightweight modern JavaScript. Ready for instant deployment on Hostinger, cPanel, Netlify, Vercel, AWS S3/CloudFront, or any web hosting server.
- **Interactive Functionality**:
  - Interactive RFQ Project Estimator & Quote Request form with feedback modal.
  - Job Application modal with position-tagging.
  - Interactive FAQ Accordions across 6 key categories.
  - Dynamic animated stat counters on viewport scroll.
  - Fully responsive mobile offcanvas drawer menu.

---

## 📁 16-Page Sitemap Structure

| # | File | Purpose |
|---|---|---|
| 1 | `index.html` | **Home Page** with interactive canvas hero, stats, 4 core capability cards, 6-stage execution pipeline, and trust metrics. |
| 2 | `about.html` | **About Us**: Company history, mission, vision, core values, EDA toolchain proficiency (Synopsys, Cadence, Siemens EDA), and foundry node experience. |
| 3 | `services.html` | **Services Overview**: Matrix of digital VLSI and embedded offerings + flexible engagement models (Turnkey, Staff Augmentation, Time-Critical SOW). |
| 4 | `vlsi-design.html` | **VLSI Design & Architecture**: RTL micro-architecture, AMBA interconnects, low-power UPF/CPF, and FPGA prototyping. |
| 5 | `verification-signoff.html` | **Verification & Signoff**: SystemVerilog/UVM testbenches, Formal verification, SVA assertions, GLS, and 100% coverage closure. |
| 6 | `physical-design.html` | **Physical Design & Tapeout**: Netlist-to-GDSII backend flow, hierarchical floorplanning, CTS, multi-corner STA signoff down to 5nm. |
| 7 | `embedded-systems.html` | **Embedded Systems & Firmware**: Board Support Packages (BSPs), Linux device drivers, RTOS, and post-silicon board bring-up. |
| 8 | `rnd-innovations.html` | **R&D & Technology Innovations**: RISC-V custom ISA extensions, AI NPU accelerators, UCIe chiplets, and sub-3nm GAAFET research. |
| 9 | `industry-solutions.html` | **Industry Solutions**: Automotive (ISO 26262 ASIL-D), AI & Edge Compute, IoT/Wearables, Aerospace & Defense, Industrial 4.0, Healthcare. |
| 10 | `products-ip.html` | **Products & Silicon IP**: Proprietary Verification IPs (VIPs), Edge NPU cores, Cryptographic hardware engines, and NoC mesh interconnects. |
| 11 | `careers.html` | **Careers & Culture**: Active job listings (RTL Designer, DV Lead, Physical Design Lead, Embedded Engineer) + Interactive Job Application Modal. |
| 12 | `blog.html` | **Insights & Engineering Blog**: 6 technical whitepapers covering 5nm timing closure, AXI5 deadlock prevention, and pre-silicon emulation. |
| 13 | `contact.html` | **Contact & RFQ Center**: Interactive Project SOW Estimator, electronic city office address, Google Maps preview, and WhatsApp click-to-chat. |
| 14 | `faq.html` | **Frequently Asked Questions**: Searchable accordions covering IP security, NDAs, EDA tooling, and onboarding lead times. |
| 15 | `privacy-policy.html` | **Legal Governance**: Comprehensive IP Protection guarantee, strict NDA terms, data privacy standards, and master service terms. |
| 16 | `404.html` | **404 Error Page**: Semiconductor-themed "Signal Disconnected" page with quick recovery navigation. |

---

## 🚀 Deployment Instructions

### Option 1: Hostinger / cPanel Hosting (Recommended)
1. Log into your **Hostinger hPanel** or **cPanel** dashboard.
2. Open **File Manager** and navigate to `public_html/`.
3. Upload all files and folders (`css/`, `js/`, `images/`, and all `.html` files) directly into `public_html/`.
4. Ensure `index.html` is at the root level.
5. In **hPanel → Emails**, create the 5 business email accounts (e.g. `info@powersilicontechnologies.com`, `careers@`, `sales@`, `support@`, `rfq@`).
6. Enable the free SSL certificate in the SSL dashboard.

### Option 2: GitHub Repository & Git Push
```bash
git init
git add .
git commit -m "Initial commit: Complete 15-page website for Power Silicon Technologies"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/power-silicon-website.git
git push -u origin main
```

---

## 🎨 Brand Design Tokens

- **Deep Navy Background**: `#060b14` / `#0b1526` / `#102038`
- **Circuit Cyan Glow**: `#00d2ff` (`rgba(0, 210, 255, 0.35)`)
- **Ember Orange Accent**: `#f5821f` / `#ff9800`
- **Silicon Gold Accent**: `#e5b84c` / `#c9a24b`
- **Typography**: `Outfit` (Headings), `Inter` (Body Text), `JetBrains Mono` / `Space Grotesk` (Technical Tags)
