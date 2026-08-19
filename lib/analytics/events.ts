export type AnalyticsEventName =
  | "page_view"
  | "calculator_start"
  | "calculator_step_completed"
  | "calculator_complete"
  | "opportunity_finder_start"
  | "opportunity_finder_complete"
  | "machine_finder_start"
  | "machine_finder_complete"
  | "recommendation_view"
  | "recommendation_click"
  | "email_capture"
  | "share_result";

export type AnalyticsProperties = Record<string, unknown>;
