export async function onRequestPost(context) {
  console.log(context.request)

  try {
    const { email } = await context.request.json()
    if (!email) {
      return new Response("Email is required", { status: 400 });
    }

    await addEmailToDatabase(email);

    return new Response("Email added to waitlist", { status: 200 });
  } catch (e) {
    return new Response(`Error adding email: ${e.message}`, { status: 500 });
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
  console.log('Running query:', query);
}
