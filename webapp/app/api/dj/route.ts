export async function POST(req: Request) {
  const bodyText = await req.text();

  const params = new URLSearchParams(bodyText);
  const user = params.get("user");
  const pass = params.get("pass");

  console.log("Auth request:", {user, pass});

  // Replace with actual DB logic based on user credentials and
  // show table in db
  const data = {
    authenticated: true,
    meta: {
      title: "Test Title From Api",
      user: "Test User From API",
      timelimit: 60,
    }
  };

  return new Response(JSON.stringify(data), {
    status: data.authenticated ? 200 : 401,
    headers: {
      "Content-Type": "application/json",
    },
  });
}