export const AI_COPILOT_ASK_EVENT = 'ai-copilot:ask';

export type AiCopilotAskEventDetail = {
  prompt: string;
};

export function askAiCopilot(prompt: string): void {
  const normalizedPrompt = prompt.trim();

  if (!normalizedPrompt) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<AiCopilotAskEventDetail>(AI_COPILOT_ASK_EVENT, {
      detail: { prompt: normalizedPrompt },
    }),
  );
}
