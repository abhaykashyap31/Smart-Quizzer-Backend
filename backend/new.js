const axios = require('axios');

// The input data for sentence similarity
const data = {
  inputs: {
    source_sentence: "[0,1]",
    sentences: ["[2,3]"]
  }
};

async function getSimilarityScore(data) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/sentence-transformers/paraphrase-MiniLM-L6-v2',
      data,
      {
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error('Error with Hugging Face API:', error.response?.data || error.message);
  }
}

// Call the function with the corrected data format
getSimilarityScore(data);
