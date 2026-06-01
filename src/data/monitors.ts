// src/data/monitors.ts

export interface Monitor {
  id: number;
  name: string;
  serial: string;
  size: string;
  resolution: string;
  panel: string;
  refreshRate: string;
  owner: string;
  location: string;
  status: "ACTIVE" | "REPAIR" | "AVAILABLE";
  image: string;
}

export const monitors: Monitor[] = [
  {
    id: 1,
    name: "Dell UltraSharp U2723QE",
    serial: "DL-U27-2024-001",
    size: "27 inch",
    resolution: "4K UHD (3840×2160)",
    panel: "IPS Black",
    refreshRate: "60Hz",
    owner: "Sarah Chen",
    location: "Head Office",
    status: "ACTIVE",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1200",
  },
  {
    id: 2,
    name: "LG UltraGear 27GN950",
    serial: "LG-UG-27-882-112",
    size: "27 inch",
    resolution: "4K UHD (3840×2160)",
    panel: "Nano IPS",
    refreshRate: "144Hz",
    owner: "Tech Hub B2",
    location: "Repair Center",
    status: "REPAIR",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1200",
  },
  {
    id: 3,
    name: "Samsung Odyssey G7",
    serial: "SS-G7-550-771",
    size: "32 inch",
    resolution: "QHD (2560×1440)",
    panel: "VA Curved",
    refreshRate: "240Hz",
    owner: "New Batch",
    location: "Storage Room",
    status: "AVAILABLE",
    image:
      "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=1200",
  },
  {
    id: 4,
    name: "ASUS ProArt PA278CV",
    serial: "AS-PA-998-331",
    size: "27 inch",
    resolution: "WQHD (2560×1440)",
    panel: "IPS",
    refreshRate: "75Hz",
    owner: "Design Team",
    location: "Office Room A",
    status: "AVAILABLE",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200",
  },
  {
    id: 5,
    name: "BenQ PD3205U",
    serial: "BQ-PD-442-908",
    size: "32 inch",
    resolution: "4K UHD (3840×2160)",
    panel: "IPS",
    refreshRate: "60Hz",
    owner: "Creative Team",
    location: "Design Lab",
    status: "ACTIVE",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1200",
  },
  {
    id: 6,
    name: "MSI Optix MAG274QRF",
    serial: "MSI-MAG-771-220",
    size: "27 inch",
    resolution: "QHD (2560×1440)",
    panel: "Rapid IPS",
    refreshRate: "165Hz",
    owner: "Engineering Team",
    location: "IT Office",
    status: "REPAIR",
    image:
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1200",
  },
];