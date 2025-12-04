import { DropdownOption } from './types';

// Helper to create options easily
const createOptions = (opts: string[][]): DropdownOption[] => {
  return [
    { label: 'Analisis Awal (Otomatis)', value: 'default' },
    ...opts.map(([label, value]) => ({ label, value }))
  ];
};

export const GENDER_OPTIONS = createOptions([
  ['Laki-laki', 'Male'],
  ['Perempuan', 'Female'],
  ['Non-Binary / Androgynous', 'Androgynous'],
  ['Cyborg', 'Cyborg'],
  ['Monster / Creature', 'Creature']
]);

export const EXPRESSION_OPTIONS = createOptions([
  ['Senyum / Bahagia', 'Happy, smiling, cheerful'],
  ['Serius / Stoic', 'Serious, stoic expression, intense gaze'],
  ['Marah / Agresif', 'Angry, aggressive, shouting'],
  ['Sedih / Melankolis', 'Sad, melancholic, teary eyes'],
  ['Terkejut', 'Surprised, shocked, wide eyes'],
  ['Menggoda / Seductive', 'Seductive, alluring, biting lip'],
  ['Tenang / Damai', 'Calm, peaceful, closed eyes, meditative']
]);

export const SHOT_TYPE_OPTIONS = createOptions([
  ['Close-Up (Wajah)', 'Close-up shot, focus on face'],
  ['Medium Shot (Dada ke atas)', 'Medium shot, waist up'],
  ['Cowboy Shot (Paha ke atas)', 'Cowboy shot, knees up'],
  ['Full Body (Seluruh Badan)', 'Full body shot, wide shot'],
  ['Macro (Detail Mata/Benda)', 'Macro photography, extreme close-up']
]);

export const ANGLE_OPTIONS = createOptions([
  ['Eye Level (Sejajar)', 'Eye level angle'],
  ['Low Angle (Dari Bawah)', 'Low angle, looking up, imposing'],
  ['High Angle (Dari Atas)', 'High angle, looking down'],
  ['Dutch Angle (Miring)', 'Dutch angle, tilted frame, dynamic'],
  ['Selfie', 'Selfie angle, handheld camera']
]);

export const POSE_OPTIONS = createOptions([
  ['Berdiri Tegak', 'Standing straight, confident pose'],
  ['Duduk', 'Sitting, relaxed pose'],
  ['Berlari / Aksi', 'Running, dynamic action pose, motion blur'],
  ['Bersandar', 'Leaning against wall, casual pose'],
  ['Menoleh ke Belakang', 'Looking back over shoulder']
]);

export const BACKGROUND_OPTIONS = createOptions([
  ['Studio Polos', 'Simple studio background, solid color'],
  ['Cyberpunk City', 'Cyberpunk city street, neon lights, rain'],
  ['Alam / Hutan', 'Forest, nature, trees, sunlight filtering'],
  ['Interior Modern', 'Modern living room, luxury interior'],
  ['Reruntuhan / Post-Apoc', 'Ruins, post-apocalyptic, destroyed city'],
  ['Luar Angkasa', 'Outer space, stars, nebula']
]);

export const ART_STYLE_OPTIONS = createOptions([
  ['Realistis (Foto 8k)', 'Hyper-realistic, 8k, photorealistic, raw photo'],
  ['Anime / Manga', 'Anime style, cell shaded, manga illustration'],
  ['3D Render (Pixar/Disney)', '3D render, cgi, pixar style, unreal engine 5'],
  ['Digital Painting', 'Digital painting, concept art, smooth brushwork'],
  ['Cyberpunk / Synthwave', 'Cyberpunk aesthetic, synthwave colors, retro futurism'],
  ['Oil Painting', 'Oil painting, textured, classical art']
]);

export const LIGHTING_OPTIONS = createOptions([
  ['Natural (Matahari)', 'Natural lighting, sunlight, golden hour'],
  ['Studio Softbox', 'Studio lighting, softbox, professional lighting'],
  ['Cinematic / Dramatic', 'Cinematic lighting, dramatic shadows, chiaroscuro'],
  ['Neon / Colorful', 'Neon lighting, colorful rim lights, volumetric fog'],
  ['Dark / Low Key', 'Low key lighting, dark atmosphere, silhouette']
]);

export const COLOR_TONE_OPTIONS = createOptions([
  ['Vibrant / Colorful', 'Vibrant colors, saturated'],
  ['Black & White', 'Black and white, monochrome'],
  ['Sepia / Vintage', 'Sepia tone, vintage film look, grain'],
  ['Cool / Blue', 'Cool tones, blue atmosphere, cold'],
  ['Warm / Orange', 'Warm tones, orange atmosphere, cozy']
]);
