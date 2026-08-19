"use client";

import { PaperPlaneTilt } from "@phosphor-icons/react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { readAttribution } from "@/lib/attribution/client";
import { trackEvent } from "@/lib/analytics/client";

export function EmailCapture({ tool, result }: { tool: string; result: string }) {
  const { locale } = useLanguage();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("sending");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, tool, result, attribution: readAttribution() }),
      });
      if (!response.ok) throw new Error("Unable to save email");
      setState("sent");
      await trackEvent("email_capture", { tool, recommendation: result });
    } catch {
      setState("error");
    }
  }

  return (
    <section className="email-capture">
      <p className="eyebrow">BONUS REWARD</p>
      <h3>{locale === "zh" ? "获取完整 Maker 商业报告" : "Want your full maker business report?"}</h3>
      <p>{locale === "zh" ? "保存你的数字、推荐路径和下一步实验。" : "Save your numbers, recommended path, and next experiment."}</p>
      {state === "sent" ? (
        <div className="form-success">{locale === "zh" ? "已保存。报告邮件功能将在下一阶段启用。" : "Saved. Email delivery will be activated in the next release."}</div>
      ) : (
        <form onSubmit={submit}>
          <label className="sr-only" htmlFor={`email-${tool}`}>Email</label>
          <input id={`email-${tool}`} type="email" required placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          <button className="button button-primary" disabled={state === "sending"}>{state === "sending" ? "…" : locale === "zh" ? "发送报告" : "Send my report"}<PaperPlaneTilt weight="bold" /></button>
        </form>
      )}
      {state === "error" ? <small className="form-error">{locale === "zh" ? "保存失败，请重试。" : "Could not save your email. Please try again."}</small> : null}
    </section>
  );
}
