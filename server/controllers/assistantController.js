import fetch from "node-fetch";

// Blog Writing Assistant Controller
export const generateContent = async (req, res) => {
  try {
    const { prompt, blogData } = req.body;

    // Construct the full prompt with blog context
    const fullPrompt = `You are Lilly, a professional blog writing assistant. The user is working on a blog with:
    Title: ${blogData?.title || "Not specified"}
    Category: ${blogData?.category || "Not specified"}
    Tags: ${blogData?.tags?.join(", ") || "None"}
    
    User's request: ${prompt}
    
    Provide detailed, actionable advice to improve their blog. Be specific with examples.`;

    const response = await fetch(
      `${process.env.Lilly_API_URL}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: fullPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "API request failed");
    }

    res.json({
      success: true,
      text:
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response generated",
    });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
