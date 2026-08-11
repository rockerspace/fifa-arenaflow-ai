/**
 * AI Guardrails Engine for ArenaFlow AI
 * Performs real-time input validation to prevent prompt injection, jailbreaks,
 * abusive language, and off-topic requests.
 */

const STADIUM_TOPICS = [
  'seat', 'section', 'gate', 'ticket', 'row', 'concession', 'food', 'drink',
  'restroom', 'toilet', 'hydration', 'water', 'shuttle', 'bus', 'train', 'subway',
  'transit', 'parking', 'evacuate', 'emergency', 'help', 'wheelchair', 'sensory',
  'accessibility', 'medical', 'police', 'steward', 'bag', 'rule', 'policy', 'power bank',
  'powerbank', 'sustainability', 'recycle', 'cup', 'trash', 'waste', 'match', 'sport',
  'game', 'kickoff', 'stadium', 'arena', 'hello', 'hi', 'welcome', 'thanks', 'thank you'
];

const PROHIBITED_KEYWORDS = [
  'ignore previous instructions', 'system prompt', 'jailbreak', 'override rules',
  'bypass restrictions', 'act as a Developer', 'dan mode', 'ignore rules',
  'disregard boundaries', 'forget your instructions'
];

const PROFANITY_WORDS = [
  'abuse', 'fuck', 'shit', 'asshole', 'bitch', 'idiot', 'stupid', 'bastard'
];

export function validateInput(query) {
  const q = query.toLowerCase().trim();

  // 1. Check for Prompt Injection / Jailbreaks
  for (const pattern of PROHIBITED_KEYWORDS) {
    if (q.includes(pattern)) {
      return {
        isValid: false,
        reason: 'Prompt Injection / Jailbreak Attempt Detected',
        message: '🛡️ **Guardrail Alert**: Safety protocol triggered. Prompt override keywords are prohibited.'
      };
    }
  }

  // 2. Check for Profanity / Abusive Language
  for (const word of PROFANITY_WORDS) {
    if (q.includes(word)) {
      return {
        isValid: false,
        reason: 'Abusive / Harmful Language Detected',
        message: '🛡️ **Guardrail Alert**: Safety protocol triggered. Abusive, profane, or inappropriate language is blocked.'
      };
    }
  }

  // 3. Check for Off-Topic Requests (Topic Boundary Lock)
  // Ensure the query has at least one keyword related to stadium operations or sports
  const words = q.split(/[\s,?.!]+/);
  const isOnTopic = words.some(word => 
    STADIUM_TOPICS.some(topic => word === topic || word.startsWith(topic))
  );

  if (!isOnTopic && words.length > 2) {
    return {
      isValid: false,
      reason: 'Off-Topic Request Blocked',
      message: '🛡️ **Guardrail Alert**: Safety protocol triggered. The assistant only resolves topics related to stadium operations, concessions, ticketing, transit, rules, and accessibility.'
    };
  }

  return { isValid: true };
}
