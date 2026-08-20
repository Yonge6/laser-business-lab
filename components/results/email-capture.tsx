"use client";

import { PaperPlaneTilt } from "@phosphor-icons/react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { readAttribution } from "@/lib/attribution/client";
import { trackEvent } from "@/lib/analytics/client";

export function EmailCapture({ tool, result, reportPath }: { tool: string; result: string; reportPath?: string }) {
  const { locale } = useLanguage();
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "saved" | "error">("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("sending");
    try {
      const reportUrl = new URL(reportPath ?? window.location.href, window.location.origin).toString();
      const payload = { email, tool, result, reportUrl, locale, requestId: crypto.randomUUID(), company, attribution: readAttribution() };
      const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT;
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Unable to save email");
        setState("sent");
      } else {
        window.localStorage.setItem(`lbl_saved_report_${tool}`, JSON.stringify({ ...payload, savedAt: new Date().toISOString() }));
        setState("saved");
      }
      await trackEvent("email_capture", { tool, recommendation: result });
    } catch {
      setState("error");
    }
  }

  return (
    <section className="email-capture">
      <p className="eyebrow">{locale === "zh" ? "奖励任务" : "BONUS REWARD"}</p>
      <h3>{locale === "zh" ? "把当前结果发到邮箱" : "Email this result"}</h3>
      <p>{locale === "zh" ? "保存你的数字、推荐路径和下一步实验。" : "Keep your numbers, recommended path, and next experiment."}</p>
      {state === "sent" ? (
        <div className="form-success">{locale === "zh" ? "报告已发送，请检查收件箱或垃圾邮件。" : "Report sent. Check your inbox or spam folder."}</div>
      ) : state === "saved" ? (
        <div className="form-success">{locale === "zh" ? "结果已保存在此浏览器；邮件服务启用后才能发送。" : "Saved in this browser. Email delivery is not enabled yet."}</div>
      ) : (
        <form onSubmit={submit}>
          <label className="sr-only" htmlFor={`email-${tool}`}>{locale === "zh" ? "邮箱" : "Email"}</label>
          <input id={`email-${tool}`} type="email" required placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          <label className="form-honeypot" aria-hidden="true">Company<input tabIndex={-1} autoComplete="off" value={company} onChange={(event) => setCompany(event.target.value)} /></label>
          <button className="button button-primary" disabled={state === "sending"}>{state === "sending" ? "…" : locale === "zh" ? "发送报告" : "Send my report"}<PaperPlaneTilt weight="bold" /></button>
        </form>
      )}
      {state === "error" ? <small className="form-error">{locale === "zh" ? "保存失败，请重试。" : "Could not save your email. Please try again."}</small> : null}
    </section>
  );
}
