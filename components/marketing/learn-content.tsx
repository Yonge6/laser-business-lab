"use client";

import Link from "next/link";
import { ArrowRight, Calculator, CheckCircle, Factory, Lightbulb, Target } from "@phosphor-icons/react";
import { useLanguage } from "@/components/providers/language-provider";

const principles = [
  {
    icon: Calculator,
    title: "Count contribution, not revenue",
    titleZh: "先算贡献毛利，不只看营业额",
    body: "Selling price − material − selling fees − variable labor is the money each order contributes toward fixed costs and profit.",
    bodyZh: "售价减去材料、平台费用和单件人工，才是每个订单真正能覆盖固定成本并形成利润的钱。",
  },
  {
    icon: Target,
    title: "Prove demand before buying speed",
    titleZh: "先验证需求，再购买速度",
    body: "Ten paid orders teach you more than a hundred likes. Validate the buyer and price before upgrading equipment.",
    bodyZh: "10 个真实付费订单比 100 个点赞更有价值。先确认谁会买、愿意付多少钱，再升级设备。",
  },
  {
    icon: Factory,
    title: "Treat time as a production cost",
    titleZh: "把时间当成生产成本",
    body: "Track hands-on minutes separately from machine time. Your bottleneck—not the machine brochure—decides capacity.",
    bodyZh: "把人工操作时间与机器运行时间分开记录。真正决定产能的是你的瓶颈，而不是设备宣传参数。",
  },
];

const guides = [
  {
    id: "money",
    number: "01",
    title: "Make money",
    titleZh: "开始赚钱",
    summary: "Build a price and profit model before you scale the product.",
    summaryZh: "先建立售价与利润模型，再决定是否扩大这个产品。",
    href: "/calculator/laser-roi",
    action: "Test your numbers",
    actionZh: "测算你的商业数字",
    lessons: [
      {
        question: "How much can a maker business make?",
        questionZh: "Maker 生意能赚多少钱？",
        answer: "Use monthly operating profit: paid orders × contribution per order − monthly fixed costs. A $32 tumbler with $8.20 material starts with $23.80 gross profit before fees, labor, failed pieces, and marketing.",
        answerZh: "用“月经营利润＝付费订单数 × 单笔贡献毛利－月固定成本”计算。售价 $32、材料 $8.20 的保温杯，起始单件毛利是 $23.80；之后还要扣平台费、人工、报废与营销。",
        takeaway: "Model 20, 50, and 100 monthly orders—never only the best case.",
        takeawayZh: "至少测算每月 20、50、100 单三个情景，不只看最好情况。",
      },
      {
        question: "How should you price a product?",
        questionZh: "激光、3D 打印与热压产品如何定价？",
        answer: "Set a floor from every variable cost, then test three customer-facing prices. Personalization, faster delivery, premium materials, and bundles should each have a visible price—not be given away inside one base price.",
        answerZh: "先用全部变动成本确定价格底线，再测试三个面向顾客的价格。个性化、加急、材料升级与组合套装都应单独体现价值，不要全部塞进一个基础价免费赠送。",
        takeaway: "Keep a base offer, a popular bundle, and a premium option.",
        takeawayZh: "保留基础款、主推组合与高端款三个清楚的价格层级。",
      },
      {
        question: "What should you sell first?",
        questionZh: "第一款 Maker 产品应该卖什么？",
        answer: "Choose a standard blank or repeatable file, one obvious buyer, a result that photographs well, and a production cycle you can repeat. Your first product is a learning vehicle, not your forever catalog.",
        answerZh: "优先选择标准化坯料或可重复文件、明确的一个买家、容易拍出效果、且能稳定复做的产品。第一款产品是用来学习市场的，不必成为永久目录。",
        takeaway: "Start with one buyer, one use case, and one sales channel.",
        takeawayZh: "先锁定一个买家、一个使用场景、一个销售渠道。",
      },
    ],
  },
  {
    id: "path",
    number: "02",
    title: "Choose a making path",
    titleZh: "选择制作路径",
    summary: "Let the product and order pattern choose the process—not the other way around.",
    summaryZh: "让产品和订单方式决定工艺，而不是先买机器再找产品。",
    href: "/calculator/machine-finder",
    action: "Match equipment",
    actionZh: "匹配生产设备",
    lessons: [
      {
        question: "Laser, 3D print, or heat press?",
        questionZh: "激光、3D 打印与热压转印如何选择？",
        answer: "Laser is strong for fast personalization and flat-part cutting; 3D printing wins when geometry or function creates the value; heat press is a lower-entry path for apparel, totes, teams, and event graphics.",
        answerZh: "激光适合快速个性化与板材切割；当造型或功能本身创造价值时，3D 打印更合适；热压适合服装、托特包、团队和活动图案，入门门槛也更低。",
        takeaway: "Compare the same product idea across setup time, active labor, finish, and selling price.",
        takeawayZh: "用设置时间、主动人工、成品效果和可接受售价比较同一个产品创意。",
      },
      {
        question: "Which laser path fits the job?",
        questionZh: "哪种激光路线适合这类订单？",
        answer: "For drinkware and fast engraving, prioritize rotary workflow and cycle time. For acrylic and wood products, prioritize material compatibility, work area, extraction, and repeatable positioning before headline wattage.",
        answerZh: "杯类与快速雕刻优先看旋转流程和单件周期；亚克力与木制品优先看材料兼容、工作幅面、排烟和重复定位，再看功率数字。",
        takeaway: "Ask what the slowest repeated step is before selecting a machine.",
        takeawayZh: "选设备前，先找出每一单都会重复出现的最慢步骤。",
      },
      {
        question: "What setup fits personalized textiles?",
        questionZh: "个性化布艺适合什么设备方案？",
        answer: "A reliable press, a repeatable transfer source, and a small set of proven blanks matter more than a huge catalog. Start with totes or one garment shape, document temperature, pressure, time, and wash results.",
        answerZh: "稳定的热压机、可靠的转印来源和少量验证过的坯料，比一开始做庞大目录更重要。可先从托特包或一种服装版型开始，记录温度、压力、时间与水洗结果。",
        takeaway: "Turn every successful sample into a saved production recipe.",
        takeawayZh: "把每次成功打样都变成可复用的生产配方。",
      },
    ],
  },
  {
    id: "production",
    number: "03",
    title: "Grow production",
    titleZh: "扩大生产",
    summary: "Scale the repeatable system first; buy capacity only when the numbers prove the bottleneck.",
    summaryZh: "先扩大可重复的系统；只有数字证明瓶颈后，才购买更多产能。",
    href: "/calculator",
    action: "Open the business toolkit",
    actionZh: "打开商业工具箱",
    lessons: [
      {
        question: "How do you reduce setup time?",
        questionZh: "如何减少设置时间？",
        answer: "Standardize files, blank placement, settings, naming, and inspection. Photograph the approved setup and keep a one-page job card so the next batch begins from a known state.",
        answerZh: "统一文件、坯料定位、参数、命名和检验方法。拍下通过确认的设置，保留一页式工单，让下一批从已知状态开始。",
        takeaway: "Measure setup minutes before trying to make the machine run faster.",
        takeawayZh: "优化机器速度前，先测量每批订单花在设置上的分钟数。",
      },
      {
        question: "How do you batch without quality drift?",
        questionZh: "如何批量生产而不降低质量？",
        answer: "Approve one golden sample, inspect at fixed intervals, isolate rejects immediately, and record the cause. Small batches with checkpoints are safer than one long unattended run.",
        answerZh: "先确认一个黄金样，按固定间隔抽检，发现不良品立即隔离并记录原因。带检查点的小批次，比一次长时间无人看管的生产更安全。",
        takeaway: "Define pass/fail before the batch begins—not after a customer complains.",
        takeawayZh: "开批前就写清合格与不合格标准，不要等客户投诉后再判断。",
      },
      {
        question: "When should you upgrade equipment?",
        questionZh: "什么时候值得升级设备？",
        answer: "Upgrade when proven demand is being delayed by one measured bottleneck and the additional monthly contribution can repay the equipment inside your acceptable window. Faster is valuable only when orders use that speed.",
        answerZh: "当真实需求被一个可测量的瓶颈拖慢，且新增月贡献毛利能在可接受周期内覆盖设备投资时，再升级。只有订单真正用得上，速度才有价值。",
        takeaway: "Compare payback under current, expected, and stress-test order volume.",
        takeawayZh: "分别用当前、预期和压力测试订单量比较回本周期。",
      },
    ],
  },
];

export function LearnContent() {
  const { locale } = useLanguage();
  const zh = locale === "zh";

  return (
    <div className="learn-content shell">
      <section className="learn-principles" aria-labelledby="learn-principles-title">
        <header>
          <p className="eyebrow">{zh ? "先记住这三条" : "THREE RULES FIRST"}</p>
          <h2 id="learn-principles-title">{zh ? "Maker 赚钱不是猜，是一组可以验证的数字。" : "A maker business is not a guess. It is a set of numbers you can test."}</h2>
        </header>
        <div>
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <article key={principle.title}>
                <Icon weight="bold" />
                <h3>{zh ? principle.titleZh : principle.title}</h3>
                <p>{zh ? principle.bodyZh : principle.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="learn-guides" aria-label={zh ? "Maker 商业指南" : "Maker business guides"}>
        {guides.map((guide) => (
          <article className="learn-guide" id={guide.id} key={guide.id}>
            <header className="learn-guide-header">
              <span>{guide.number}</span>
              <div>
                <p className="eyebrow">{zh ? "实战指南" : "FIELD GUIDE"}</p>
                <h2>{zh ? guide.titleZh : guide.title}</h2>
                <p>{zh ? guide.summaryZh : guide.summary}</p>
              </div>
            </header>
            <div className="learn-lessons">
              {guide.lessons.map((lesson, index) => (
                <section key={lesson.question}>
                  <span className="learn-lesson-index">{guide.number}.{index + 1}</span>
                  <h3>{zh ? lesson.questionZh : lesson.question}</h3>
                  <p>{zh ? lesson.answerZh : lesson.answer}</p>
                  <div><CheckCircle weight="fill" /><strong>{zh ? lesson.takeawayZh : lesson.takeaway}</strong></div>
                </section>
              ))}
            </div>
            <footer className="learn-guide-action">
              <Lightbulb weight="bold" />
              <span>{zh ? "下一步：把方法放进你自己的产品数字里。" : "Next: put the method into your own product numbers."}</span>
              <Link href={guide.href}>{zh ? guide.actionZh : guide.action}<ArrowRight weight="bold" /></Link>
            </footer>
          </article>
        ))}
      </section>
    </div>
  );
}
