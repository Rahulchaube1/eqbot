import { createFileRoute } from "@tanstack/solid-router";
import { installerResponse } from "../../../server/latest-download";

export const Route = createFileRoute("/download/$platform_/latest")({
  server: {
    handlers: {
      GET: ({ request, params }) => installerResponse(request, params.platform),
      HEAD: ({ request, params }) => installerResponse(request, params.platform),
    },
  },
});
