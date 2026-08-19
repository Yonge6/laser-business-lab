export type MachineId = "vertigo" | "xrf" | "cobra" | "hydra";

export type Machine = {
  id: MachineId;
  name: string;
  category: string;
  price: number;
  url: string;
  image: string;
  materials: string[];
  useCases: string[];
  strengths: string[];
  productionLevel: number;
  budgetTier: number;
  tags: string[];
};

export const machines: Machine[] = [
  {
    id: "vertigo",
    name: "OneLaser VertiGo",
    category: "Rotary RF CO₂",
    price: 5_599,
    url: "https://www.1laser.com/products/vertigo-vertical-laser-engraver",
    image: "https://cdn.shopify.com/s/files/1/0747/8748/7778/files/VertiGo_3c806291-bd5f-4153-9ca8-d54e3fd1cd0b.png?v=1782698357",
    materials: ["drinkware", "coated metal", "tumblers"],
    useCases: ["tumblers", "production runs", "promotional products"],
    strengths: ["Drinkware-first workflow", "Integrated rotary setup", "Repeatable alignment"],
    productionLevel: 4,
    budgetTier: 3,
    tags: ["tumblers", "speed", "high-volume", "drinkware", "easy setup", "fine detail"],
  },
  {
    id: "xrf",
    name: "OneLaser XRF",
    category: "Desktop RF CO₂",
    price: 5_699,
    url: "https://www.1laser.com/products/onelaser-xrf-gen2-desktop-laser-with-38w-rf-metal-tube",
    image: "https://cdn.shopify.com/s/files/1/0747/8748/7778/files/OneLaser_XRFGen2_Product_Image_XRFHero17_EN_v3.webp?v=1787017071",
    materials: ["acrylic", "wood", "leather", "stone"],
    useCases: ["gifts", "awards", "signs", "small production runs"],
    strengths: ["Fine-detail RF engraving", "Compact all-in-one format", "Broad material versatility"],
    productionLevel: 3,
    budgetTier: 3,
    tags: ["acrylic", "wood", "leather", "awards", "gifts", "fine detail", "versatility", "easy setup"],
  },
  {
    id: "cobra",
    name: "OneLaser Cobra 10",
    category: "Workshop CO₂",
    price: 6_999,
    url: "https://www.1laser.com/products/cobra-10-100w-co2-laser-engraver-cutter",
    image: "https://cdn.shopify.com/s/files/1/0747/8748/7778/files/Cobra_10.png?v=1782460375",
    materials: ["wood", "acrylic", "leather"],
    useCases: ["signs", "large products", "batch cutting"],
    strengths: ["Workshop-scale cutting", "Large work area", "Strong fit for growing shops"],
    productionLevel: 4,
    budgetTier: 3,
    tags: ["wood", "acrylic", "leather", "signs", "large-format products", "large work area", "production runs"],
  },
  {
    id: "hydra",
    name: "OneLaser Hydra 9",
    category: "Industrial RF / Hybrid CO₂",
    price: 10_999,
    url: "https://www.1laser.com/products/hydra-9-gen-2-70w-rf-co2-dual-laser-machine",
    image: "https://cdn.shopify.com/s/files/1/0747/8748/7778/files/Hydra_9Gen2.png?v=1782813672",
    materials: ["acrylic", "wood", "leather", "coated materials"],
    useCases: ["high-volume production", "large products", "production runs"],
    strengths: ["Production-oriented platform", "High-throughput workflow", "Industrial work area"],
    productionLevel: 5,
    budgetTier: 4,
    tags: ["speed", "high-volume production", "large work area", "production runs", "large-format products", "versatility"],
  },
];

export const machineById = Object.fromEntries(machines.map((machine) => [machine.id, machine])) as Record<MachineId, Machine>;

export function isMachineId(value: string): value is MachineId {
  return value in machineById;
}
