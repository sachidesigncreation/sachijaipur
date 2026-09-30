/**
 * 12-step manufacturing flow — content from Our Process (Sheet1) document.
 * Step images live in /public/Processes (filenames may contain spaces and &).
 */
export type ManufacturingProcessStep = {
  title: string;
  desc: string;
  highlights: string[];
  image: string;
};

/** Safe URL path for static files with special characters in the filename */
function processImage(filename: string): string {
  return `/Processes/${encodeURIComponent(filename)}`;
}

export const manufacturingProcessSteps: ManufacturingProcessStep[] = [
  {
    title: "Concept & Design",
    desc: "Market-driven designs developed to align with client and global trends.",
    highlights: [
      "Trend research and concept development",
      "Sketching and design detailing",
      "CAD file creation for production",
    ],
    image: processImage("1. Concept & Design.webp"),
  },
  {
    title: "3D Modeling & Prototyping",
    desc: "Precise CAD models converted into physical prototypes for validation.",
    highlights: [
      "3D CAD model development",
      "Prototype creation (wax/resin)",
      "Design review and approval",
    ],
    image: processImage("2.3d Modeling .webp"),
  },
  {
    title: "Mold Making",
    desc: "Accurate molds created to ensure consistency in bulk production.",
    highlights: [
      "Master model preparation",
      "Mold creation (silicone/rubber)",
      "Mold finishing and testing",
    ],
    image: processImage("3. mold Making.webp"),
  },
  {
    title: "Wax Injection",
    desc: "Consistent wax models produced for efficient casting processes.",
    highlights: [
      "Wax injection into molds",
      "Removal and cleaning of wax pieces",
      "Tree assembly for casting",
    ],
    image: processImage("4. Wax Injection.webp"),
  },
  {
    title: "Casting",
    desc: "Metal is cast into defined shapes using advanced casting techniques.",
    highlights: [
      "Investment preparation",
      "Metal melting and pouring",
      "Cooling and mold removal",
    ],
    image: processImage("5. Casting .webp"),
  },
  {
    title: "Cutting & Filing",
    desc: "Refining raw cast pieces to achieve accurate structure and finish.",
    highlights: [
      "Tree cutting and separation",
      "Filing and shaping",
      "Surface correction",
    ],
    image: processImage("6. Cuttin and Filling.webp"),
  },
  {
    title: "Pre-Polishing",
    desc: "Initial polishing to prepare surfaces for further processing.",
    highlights: [
      "Surface smoothing",
      "Emery and buffing",
      "Pre-finishing inspection",
    ],
    image: processImage("7. Pre Polishing.webp"),
  },
  {
    title: "Stone Setting",
    desc: "Gemstones are securely set with precision and alignment.",
    highlights: [
      "Stone Color matching is done",
      "Setting (prong/bezel/pave)",
      "Tightening and alignment",
    ],
    image: processImage("8. Stone Setting.webp"),
  },
  {
    title: "Final Polishing",
    desc: "Enhancing the jewellery's shine and overall finish.",
    highlights: [
      "Final buffing and polishing",
      "Ultrasonic cleaning",
      "Surface finishing check",
    ],
    image: processImage("9. Final Polishing.webp"),
  },
  {
    title: "Plating / Finishing",
    desc: "Applying protective and decorative coatings for durability and aesthetics.",
    highlights: [
      "Surface preparation and cleaning",
      "Rhodium or Gold Plating",
      "Final finish inspection",
    ],
    image: processImage("10. Plating.webp"),
  },
  {
    title: "Quality Control (QC)",
    desc: "Strict inspection to ensure every piece meets required standards.",
    highlights: [
      "Dimensional and design check",
      "Stone setting inspection",
      "Final quality approval",
    ],
    image: processImage("11. Quality Control.webp"),
  },
  {
    title: "Packaging & Dispatch",
    desc: "Secure packaging and timely delivery for global shipments.",
    highlights: [
      "Final cleaning and polishing",
      "Packaging as per client requirement",
      "Dispatch and logistics handling",
    ],
    image: processImage("12. packaging .webp"),
  },
];
