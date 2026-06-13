const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* =========================
   GENERATE INTERVIEW QUESTIONS
========================= */

const generateInterviewQuestions = async (
  role,
  difficulty
) => {
  try {

    const prompt = `
You are an expert technical interviewer.

Generate exactly 10 realistic interview questions.

Role:
${role}

Difficulty:
${difficulty}

Rules:
- Questions must match the role and difficulty.
- Questions should feel like real company interviews.
- Mix conceptual, practical, and scenario-based questions.
- Avoid duplicate questions.
- Keep questions concise and professional.
- Return ONLY a valid JSON array.
- No explanation.
- No markdown.

Example format:
[
  "Question 1",
  "Question 2"
]
`;

    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        model: "llama-3.3-70b-versatile",
      });

    const content =
      completion.choices[0]
        .message.content;

    const parsedQuestions =
      JSON.parse(content);

    return parsedQuestions;

  } catch (error) {

    console.log(error);

    return [
      "Tell me about yourself.",
      "Explain your recent project.",
      "What are your strengths?",
      "What challenges have you faced?",
      "Why should we hire you?",
    ];
  }
};

/* =========================
   EVALUATE ANSWERS
========================= */

const evaluateAnswer = async (
  question,
  answer
) => {

  try {

    const prompt = `
You are an expert AI interview evaluator with strict and realistic grading standards.

Evaluate the candidate’s answer carefully based on:
- Technical correctness
- Relevance to the question
- Depth of knowledge
- Clarity and structure
- Completeness of the explanation
- Communication quality

Important Evaluation Rules:
- Score strictly between 0 and 10.
- Do NOT inflate scores.
- Weak, vague, incorrect, copied, or irrelevant answers should receive low scores.
- Partially correct answers should receive medium scores.
- Only excellent, detailed, technically accurate, and well-structured answers should receive high scores (8+).
- Feedback must sound like a real interviewer’s response.
- Avoid fake praise, generic compliments, or overly positive wording.
- Be honest, analytical, and constructive.

Improvement Rules:
- Improvement must clearly explain HOW the candidate can improve.
- Mention missing concepts, weak explanations, lack of examples, communication issues, or technical gaps.
- If the answer is already strong, suggest advanced improvements like adding real-world examples, optimization techniques, edge cases, or deeper technical insights.
- Improvement should NEVER be empty or generic.
- Keep it concise but meaningful.

Question:
${question}

Answer:
${answer}

Return ONLY in this exact format:

Score: <number out of 10>
Feedback: <realistic interview feedback>
Improvement: <clear and actionable improvement suggestion>
`;

    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        model: "llama-3.3-70b-versatile",
      });

    return completion.choices[0].message.content;

  } catch (error) {

    console.log(error);

    return `
Score: No score available
Feedback: AI evaluation failed
Improvement: AI evaluation failed, Sorry, we couldn't evaluate this answer at the moment. Please try again later.
`;
  }
};



module.exports = {
  evaluateAnswer,
  generateInterviewQuestions,
};



// const Groq = require("groq-sdk");

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// const evaluateAnswer = async (
//   question,
//   answer
// ) => {
//   try {
//     const prompt = `
// You are an expert AI interview evaluator with strict and realistic grading standards.

// Evaluate the candidate’s answer carefully based on:
// - Technical correctness
// - Relevance to the question
// - Depth of knowledge
// - Clarity and structure
// - Completeness of the explanation
// - Communication quality

// Important Evaluation Rules:
// - Score strictly between 0 and 10.
// - Do NOT inflate scores.
// - Weak, vague, incorrect, copied, or irrelevant answers should receive low scores.
// - Partially correct answers should receive medium scores.
// - Only excellent, detailed, technically accurate, and well-structured answers should receive high scores (8+).
// - Feedback must sound like a real interviewer’s response.
// - Avoid fake praise, generic compliments, or overly positive wording.
// - Be honest, analytical, and constructive.

// Improvement Rules:
// - Improvement must clearly explain HOW the candidate can improve.
// - Mention missing concepts, weak explanations, lack of examples, communication issues, or technical gaps.
// - If the answer is already strong, suggest advanced improvements like adding real-world examples, optimization techniques, edge cases, or deeper technical insights.
// - Improvement should NEVER be empty or generic.
// - Keep it concise but meaningful.

// Question:
// ${question}

// Answer:
// ${answer}

// Return ONLY in this exact format:

// Score: <number out of 10>
// Feedback: <realistic interview feedback>
// Improvement: <clear and actionable improvement suggestion>
// `;

//     const completion =
//       await groq.chat.completions.create({
//         messages: [
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],

//         model: "llama-3.3-70b-versatile",
//       });

//     return completion.choices[0].message.content;

//   } catch (error) {
//     console.log(error);

//     return `
// Score: No score available
// Feedback: AI evaluation failed
// Improvement: AI evaluation failed , Sorry, we couldn't evaluate this answer at the moment. Please try again later.
// `;
//   }
// };

// module.exports = {
//   evaluateAnswer,
// };