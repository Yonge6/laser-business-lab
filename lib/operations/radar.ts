import operationsState from "@/content/operations/state.json";
import { opportunityById, type Opportunity } from "@/lib/opportunities/data";
import { opportunitySeoProfiles, seoPagePath, type OpportunitySeoProfile } from "@/lib/seo/opportunity-content";

export type RadarLens = "demand" | "price" | "validation" | "production" | "equipment" | "risk" | "review";
export type OperationsState = {
  version: number;
  timezone: string;
  lastRunDate: string;
  weekStarted: string;
  activeOpportunityId: string;
  activeLens: RadarLens;
  sequence: number;
  history: Array<{ weekStarted: string; opportunityId: string }>;
};

const siteUrl = "https://maker.wonderelian.com";
const activeOperationsState = operationsState as OperationsState;

function trackedUrl(path: string, source: string, medium: string, content: string) {
  const url = new URL(path, siteUrl);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", "maker_opportunity_radar");
  url.searchParams.set("utm_content", content);
  return url.toString();
}

export function getRadarBriefing(state: OperationsState, radarPath = "/radar") {
  const opportunity = opportunityById[state.activeOpportunityId];
  const profile = opportunitySeoProfiles[state.activeOpportunityId];
  if (!opportunity || !profile) throw new Error(`Unknown automated opportunity: ${state.activeOpportunityId}`);

  const marginRate = Math.round((opportunity.grossProfit / opportunity.sellingPrice) * 100);
  const daily = dailyCopy(state.activeLens, opportunity, profile, marginRate);
  const contentKey = `${state.lastRunDate}_${opportunity.id}_${state.activeLens}`;

  return {
    state,
    opportunity,
    profile,
    marginRate,
    daily,
    links: {
      radar: radarPath,
      idea: seoPagePath("idea", opportunity.id),
      profit: seoPagePath("profit", opportunity.id),
      equipment: seoPagePath("equipment", opportunity.id),
      calculator: `/calculator/laser-roi?product=${opportunity.id}`,
    },
    distribution: {
      youtube: trackedUrl(radarPath, "youtube", "organic_video", contentKey),
      pinterest: trackedUrl(radarPath, "pinterest", "organic_social", contentKey),
      reddit: trackedUrl(radarPath, "reddit", "community", contentKey),
      email: trackedUrl(radarPath, "email", "newsletter", contentKey),
    },
  };
}

export function getActiveRadarBriefing() {
  return getRadarBriefing(activeOperationsState);
}

export function getOperationsPayload() {
  const briefing = getActiveRadarBriefing();
  const { opportunity, profile, daily, distribution, state } = briefing;
  const number = (value: number) => `$${value.toFixed(2)}`;

  return {
    schemaVersion: 1,
    generatedFor: state.lastRunDate,
    timezone: state.timezone,
    cadence: { daily: "08:30 Asia/Shanghai", weeklyRadar: "Monday" },
    opportunity: {
      id: opportunity.id,
      title: opportunity.title,
      titleZh: opportunity.titleZh,
      score: opportunity.score,
      typicalPrice: opportunity.sellingPrice,
      materialCost: opportunity.materialCost,
      estimatedGrossProfit: opportunity.grossProfit,
      productionMinutes: opportunity.productionMinutes,
    },
    radar: {
      weekStarted: state.weekStarted,
      lens: state.activeLens,
      headline: daily.headline,
      headlineZh: daily.headlineZh,
      answer: daily.answer,
      answerZh: daily.answerZh,
      action: daily.action,
      actionZh: daily.actionZh,
      caveat: "Planning estimates only. Selling fees, labor, failed units, packaging, shipping, tax, and marketing are not included in gross profit.",
    },
    distribution: {
      youtubeShorts: [
        {
          hook: `Can ${opportunity.title.toLowerCase()} make money at ${number(opportunity.sellingPrice)}?`,
          beats: [`Material estimate: ${number(opportunity.materialCost)}`, `Starting gross profit: ${number(opportunity.grossProfit)}`, `First test: ${profile.validationPlan[0]}`],
          cta: `Run the free model: ${distribution.youtube}`,
        },
        {
          hook: `Do not buy equipment for ${opportunity.title.toLowerCase()} before checking this.`,
          beats: profile.equipmentCriteria,
          cta: `See the workflow-first match: ${distribution.youtube}`,
        },
        {
          hook: `A seven-day test for ${opportunity.title.toLowerCase()}.`,
          beats: profile.validationPlan,
          cta: `Use the full validation plan: ${distribution.youtube}`,
        },
      ],
      email: {
        subject: `Maker Opportunity Radar: ${opportunity.title}`,
        preheader: `${number(opportunity.grossProfit)} estimated gross profit per item before fees and labor.`,
        body: `${profile.marketAngle}\n\nThis week's action: ${daily.action}\n\nReview the assumptions and run your own numbers: ${distribution.email}`,
      },
      communityAnswer: `${profile.marketAngle} The current planning model starts at ${number(opportunity.sellingPrice)} listed price, ${number(opportunity.materialCost)} material cost, and ${number(opportunity.grossProfit)} gross profit before fees and labor. The safest next step is: ${profile.validationPlan[0]}. Full assumptions: ${distribution.reddit}`,
      links: distribution,
    },
  };
}

function dailyCopy(lens: RadarLens, opportunity: Opportunity, profile: OpportunitySeoProfile, marginRate: number) {
  const title = opportunity.title;
  const titleZh = opportunity.titleZh;
  const copies = {
    demand: {
      label: "DEMAND SIGNAL",
      labelZh: "需求信号",
      headline: `Who is most likely to buy ${title.toLowerCase()}?`,
      headlineZh: `谁最可能购买${titleZh}？`,
      answer: profile.buyer,
      answerZh: profile.buyerZh,
      action: `Choose one buyer segment and rewrite the offer only for that buyer. Seasonal window: ${profile.seasonalWindow}.`,
      actionZh: `只选择一个买家群体，围绕这个群体重写销售方案。季节窗口：${profile.seasonalWindowZh}。`,
    },
    price: {
      label: "PROFIT SIGNAL",
      labelZh: "利润信号",
      headline: `${title}: what remains after material?`,
      headlineZh: `${titleZh}扣除材料后能留下多少？`,
      answer: `At a $${opportunity.sellingPrice.toFixed(2)} typical price and $${opportunity.materialCost.toFixed(2)} material estimate, starting gross profit is $${opportunity.grossProfit.toFixed(2)} per item, or about ${marginRate}%.`,
      answerZh: `按 $${opportunity.sellingPrice.toFixed(2)} 典型售价和 $${opportunity.materialCost.toFixed(2)} 材料估算，起始单件毛利约为 $${opportunity.grossProfit.toFixed(2)}，毛利率约 ${marginRate}%。`,
      action: "Add marketplace fees, active labor, failed pieces, packaging, shipping, tax, and marketing before calling it profit.",
      actionZh: "把平台费、主动人工、报废、包装、物流、税费和营销加入模型后，再判断真实利润。",
    },
    validation: {
      label: "VALIDATION MISSION",
      labelZh: "验证任务",
      headline: `The smallest paid test for ${title.toLowerCase()}.`,
      headlineZh: `${titleZh}最小付费测试。`,
      answer: profile.validationPlan.join(" "),
      answerZh: profile.validationPlanZh.join("；"),
      action: "Measure paid orders, revisions, failures, and hands-on minutes. Likes are not demand proof.",
      actionZh: "记录付费订单、改稿、报废和主动人工分钟数；点赞不能证明需求。",
    },
    production: {
      label: "PRODUCTION SIGNAL",
      labelZh: "生产信号",
      headline: `Can ${title.toLowerCase()} be produced repeatedly?`,
      headlineZh: `${titleZh}能否稳定重复生产？`,
      answer: `The current planning cycle is ${opportunity.productionMinutes} minutes per item. The useful number is the slowest repeated step—not the machine brochure speed.`,
      answerZh: `当前规划制作周期为每件 ${opportunity.productionMinutes} 分钟。真正有用的数字是最慢的重复步骤，而不是设备宣传速度。`,
      action: "Time setup, active labor, machine time, finishing, packing, and rework separately on the next three units.",
      actionZh: "下一批 3 件产品分别记录设置、主动人工、机器运行、后处理、包装和返工时间。",
    },
    equipment: {
      label: "EQUIPMENT SIGNAL",
      labelZh: "设备信号",
      headline: `Choose equipment from the ${title.toLowerCase()} workflow.`,
      headlineZh: `从${titleZh}的工作流程反推设备。`,
      answer: profile.equipmentCriteria.join("; "),
      answerZh: profile.equipmentCriteriaZh.join("；"),
      action: "Verify the material, work area, safety, service, availability, and total operating cost before buying.",
      actionZh: "购买前核对材料、工作幅面、安全、服务、供货和总体运营成本。",
    },
    risk: {
      label: "RISK CHECK",
      labelZh: "风险检查",
      headline: `What can erase the apparent margin on ${title.toLowerCase()}?`,
      headlineZh: `什么会吞噬${titleZh}的表面毛利？`,
      answer: profile.risk,
      answerZh: profile.riskZh,
      action: "Put a dollar or minute estimate beside every hidden cost before accepting a batch order.",
      actionZh: "承接批量订单前，为每一项隐藏成本补上金额或时间估算。",
    },
    review: {
      label: "WEEKLY REVIEW",
      labelZh: "每周复盘",
      headline: `${title}: test the business before scaling it.`,
      headlineZh: `${titleZh}：扩大投入前，先验证商业模型。`,
      answer: profile.marketAngle,
      answerZh: profile.marketAngleZh,
      action: `Review demand ${opportunity.demand}/100, margin ${opportunity.margin}/100, speed ${opportunity.speed}/100, and the evidence collected from real paid tests.`,
      actionZh: `复盘需求 ${opportunity.demand}/100、利润 ${opportunity.margin}/100、速度 ${opportunity.speed}/100，以及真实付费测试获得的证据。`,
    },
  } satisfies Record<RadarLens, { label: string; labelZh: string; headline: string; headlineZh: string; answer: string; answerZh: string; action: string; actionZh: string }>;
  return copies[lens];
}
