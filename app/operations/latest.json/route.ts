import { getOperationsPayload } from "@/lib/operations/radar";

export const dynamic = "force-static";

export function GET() {
  return Response.json(getOperationsPayload(), {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}
