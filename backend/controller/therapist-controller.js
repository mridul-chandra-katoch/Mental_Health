import { GoogleGenerativeAI } from '@google/generative-ai';

// Response cache with TTL (Time To Live)
const responseCache = new Map();
const CACHE_TTL = 3600000; // 1 hour cache
const CACHE_MAX_SIZE = 100; // Max 100 cached responses

// Request queue to handle concurrent requests
const requestQueue = [];
let isProcessing = false;

const getCacheKey = (message) => {
  return message.toLowerCase().trim().substring(0, 100);
};

const getCachedResponse = (message) => {
  const key = getCacheKey(message);
  const cached = responseCache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('✓ Cache hit for:', key);
    return cached.response;
  }
  
  if (cached) {
    responseCache.delete(key);
  }
  return null;
};

const setCachedResponse = (message, response) => {
  if (responseCache.size >= CACHE_MAX_SIZE) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }
  
  const key = getCacheKey(message);
  responseCache.set(key, {
    response,
    timestamp: Date.now()
  });
};

// Rate limiting per user (10 requests per minute)
const userRequestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS_PER_MINUTE = 10;

const isRateLimited = (userId) => {
  const now = Date.now();
  
  if (!userRequestCounts.has(userId)) {
    userRequestCounts.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  const userData = userRequestCounts.get(userId);
  
  if (now > userData.resetTime) {
    userRequestCounts.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (userData.count >= MAX_REQUESTS_PER_MINUTE) {
    return true;
  }
  
  userData.count++;
  return false;
};

export const therapistChat = async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }
    
    // Check cache first (saves API calls!)
    const cachedResponse = getCachedResponse(message);
    if (cachedResponse) {
      return res.json({ 
        response: cachedResponse,
        cached: true 
      });
    }
    
    // Check API key
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key not configured.' 
      });
    }
    
    // Rate limiting check
    const clientId = userId || req.ip;
    if (isRateLimited(clientId)) {
      return res.status(429).json({ 
        error: 'Please wait a moment. Rate limit: 10 messages per minute per user.' 
      });
    }
    
    // Generate response from Google API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You are a compassionate AI therapist. Respond with empathy and helpful suggestions.
Keep responses concise (2-3 paragraphs). Use clear formatting with line breaks.

User: ${message}
Therapist:`;
    
    try {
      const result = await model.generateContent(prompt);
      const aiMessage = (await result.response.text()).replace(/\*\*(.*?)\*\*/g, '$1').trim();
      
      // Cache the response
      setCachedResponse(message, aiMessage);
      
      res.json({ 
        response: aiMessage,
        cached: false 
      });
    } catch (apiError) {
      console.error('Google API Error:', apiError.message);
      
      // Fallback response if API fails
      const fallbackResponse = `I appreciate you sharing that with me. While I'm experiencing some technical difficulties right now, I want you to know that your feelings are valid and important. Here are some things that might help:

1. Take deep, slow breaths - breathing exercises can calm your nervous system
2. Talk to someone you trust about how you're feeling
3. Practice self-care activities that bring you comfort

Please try again in a moment, or reach out to a human counselor if you need immediate support. 💙`;
      
      res.json({ 
        response: fallbackResponse,
        fallback: true,
        cached: false
      });
    }
  } catch (error) {
    console.error('Therapist endpoint error:', error.message);
    res.status(500).json({ 
      error: 'An error occurred. Please try again.' 
    });
  }
};

