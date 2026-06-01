// src/data/software.ts

export interface Software {
  id: number;
  name: string;
  serial: string;
  version: string;
  licenseType: string;
  vendor: string;
  owner: string;
  location: string;
  status: "ACTIVE" | "REPAIR" | "AVAILABLE";
  image: string;
}

export const software: Software[] = [
  {
    id: 1,
    name: "Microsoft 365",
    serial: "MS-365-ENT-001",
    version: "Enterprise 2024",
    licenseType: "Subscription",
    vendor: "Microsoft",
    owner: "Sarah Chen",
    location: "Head Office",
    status: "ACTIVE",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1200",
  },
  {
    id: 2,
    name: "Adobe Photoshop",
    serial: "AD-PS-CC-112",
    version: "2025",
    licenseType: "Creative Cloud",
    vendor: "Adobe",
    owner: "Tech Hub B2",
    location: "Design Lab",
    status: "REPAIR",
    image:
      "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?q=80&w=1200",
  },
  {
    id: 3,
    name: "AutoCAD",
    serial: "AC-2024-771",
    version: "2024",
    licenseType: "Perpetual",
    vendor: "Autodesk",
    owner: "Engineering Team",
    location: "IT Office",
    status: "AVAILABLE",
    image:
      "https://images.unsplash.com/photo-1581091870622-1e7f1b8a9f7b?q=80&w=1200",
  },
  {
    id: 4,
    name: "Visual Studio Code",
    serial: "VS-CODE-331",
    version: "1.90",
    licenseType: "Open Source",
    vendor: "Microsoft",
    owner: "Development Team",
    location: "Office Room A",
    status: "ACTIVE",
    image:
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200",
  },
  {
    id: 5,
    name: "Slack",
    serial: "SLK-908",
    version: "Latest",
    licenseType: "Subscription",
    vendor: "Slack Technologies",
    owner: "Creative Team",
    location: "Design Lab",
    status: "ACTIVE",
    image:
      "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=1200",
  },
  {
    id: 6,
    name: "Zoom Workplace",
    serial: "ZM-220",
    version: "2024 Pro",
    licenseType: "Subscription",
    vendor: "Zoom",
    owner: "HR Team",
    location: "Head Office",
    status: "REPAIR",
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1200",
  },
];