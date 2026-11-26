'use strict';
// Conservative selectors: these are candidates, not a claim of live provider compatibility.
globalThis.SkillAdapters={
 chatgpt:{composer:["#prompt-textarea"],send:['button[data-testid="send-button"]','#composer-submit-button[aria-label="Send prompt"]'],user:['[data-message-author-role="user"]'],answer:['[data-message-author-role="assistant"]'],stop:['button[data-testid="stop-button"]','button[aria-label="Stop streaming"]']},
 claude:{composer:['[contenteditable="true"].ProseMirror'],send:['button[aria-label="Send message"]','button[data-testid="send-button"]'],user:['[data-testid="user-message"]'],answer:['[data-testid="assistant-message"]'],stop:['button[aria-label="Stop response"]','button[aria-label="Stop generating"]']},
 gemini:{composer:['rich-textarea [contenteditable="true"]'],send:['button[aria-label="Send message"]','button.send-button'],user:['user-query'],answer:['model-response'],stop:['button[aria-label="Stop response"]','button[aria-label="Stop generating"]']},
 // Experimental, fail closed unless a unique composer and explicit send button are present.
 deepseek:{composer:['textarea#chat-input'],send:['button[aria-label="Send message"]','button[aria-label="Send"]'],user:['[data-message-author-role="user"]'],answer:['[data-message-author-role="assistant"]'],stop:['button[aria-label="Stop generating"]']},
 perplexity:{composer:['textarea[placeholder="Ask anything..."]','#ask-input[contenteditable="true"]'],send:['button[aria-label="Submit"]','button[aria-label="Send"]'],user:['[data-testid="user-query"]'],answer:['[data-testid="answer"]'],stop:['button[aria-label="Stop generating"]']},
 grok:{composer:['textarea[placeholder="Ask anything"]','[contenteditable="true"][data-placeholder="Ask anything"]'],send:['button[aria-label="Submit"]','button[aria-label="Send message"]'],user:['[data-message-author-role="user"]'],answer:['[data-message-author-role="assistant"]'],stop:['button[aria-label="Stop generating"]']},
 copilot:{composer:['textarea#userInput','textarea[data-testid="composer-input"]'],send:['button[aria-label="Submit message"]','button[aria-label="Send message"]'],user:['[data-testid="user-message"]'],answer:['[data-testid="assistant-message"]'],stop:['button[aria-label="Stop responding"]']}
};
