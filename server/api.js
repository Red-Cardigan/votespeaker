import { Pool } from 'pg';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    // Ensure the messages parameter is structured correctly
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const generatedText = completion.choices[0].message.content;

    // Optionally, insert the prompt and response into your database
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await pool.query(
      'INSERT INTO votespeaker(prompt, response, created_at) VALUES($1, $2, NOW())',
      [prompt, generatedText]
    );

    // Return the generated text in the response
    res.status(200).json({ generatedText });

  } catch (error) {
    console.error('Error generating text:', error);
    res.status(500).json({ error: 'Failed to generate text' });
  }
}

// const generateTextCopy = async (prompt) => {
//   try {
//     // Ensure the messages parameter is structured correctly
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo-0125",
//       messages: [
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//     });


//   // Insert prompt and response into the database
//   await pool.query(
//     'INSERT INTO prompts_responses(prompt, response, created_at) VALUES($1, $2, NOW())',
//     [prompt, response]
//   );

//   return response;

// } catch (error) {
//   console.error('Error generating text or inserting into database:', error);
// }
// };

// export default generateTextCopy;
