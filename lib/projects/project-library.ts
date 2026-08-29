import { buildOneLaserUrl, oneLaserDestinations } from "@/lib/commerce/onelaser";

export type ProjectMachineId = "xrf" | "vertigo" | "hydra" | "cobra";

type ProjectSeed = {
  slug: string;
  title: string;
  titleZh: string;
  image: string;
  material: string;
  materialZh: string;
  price: number;
  margin: number;
  machine: ProjectMachineId;
  useCase: string;
  useCaseZh: string;
  monthlySales?: number;
};

export type MakerProject = ProjectSeed & {
  imagePath: string;
  process: string;
  processZh: string;
  setup: string;
  setupZh: string;
  machineName: string;
  machineUrl: string;
  grossProfit: number;
  estimatedMonthlyGrossProfit: number;
};

// Source imagery and base commercial assumptions were adapted from the OneLaser
// homepage project gallery at commit 004ee2f39423d49527fff7dc099f23cebdc2449e.
// Maker Business Lab presents these as planning estimates, never income promises.
const seeds: ProjectSeed[] = [
  { slug: "personalized-serving-board", title: "Personalized Serving Board", titleZh: "个性化胡桃木餐板", image: "product-walnut-serving-board.webp", material: "Wood", materialZh: "木材", price: 69, margin: 72, machine: "xrf", useCase: "Weddings, housewarming gifts and local retail", useCaseZh: "婚礼、乔迁礼物与本地零售" },
  { slug: "family-photo-panel", title: "Family Photo Panel", titleZh: "家庭照片木刻画", image: "product-photo-wall-panel.webp", material: "Wood", materialZh: "木材", price: 119, margin: 82, machine: "xrf", useCase: "Portrait gifts, memorials and premium home décor", useCaseZh: "肖像礼物、纪念品与高端家居装饰" },
  { slug: "layered-acrylic-wall-sign", title: "Layered Acrylic Wall Sign", titleZh: "分层亚克力墙面标识", image: "home-project-large-acrylic-sign.webp", material: "Acrylic", materialZh: "亚克力", price: 299, margin: 64, machine: "cobra", useCase: "Retail, hospitality and commercial interiors", useCaseZh: "零售、酒店与商业空间" , monthlySales: 4 },
  { slug: "mountain-feature-wall", title: "Mountain Feature Wall", titleZh: "山景木刻背景墙", image: "home-project-walnut-mountain-wall.webp", material: "Walnut", materialZh: "胡桃木", price: 299, margin: 64, machine: "hydra", useCase: "Lodges, hospitality spaces and premium commissions", useCaseZh: "民宿、酒店空间与高端定制" , monthlySales: 4 },
  { slug: "adventure-bottle", title: "Adventure Bottle", titleZh: "户外探险保温瓶", image: "product-wine-bottle.webp", material: "Coated metal", materialZh: "涂层金属", price: 59, margin: 79, machine: "vertigo", useCase: "Corporate gifting, events and limited editions", useCaseZh: "企业礼赠、活动与限量系列" },
  { slug: "custom-tumbler", title: "Custom Tumbler", titleZh: "个性化保温杯", image: "product-custom-tumbler.webp", material: "Coated metal", materialZh: "涂层金属", price: 39, margin: 72, machine: "vertigo", useCase: "Gift sets, teams and seasonal designs", useCaseZh: "礼盒、团队订单与季节性设计" },
  { slug: "acrylic-counter-sign", title: "Counter Sign", titleZh: "亚克力台面标识", image: "product-acrylic-counter-sign.webp", material: "Acrylic", materialZh: "亚克力", price: 49, margin: 76, machine: "cobra", useCase: "Retail counters, hospitality and local business branding", useCaseZh: "零售柜台、酒店与本地商家品牌展示" },
  { slug: "whiskey-glass-set", title: "Whiskey Glass Set", titleZh: "威士忌玻璃杯套装", image: "product-rocks-glass.webp", material: "Glass", materialZh: "玻璃", price: 24, margin: 75, machine: "xrf", useCase: "Weddings, gift sets and hospitality", useCaseZh: "婚礼、礼盒与酒店场景" },
  { slug: "leather-patch-cap", title: "Leather Patch Cap", titleZh: "皮革章帽子", image: "product-leather-patch-cap.webp", material: "Leather", materialZh: "皮革", price: 39, margin: 63, machine: "cobra", useCase: "Local brands, teams and retail batches", useCaseZh: "本地品牌、团队与零售批量订单" },
  { slug: "keepsake-jewelry-box", title: "Keepsake Jewelry Box", titleZh: "纪念首饰盒", image: "product-engraved-jewelry-box.webp", material: "Wood", materialZh: "木材", price: 59, margin: 76, machine: "xrf", useCase: "Weddings, anniversaries and premium gifts", useCaseZh: "婚礼、纪念日与高端礼物" },
  { slug: "batch-leather-gift-set", title: "Batch Leather Gift Set", titleZh: "批量皮革礼品套装", image: "home-project-batch-leather-gifts.webp", material: "Leather", materialZh: "皮革", price: 39, margin: 63, machine: "hydra", useCase: "Corporate gifting, wholesale and repeat production", useCaseZh: "企业礼赠、批发与重复生产" },
  { slug: "layered-city-map", title: "Layered City Map", titleZh: "分层城市地图", image: "home-project-layered-city-map.webp", material: "Wood", materialZh: "木材", price: 299, margin: 64, machine: "hydra", useCase: "Offices, hospitality and premium commissions", useCaseZh: "办公室、酒店与高端定制" , monthlySales: 4 },
  { slug: "monogram-wallet", title: "Monogram Wallet", titleZh: "字母定制钱包", image: "product-leather-wallet.webp", material: "Leather", materialZh: "皮革", price: 39, margin: 80, machine: "xrf", useCase: "Premium gifts and ready-to-gift personalization", useCaseZh: "高端礼赠与即送型个性化产品" },
  { slug: "outdoor-estate-sign", title: "Outdoor Estate Sign", titleZh: "户外庄园标牌", image: "product-outdoor-estate-sign.webp", material: "Wood", materialZh: "木材", price: 299, margin: 64, machine: "hydra", useCase: "Estates, vacation rentals and venues", useCaseZh: "庄园、度假屋与活动场地" , monthlySales: 4 },
  { slug: "branded-metal-tags", title: "Branded Metal Tags", titleZh: "品牌金属标签", image: "product-coated-metal-tags.webp", material: "Coated metal", materialZh: "涂层金属", price: 19, margin: 80, machine: "hydra", useCase: "Local business orders and durable bulk runs", useCaseZh: "本地商家订单与耐用批量标记" },
  { slug: "custom-keychains", title: "Custom Keychains", titleZh: "定制钥匙扣", image: "product-custom-keychains.webp", material: "Leather", materialZh: "皮革", price: 16, margin: 74, machine: "cobra", useCase: "Events, bundles and collection drops", useCaseZh: "活动、组合销售与系列上新" },
  { slug: "modern-house-number", title: "Modern House Number", titleZh: "现代门牌号", image: "product-house-number-sign.webp", material: "Wood", materialZh: "木材", price: 299, margin: 64, machine: "hydra", useCase: "Homes, rentals and local installation projects", useCaseZh: "住宅、出租屋与本地安装项目" , monthlySales: 4 },
  { slug: "portrait-botanical-collection", title: "Portrait & Botanical Collection", titleZh: "肖像与植物艺术系列", image: "power-38w-result.webp", material: "Wood, acrylic & leather", materialZh: "木材、亚克力与皮革", price: 119, margin: 82, machine: "xrf", useCase: "Mixed-media gifts and detailed personalized art", useCaseZh: "混合材料礼物与高精细个性化艺术" },
  { slug: "wildlife-art-collection", title: "Wildlife Art Collection", titleZh: "野生动物艺术系列", image: "power-70w-result.webp", material: "Wood, acrylic & coated metal", materialZh: "木材、亚克力与涂层金属", price: 119, margin: 82, machine: "hydra", useCase: "Premium décor and mixed-material collections", useCaseZh: "高端装饰与多材料系列产品" },
  { slug: "wood-maker-collection", title: "Wood Maker Collection", titleZh: "木作创客系列", image: "material-wood.webp", material: "Wood", materialZh: "木材", price: 69, margin: 72, machine: "xrf", useCase: "A broad wood catalog for gifts and décor", useCaseZh: "覆盖礼物与装饰品的木作产品线" },
  { slug: "acrylic-design-collection", title: "Acrylic Design Collection", titleZh: "亚克力设计系列", image: "material-acrylic.webp", material: "Acrylic", materialZh: "亚克力", price: 49, margin: 76, machine: "cobra", useCase: "Displays, signage and dimensional décor", useCaseZh: "展示牌、标识与立体装饰" },
  { slug: "glass-stone-collection", title: "Glass & Stone Collection", titleZh: "玻璃与石材系列", image: "material-glass-stone.webp", material: "Glass & stone", materialZh: "玻璃与石材", price: 24, margin: 75, machine: "xrf", useCase: "Awards, décor and premium keepsakes", useCaseZh: "奖杯、装饰与高端纪念品" },
  { slug: "personalized-leather-goods", title: "Personalized Leather Goods", titleZh: "个性化皮具系列", image: "material-leather.webp", material: "Leather", materialZh: "皮革", price: 39, margin: 80, machine: "xrf", useCase: "Wallets, journals, tags and gift-ready goods", useCaseZh: "钱包、手账、标签与即送型礼品" },
  { slug: "wedding-welcome-suite", title: "Wedding Welcome Suite", titleZh: "婚礼迎宾套装", image: "home-project-etsy-wedding-welcome-suite.webp", material: "Acrylic, metal & glass", materialZh: "亚克力、金属与玻璃", price: 179, margin: 66, machine: "xrf", useCase: "Wedding displays and coordinated reception packages", useCaseZh: "婚礼展示与成套宴会用品" , monthlySales: 8 },
  { slug: "whiskey-decanter-gift-set", title: "Whiskey Decanter Gift Set", titleZh: "威士忌醒酒器礼盒", image: "home-project-etsy-whiskey-decanter-gift-set.webp", material: "Wood, leather, metal & glass", materialZh: "木材、皮革、金属与玻璃", price: 149, margin: 64, machine: "xrf", useCase: "Milestone gifts and executive gifting", useCaseZh: "里程碑礼物与商务礼赠" , monthlySales: 10 },
  { slug: "pet-memorial-keepsake", title: "Pet Memorial Keepsake", titleZh: "宠物纪念摆件", image: "home-project-etsy-pet-memorial-keepsake.webp", material: "Acrylic & leather", materialZh: "亚克力与皮革", price: 89, margin: 72, machine: "xrf", useCase: "Portrait memorials and remembrance displays", useCaseZh: "宠物肖像纪念与追思摆件" , monthlySales: 14 },
  { slug: "corporate-barware-set", title: "Corporate Barware Set", titleZh: "企业定制酒具套装", image: "home-project-etsy-corporate-logo-barware-set.webp", material: "Leather, metal & glass", materialZh: "皮革、金属与玻璃", price: 199, margin: 63, machine: "xrf", useCase: "Client gifts and branded hospitality programs", useCaseZh: "客户礼物与品牌接待项目" , monthlySales: 8 },
  { slug: "bridesmaid-table-setting", title: "Bridesmaid Table Setting", titleZh: "伴娘桌面礼品套装", image: "home-project-etsy-bridesmaid-table-setting.webp", material: "Acrylic, leather, metal & glass", materialZh: "亚克力、皮革、金属与玻璃", price: 129, margin: 62, machine: "xrf", useCase: "Bridal parties and coordinated event orders", useCaseZh: "伴娘团与成套活动订单" , monthlySales: 10 },
  { slug: "city-map-home-bar-set", title: "City Map Home Bar Set", titleZh: "城市地图家庭酒吧套装", image: "home-project-etsy-city-map-home-bar-set.webp", material: "Wood, leather, metal & glass", materialZh: "木材、皮革、金属与玻璃", price: 189, margin: 66, machine: "xrf", useCase: "Housewarming gifts and location keepsakes", useCaseZh: "乔迁礼物与城市纪念品" , monthlySales: 8 },
  { slug: "personalized-coffee-station", title: "Personalized Coffee Station", titleZh: "个性化咖啡角套装", image: "home-project-etsy-personalized-coffee-station.webp", material: "Acrylic, leather, metal & glass", materialZh: "亚克力、皮革、金属与玻璃", price: 99, margin: 67, machine: "xrf", useCase: "Housewarming gifts and kitchen bundles", useCaseZh: "乔迁礼物与厨房组合产品" , monthlySales: 12 },
  { slug: "family-recipe-display", title: "Family Recipe Display", titleZh: "家庭食谱展示牌", image: "home-project-etsy-family-recipe-display.webp", material: "Acrylic, leather & metal", materialZh: "亚克力、皮革与金属", price: 89, margin: 70, machine: "xrf", useCase: "Heirloom gifts and personalized kitchen décor", useCaseZh: "传家礼物与个性化厨房装饰" , monthlySales: 14 },
  { slug: "wedding-vow-keepsake-box", title: "Wedding Vow Keepsake Box", titleZh: "婚礼誓言纪念盒", image: "home-project-etsy-wedding-vow-keepsake-box.webp", material: "Wood, acrylic, leather & metal", materialZh: "木材、亚克力、皮革与金属", price: 149, margin: 65, machine: "xrf", useCase: "Wedding keepsakes and premium memory boxes", useCaseZh: "婚礼纪念与高端回忆盒" , monthlySales: 10 },
  { slug: "groomsmen-bar-set", title: "Groomsmen Bar Set", titleZh: "伴郎酒具礼盒", image: "home-project-etsy-groomsmen-bar-set.webp", material: "Wood, leather, metal & glass", materialZh: "木材、皮革、金属与玻璃", price: 169, margin: 61, machine: "xrf", useCase: "Wedding parties and coordinated gift programs", useCaseZh: "伴郎团与成套礼赠项目" , monthlySales: 8 },
  { slug: "baby-name-nursery-keepsake", title: "Baby Name Nursery Keepsake", titleZh: "宝宝姓名纪念摆件", image: "home-project-etsy-baby-name-nursery-keepsake.webp", material: "Acrylic & leather", materialZh: "亚克力与皮革", price: 79, margin: 71, machine: "xrf", useCase: "New-baby gifts and nursery décor", useCaseZh: "新生儿礼物与儿童房装饰" , monthlySales: 14 },
  { slug: "realtor-closing-gift-set", title: "Realtor Closing Gift Set", titleZh: "房产交付礼品套装", image: "home-project-etsy-realtor-closing-gift-set.webp", material: "Wood, acrylic, leather, metal & glass", materialZh: "木材、亚克力、皮革、金属与玻璃", price: 139, margin: 64, machine: "xrf", useCase: "Client closing gifts and brokerage programs", useCaseZh: "交房客户礼物与房产经纪项目" , monthlySales: 10 },
  { slug: "holiday-ornament-collection", title: "Holiday Ornament Collection", titleZh: "节日挂饰系列", image: "home-project-etsy-holiday-ornament-collection.webp", material: "Wood, acrylic, leather & glass", materialZh: "木材、亚克力、皮革与玻璃", price: 54, margin: 69, machine: "xrf", useCase: "Seasonal collections and gift bundles", useCaseZh: "季节性系列与礼品组合" , monthlySales: 18 },
  { slug: "wildflower-handled-tumbler", title: "Wildflower Handled Tumbler", titleZh: "野花图案手柄杯", image: "home-project-vertigo-wildflower-handled-tumbler.webp", material: "Powder-coated metal", materialZh: "粉末涂层金属", price: 55, margin: 70, machine: "vertigo", useCase: "Lifestyle collections and handled travel tumblers", useCaseZh: "生活方式系列与手柄旅行杯" },
  { slug: "mountain-rambler-tumbler", title: "Mountain Rambler Tumbler", titleZh: "山野漫游保温杯", image: "home-project-vertigo-mountain-rambler.webp", material: "Powder-coated metal", materialZh: "粉末涂层金属", price: 49, margin: 72, machine: "vertigo", useCase: "Outdoor gifts and team merchandise", useCaseZh: "户外礼物与团队周边" },
  { slug: "coastal-wide-mouth-bottle", title: "Coastal Wide-Mouth Bottle", titleZh: "海岸风宽口保温瓶", image: "home-project-vertigo-coastal-wide-mouth-bottle.webp", material: "Powder-coated metal", materialZh: "粉末涂层金属", price: 59, margin: 68, machine: "vertigo", useCase: "Outdoor lifestyle gifts and botanical collections", useCaseZh: "户外生活礼物与植物主题系列" },
  { slug: "celestial-flip-sip-bottle", title: "Celestial Flip-Sip Bottle", titleZh: "星空翻盖运动瓶", image: "home-project-vertigo-celestial-flip-sip-bottle.webp", material: "Powder-coated metal", materialZh: "粉末涂层金属", price: 59, margin: 69, machine: "vertigo", useCase: "Sports gifts and youth collections", useCaseZh: "运动礼物与年轻人系列" },
  { slug: "corporate-tumbler-batch", title: "Corporate Tumbler Batch", titleZh: "企业保温杯批量订单", image: "home-project-vertigo-corporate-tumbler-batch.webp", material: "Powder-coated metal", materialZh: "粉末涂层金属", price: 420, margin: 58, machine: "vertigo", useCase: "Corporate gifts and repeat event programs", useCaseZh: "企业礼赠与重复活动项目" , monthlySales: 4 },
  { slug: "event-tumbler-batch", title: "Event Tumbler Batch", titleZh: "活动保温杯批量订单", image: "home-project-vertigo-event-tumbler-batch.webp", material: "Powder-coated metal", materialZh: "粉末涂层金属", price: 450, margin: 60, machine: "vertigo", useCase: "Weddings, events and personalized group orders", useCaseZh: "婚礼、活动与团体个性化订单" , monthlySales: 4 },
];

const machines = {
  xrf: { name: "OneLaser XRF", destination: oneLaserDestinations.xrf },
  vertigo: { name: "OneLaser VertiGo", destination: oneLaserDestinations.vertigo },
  hydra: { name: "OneLaser Hydra 9 Gen 2", destination: oneLaserDestinations.hydra9Gen2 },
  cobra: { name: "OneLaser Cobra 10", destination: oneLaserDestinations.cobra10 },
} satisfies Record<ProjectMachineId, { name: string; destination: string }>;

function productionGuidance(seed: ProjectSeed) {
  if (seed.machine === "vertigo") return {
    process: "Rotary engraving",
    processZh: "旋转雕刻",
    setup: "Use a compatible rotary fixture and validate artwork alignment on the exact blank before production.",
    setupZh: "使用适配的旋转夹具，并在正式生产前用同款坯件验证图案对位。",
  };
  if (seed.material.toLowerCase().includes("glass")) return {
    process: "Flat engraving and rotary glass etching",
    processZh: "平面雕刻与玻璃旋转蚀刻",
    setup: "Test every substrate separately; cylindrical glassware needs a stable rotary setup.",
    setupZh: "不同材料需分别测试；圆柱形玻璃器皿需要稳定的旋转夹具。",
  };
  if (seed.machine === "hydra") return {
    process: "Production cutting and engraving",
    processZh: "生产级切割与雕刻",
    setup: "Validate material thickness, working area and repeatable fixtures before batch production.",
    setupZh: "批量生产前需验证材料厚度、加工幅面与可重复使用的定位夹具。",
  };
  if (seed.machine === "cobra") return {
    process: "Cut and engrave",
    processZh: "切割与雕刻",
    setup: "Confirm the material is laser-compatible; assembly, mounting and finishing are separate steps.",
    setupZh: "先确认材料适合激光加工；组装、安装与表面处理需作为独立工序。",
  };
  return {
    process: "Precision engraving",
    processZh: "高精度雕刻",
    setup: "Test settings on the exact material and keep finishing, assembly and packaging in the cost model.",
    setupZh: "请在同款材料上测试参数，并把后处理、组装和包装计入成本模型。",
  };
}

export const makerProjects: MakerProject[] = seeds.map((seed) => {
  const guidance = productionGuidance(seed);
  const machine = machines[seed.machine];
  const grossProfit = seed.price * (seed.margin / 100);
  return {
    ...seed,
    ...guidance,
    imagePath: `/images/project-library/${seed.image}`,
    machineName: machine.name,
    machineUrl: buildOneLaserUrl(machine.destination, {
      campaign: "equipment_match",
      content: `project_${seed.slug}`,
      placement: "project_library",
    }),
    grossProfit,
    estimatedMonthlyGrossProfit: grossProfit * (seed.monthlySales ?? 24),
  };
});

export const makerProjectBySlug = Object.fromEntries(makerProjects.map((project) => [project.slug, project])) as Record<string, MakerProject>;

export const projectMaterialFilters = ["All", "Wood", "Acrylic", "Leather", "Metal", "Glass"] as const;

export function projectMatchesMaterial(project: MakerProject, filter: typeof projectMaterialFilters[number]) {
  if (filter === "All") return true;
  return project.material.toLowerCase().includes(filter.toLowerCase());
}
