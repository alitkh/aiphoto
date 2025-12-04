export interface DropdownOption {
  label: string; // Indonesian label for UI
  value: string; // English value for Prompt
}

export interface PromptState {
  gender: string;
  expression: string;
  shotType: string;
  cameraAngle: string;
  pose: string;
  background: string;
  artStyle: string;
  lighting: string;
  colorTone: string;
  additionalText: string;
}

export interface GenerativePart {
  mimeType: string;
  data: string; // base64 data
}

export const INITIAL_PROMPT_STATE: PromptState = {
  gender: 'default',
  expression: 'default',
  shotType: 'default',
  cameraAngle: 'default',
  pose: 'default',
  background: 'default',
  artStyle: 'default',
  lighting: 'default',
  colorTone: 'default',
  additionalText: '',
};