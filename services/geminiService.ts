import { GoogleGenAI, Part } from "@google/genai";
import { PromptState, GenerativePart } from "../types";

// Helper to convert File to a GenerativePart object with base64 data and mimeType
export const fileToGenerativePart = async (file: File): Promise<GenerativePart> => {
  const mimeType = file.type;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result;
      
      if (typeof result === 'string') {
        const parts = result.split(',');
        if (parts.length > 1) {
          resolve({ mimeType, data: parts[1] });
        } else {
          reject(new Error("Invalid Data URL format produced by FileReader"));
        }
      } else {
        reject(new Error("Failed to read file: Result is null or not a string"));
      }
    };
    
    reader.onerror = (error) => reject(error);
    
    reader.readAsDataURL(file);
  });
};

export const generateDetailedPrompt = async (
  mainImagePart: GenerativePart,
  faceImagePart: GenerativePart | null,
  options: PromptState
): Promise<string> => {
  
  // Retrieve API Key from process.env (injected by Vite at build time)
  const apiKey = process.env.API_KEY;

  // Strict check to ensure the key exists and is not an empty string
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("Kunci API (API_KEY) tidak ditemukan atau kosong. Pastikan Environment Variable 'API_KEY' sudah diatur dengan benar di Vercel atau file .env.");
  }
  
  // Initialize the AI client with the valid API key
  const ai = new GoogleGenAI({ apiKey });
  
  // Construct the text instruction
  let userRequirements = "PENTING: Pengguna telah menentukan atribut berikut yang WAJIB ada dalam prompt akhir (jika nilai adalah 'default', analisis gambar asli):";
  
  if (options.gender !== 'default') userRequirements += `\n- Gender: ${options.gender}`;
  if (options.expression !== 'default') userRequirements += `\n- Expression: ${options.expression}`;
  if (options.shotType !== 'default') userRequirements += `\n- Shot Type: ${options.shotType}`;
  if (options.cameraAngle !== 'default') userRequirements += `\n- Camera Angle: ${options.cameraAngle}`;
  if (options.pose !== 'default') userRequirements += `\n- Pose: ${options.pose}`;
  if (options.background !== 'default') userRequirements += `\n- Background/Location: ${options.background}`;
  if (options.artStyle !== 'default') userRequirements += `\n- Art Style: ${options.artStyle}`;
  if (options.lighting !== 'default') userRequirements += `\n- Lighting: ${options.lighting}`;
  if (options.colorTone !== 'default') userRequirements += `\n- Color Tone: ${options.colorTone}`;
  if (options.additionalText) userRequirements += `\n- Tambahan Detail: ${options.additionalText}`;

  const prompt = `
    Bertindaklah sebagai "AI Prompt Engineer" profesional untuk Stable Diffusion dan Midjourney.
    
    Tugas Anda:
    1. Analisis gambar yang diunggah.
    2. Buatlah prompt gambar (Text-to-Image) dalam BAHASA INGGRIS yang sangat detail dan deskriptif.
    3. Prompt ini harus bisa menghasilkan ulang gambar karakter yang serupa dengan kualitas tinggi.
    
    ${userRequirements}
    
    Struktur Prompt yang diinginkan (output hanya prompt final dalam Bahasa Inggris, satu paragraf panjang atau dipisahkan koma):
    [Art Style/Medium], [Character Description & Gender], [Clothing & Accessories], [Face & Expression Details], [Pose & Action], [Background & Environment], [Lighting & Atmosphere], [Camera Settings/Technical Details].
    
    JANGAN memberikan penjelasan pengantar. Langsung berikan prompt Bahasa Inggrisnya.
  `;

  // Explicitly type the parts array for the SDK
  const parts: Part[] = [
    { text: prompt },
    {
      inlineData: {
        mimeType: mainImagePart.mimeType,
        data: mainImagePart.data
      }
    }
  ];

  if (faceImagePart) {
    parts.push({
      inlineData: {
        mimeType: faceImagePart.mimeType,
        data: faceImagePart.data
      }
    });
    parts.push({ text: "Gunakan gambar kedua sebagai referensi detail wajah khusus." });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: parts
      }
    });

    if (!response.text) {
        // Fallback checks just in case the getter fails but data exists
        const candidates = response.candidates;
        if (candidates && candidates.length > 0 && candidates[0].content && candidates[0].content.parts.length > 0) {
           return candidates[0].content.parts[0].text || "No text found in response part.";
        }
        return "Gagal menghasilkan prompt. Model tidak memberikan respons teks yang valid.";
    }
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};