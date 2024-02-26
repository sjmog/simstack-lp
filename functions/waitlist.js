export async function onRequestPost(context) {
  try {
    const { email } = await context.request.json();
    if (!email) {
      return new Response("Email is required", { status: 400 });
    }

    const result = await upsertRecord({ email }, context.env);

    if (result.ok) {
      const json = await result.json();
      return Response.json({ id: json.records[0].id, email: email });
    } else {
      return new Response(`Error: ${result.statusText}`, {
        status: result.status,
      });
    }
  } catch (e) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
}

export async function onRequestPatch(context) {
  try {
    const { id, preference } = await context.request.json();
    if (!id) {
      return new Response("Airtable ID is required", { status: 400 });
    }

    const result = await updateRecord(id, { preference }, context.env);

    if (result.ok) {
      const json = await result.json();
      return Response.json({ id: json.records[0].id });
    } else {
      return new Response(`Error: ${result.statusText}`, {
        status: result.status,
      });
    }
  } catch (e) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
}

async function upsertRecord(body, env) {
  const result = await fetch(
    `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${encodeURIComponent(
      env.AIRTABLE_TABLE_NAME,
    )}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        performUpsert: {
          fieldsToMergeOn: ["email"],
        },
        records: [
          {
            fields: body,
          },
        ],
      }),
      headers: {
        Authorization: `Bearer ${env.AIRTABLE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );

  return result;
}

async function updateRecord(id, body, env) {
  const jsonBody = JSON.stringify({
    records: [
      {
        id: id,
        fields: body,
      },
    ],
  });

  console.log(jsonBody)

  const result = await fetch(
    `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${encodeURIComponent(
      env.AIRTABLE_TABLE_NAME,
    )}`,
    {
      method: "PATCH",
      body: jsonBody,
      headers: {
        Authorization: `Bearer ${env.AIRTABLE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );

  return result;
}
