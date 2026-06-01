// src/data/phones.ts

export interface Phone {
  id: number;
  name: string;
  serial: string;
  processor: string;
  ram: string;
  storage: string;
  owner: string;
  location: string;
  status: "ACTIVE" | "REPAIR" | "AVAILABLE";
  image: string;
}

export const phones: Phone[] = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    serial: "IP-15PM-2024-001",
    processor: "Apple A17 Pro",
    ram: "8GB",
    storage: "256GB",
    owner: "Sarah Chen",
    location: "Head Office",
    status: "ACTIVE",
    image:
      "https://images.unsplash.com/photo-1696446703268-7a6c0f5b2c7a?q=80&w=1200",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    serial: "SS-S24U-882-112",
    processor: "Snapdragon 8 Gen 3",
    ram: "12GB",
    storage: "512GB",
    owner: "Tech Hub B2",
    location: "Repair Center",
    status: "REPAIR",
    image:
      "https://images.unsplash.com/photo-1706009644203-2f7d9c9c1f1a?q=80&w=1200",
  },
  {
    id: 3,
    name: "Google Pixel 8 Pro",
    serial: "GP-P8P-550-771",
    processor: "Google Tensor G3",
    ram: "12GB",
    storage: "256GB",
    owner: "New Batch",
    location: "Storage Room",
    status: "AVAILABLE",
    image:
      "https://images.unsplash.com/photo-1695653422170-4c2b5c5b2c11?q=80&w=1200",
  },
  {
    id: 4,
    name: "OnePlus 12",
    serial: "OP-12-998-331",
    processor: "Snapdragon 8 Gen 3",
    ram: "16GB",
    storage: "512GB",
    owner: "Design Team",
    location: "Office Room A",
    status: "AVAILABLE",
    image:
      "https://images.unsplash.com/photo-1701781258903-1c9d2b3a5c77?q=80&w=1200",
  },
  {
    id: 5,
    name: "Xiaomi 14",
    serial: "MI-14-442-908",
    processor: "Snapdragon 8 Gen 3",
    ram: "12GB",
    storage: "256GB",
    owner: "Creative Team",
    location: "Design Lab",
    status: "ACTIVE",
    image:
      "https://images.unsplash.com/photo-1700283219922-1b8c7d6f9a21?q=80&w=1200",
  },
  {
    id: 6,
    name: "Sony Xperia 1 V",
    serial: "SO-X1V-771-220",
    processor: "Snapdragon 8 Gen 2",
    ram: "12GB",
    storage: "256GB",
    owner: "Engineering Team",
    location: "IT Office",
    status: "REPAIR",
    image:
      "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=1200",
  },
];