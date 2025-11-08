require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt' });

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    const text = response.data.candidates[0].content.parts[0].text;
    res.json({ text });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: 'AI error' });
  }
});

app.post('/api/image', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt' });

  try {
    const formData = new URLSearchParams();
    formData.append('text', prompt);

    const response = await axios.post(
      'https://api.deepai.org/api/text2img',
      formData,
      { headers: { 'api-key': process.env.DEEPAI_API_KEY } }
    );
    const imageUrl = response.data.output_url;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Image error:', error.message);
    res.status(500).json({ error: 'Image generation failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on port ${port}`));
