const API_BASE_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || "";
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const INSTALL_ID_KEY = "sayved.installId";

export class SayvedApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "SayvedApiError";
    this.code = details.code || "API_ERROR";
    this.status = details.status || null;
    this.detail = details.detail || null;
  }
}

function normalizeBaseUrl() {
  return API_BASE_URL.replace(/\/+$/, "");
}

function getInstallId() {
  if (typeof window === "undefined") return "server-render";

  try {
    const existing = window.localStorage.getItem(INSTALL_ID_KEY);
    if (existing) return existing;

    const next =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `install-${Date.now()}`;
    window.localStorage.setItem(INSTALL_ID_KEY, next);
    return next;
  } catch {
    return "local-storage-unavailable";
  }
}

export function isApiConfigured() {
  return Boolean(normalizeBaseUrl());
}

export function getApiStatusLabel() {
  return isApiConfigured()
    ? "Connected to configured Edge Function base URL."
    : "Waiting for VITE_SUPABASE_FUNCTIONS_URL.";
}

function buildPath(endpoint) {
  return endpoint.samplePath || endpoint.path;
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function requestEndpoint(endpoint, payload) {
  const baseUrl = normalizeBaseUrl();

  if (!baseUrl) {
    throw new SayvedApiError(
      "Set VITE_SUPABASE_FUNCTIONS_URL to call this Edge Function.",
      { code: "API_NOT_CONFIGURED" },
    );
  }

  const path = buildPath(endpoint);
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = {
    "x-sayved-install-id": getInstallId(),
  };
  const options = {
    method: endpoint.method,
    headers,
  };

  if (ANON_KEY) headers.Authorization = `Bearer ${ANON_KEY}`;

  if (endpoint.method !== "GET") {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(payload || endpoint.payload || {});
  }

  const response = await fetch(url, options);
  const body = await parseResponse(response);

  if (!response.ok) {
    throw new SayvedApiError(
      body?.error?.message ||
        body?.message ||
        `Request failed (${response.status}).`,
      {
        code: body?.error?.code || body?.code || "EDGE_FUNCTION_ERROR",
        status: response.status,
        detail: body,
      },
    );
  }

  return body;
}

export function formatApiError(error) {
  if (error instanceof SayvedApiError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        status: error.status,
        detail: error.detail,
      },
    };
  }

  return {
    error: {
      code: "NETWORK_ERROR",
      message: error?.message || "The request could not be completed.",
    },
  };
}
