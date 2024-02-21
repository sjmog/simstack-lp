addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://simstack.io", // Change this to your domain
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
}

async function handleRequest(request) {
  if (request.method === "OPTIONS") {
    // Handle CORS preflight request
    return new Response(null, { headers: corsHeaders })
  }

  if (request.method === "POST") {
    // Check for CORS
    const origin = request.headers.get("Origin");
    if (!origin || origin !== "https://simstack.io") {
      return new Response("CORS header ‘Origin’ missing or incorrect", { status: 403 })
    }

    try {
      // Parse the request body to get the email
      const { email } = await request.json();
      if (!email) {
        return new Response("Email is required", { status: 400, headers: corsHeaders });
      }

      // Add email to your D1 database
      await addEmailToDatabase(email);

      return new Response("Email added to waitlist", { status: 200, headers: corsHeaders });
    } catch (e) {
      return new Response(`Error adding email: ${e.message}`, { status: 500, headers: corsHeaders });
    }
  } else {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }
}

async function addEmailToDatabase(email) {
  // Replace with your actual D1 database interaction logic
  // This is a placeholder function to illustrate the process
  const DATABASE_URL = "YOUR_D1_DATABASE_URL";
  const query = `INSERT INTO waitlist (email) VALUES (?)`;
  // Assuming you have a function to run this query against your D1 database
  // You might need to use D1 bindings or an external service to execute this SQL command
  await runQuery(DATABASE_URL, query, [email]);
}

// Placeholder for the actual query execution - you will need to implement this
// based on how you interact with your D1 database
async function runQuery(url, query, parameters) {
  // Use fetch API or D1 bindings to run your query against the database
  // This part of the code depends on your D1 setup and how you access it from Workers
}
