// src/data/laptops.ts

export interface Laptop {
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

export const laptops: Laptop[] = [
  {
   
  id: 1,
  name: 'MacBook Pro 16"',
  serial: "AP-2024-MX-091",
  processor: "Apple M3 Max",
  ram: "64GB Unified",
  storage: "2TB SSD",
  owner: "Sarah Chen",
  location: "Head Office",
  status: "ACTIVE",
  image:
"https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
},
      
  {
    id: 2,
    name: "ThinkPad X1 Carbon",
    serial: "LX-772-TPX-442",
    processor: "Intel i7-1355U",
    ram: "32GB DDR5",
    storage: "1TB SSD",
    owner: "Tech Hub B2",
    location: "Repair Center",
    status: "REPAIR",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200",
  },
  {
    id: 3,
    name: "Dell XPS 15",
    serial: "DL-990-XPS-118",
    processor: "Intel i9-13900H",
    ram: "32GB DDR5",
    storage: "1TB SSD",
    owner: "New Batch",
    location: "Storage Room",
    status: "AVAILABLE",
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200",
  },
{
  id: 4,
  name: "Acer Swift X 14",
  serial: "AC-SWX-14-558",
  processor: "AMD Ryzen 7 7840HS",
  ram: "16GB LPDDR5",
  storage: "1TB SSD",
  owner: "Creative Team",
  location: "Design Lab",
  status: "ACTIVE",
  image:
  "https://media.istockphoto.com/id/1389603578/photo/laptop-blank-screen-on-wood-table-with-blurred-coffee-shop-cafe-interior-background-and.jpg?s=612x612&w=0&k=20&c=bPf3XxUZJZ6HRw7BE75ur1wBMCm_r4QAr-_lajERIyU="
},

];