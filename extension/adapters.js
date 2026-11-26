'use strict';
// Conservative selectors: these are candidates, not a claim of live provider compatibility.
globalThis.SkillAdapters={
 chatgpt:{composer:["#prompt-textarea"],send:['button[data-testid="send-button"]','#composer-submit-button[aria-label="Send prompt"]'],user:['[data-message-author-role="user"]'],answer:['[data-message-author-role="assistant"]'],stop:['button[data-testid="stop-button"]','button[aria-label="Stop streaming"]']},
 claude:{composer:['[contenteditable="true"].ProseMirror'],send:['button[aria-label="Send message"]','button[data-testid="send-button"]'],user:['[data-testid="user-message"]'],answer:['[data-testid="assistant-message"]'],stop:['button[aria-label="Stop response"]','button[aria-label="Stop generating"]']},
 gemini:{composer:['rich-textarea [contenteditable="true"]'],send:['button[aria-label="Send message"]','button.send-button'],user:['user-query'],answer:['model-response'],stop:['button[aria-label="Stop response"]','button[aria-label="Stop generating"]']}
};
