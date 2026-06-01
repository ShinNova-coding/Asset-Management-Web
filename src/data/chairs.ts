// src/data/chairs.ts

export interface Chair {
  id: number;
  name: string;
  serial: string;
  type: string;
  material: string;
  ergonomicSupport: string;
  color: string;
  owner: string;
  location: string;
  status: "ACTIVE" | "REPAIR" | "AVAILABLE";
  image: string;
}

export const chairs: Chair[] = [
  {
    id: 1,
    name: "Herman Miller Aeron",
    serial: "HM-AER-2024-001",
    type: "Ergonomic Office Chair",
    material: "Mesh + Aluminum",
    ergonomicSupport: "Full lumbar support",
    color: "Graphite",
    owner: "Sarah Chen",
    location: "Head Office",
    status: "ACTIVE",
    image:
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=1200",
  },
  {
    id: 2,
    name: "Steelcase Gesture",
    serial: "SC-GES-882-112",
    type: "Executive Chair",
    material: "Fabric + Steel frame",
    ergonomicSupport: "Adaptive arm & back support",
    color: "Black",
    owner: "Tech Hub B2",
    location: "Repair Center",
    status: "REPAIR",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200",
  },
  {
    id: 3,
    name: "Sihoo M18",
    serial: "SH-M18-550-771",
    type: "Budget Ergonomic Chair",
    material: "Mesh + Plastic frame",
    ergonomicSupport: "Adjustable lumbar support",
    color: "Grey",
    owner: "New Batch",
    location: "Storage Room",
    status: "AVAILABLE",
    image:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1200",
  },
  {
    id: 4,
    name: "Hbada Ergonomic Chair",
    serial: "HB-ER-998-331",
    type: "Modern Office Chair",
    material: "Mesh + Nylon",
    ergonomicSupport: "Headrest + lumbar support",
    color: "White",
    owner: "Design Team",
    location: "Office Room A",
    status: "AVAILABLE",
    image:
      "https://images.unsplash.com/photo-1616627987898-9f7b7a7b0c1f?q=80&w=1200",
  },
  {
    id: 5,
    name: "IKEA MARKUS",
    serial: "IK-MRK-442-908",
    type: "Classic Office Chair",
    material: "Fabric + Steel",
    ergonomicSupport: "Fixed lumbar support",
    color: "Dark Grey",
    owner: "Creative Team",
    location: "Design Lab",
    status: "ACTIVE",
    image:
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=1200",
  },
  {
    id: 6,
    name: "DXRacer Racing Series",
    serial: "DX-RC-771-220",
    type: "Gaming Chair",
    material: "PU Leather + Metal frame",
    ergonomicSupport: "Reclining + lumbar cushion",
    color: "Red/Black",
    owner: "Engineering Team",
    location: "IT Office",
    status: "REPAIR",
    image:
      "https://images.unsplash.com/photo-1616627781108-5d3f8f8b3f0a?q=80&w=1200",
  },
];