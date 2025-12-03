// Next.js API Route Handler
export async function GET(request: Request) {
  return new Response(`Hello, from API! Method: ${request.method}`);
}
