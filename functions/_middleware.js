const ALLOWED_ORIGINS = [
  "https://simstack.io",
  "http://localhost:8788"
]

const allowedOrigin = (request) => {
  const requestOrigin = request.headers.get("Origin");

  if(ALLOWED_ORIGINS.includes(requestOrigin))
    return requestOrigin

  return "https://simstack.io"
}

const corsHeaders = (request) => {
  return({
    "Access-Control-Allow-Origin": allowedOrigin(request),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
  })
}

// Respond to OPTIONS method
export const onRequestOptions = async ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  });
};

export const onRequest = async (context) => {
  if(context.request.method === "POST") {
    const origin = context.request.headers.get("Origin");
    if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
      return new Response("CORS header ‘Origin’ missing or incorrect", { status: 403 })
    }
  }

  const response = await context.next();
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin(context.request));
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
};