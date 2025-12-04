import React, { useState, useEffect } from 'react';
import { Wand2, Copy, Check, Loader2, Sparkles } from 'lucide-react';
import FileUpload from './components/FileUpload';
import Dropdown from './components/Dropdown';
import { PromptState, INITIAL_PROMPT_STATE } from './types';
import {
  GENDER_OPTIONS,
  EXPRESSION_OPTIONS,
  SHOT_TYPE_OPTIONS,
  ANGLE_OPTIONS,
  POSE_OPTIONS,
  BACKGROUND_OPTIONS,
  ART_STYLE_OPTIONS,
  LIGHTING_OPTIONS,
  COLOR_TONE_OPTIONS
} from './constants';
import { generateDetailedPrompt, fileToGenerativePart } from './services/geminiService';

const App: React.FC = () => {
  // Image State
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [faceImageFile, setFaceImageFile] = useState<File | null>(null);
  const [faceImagePreview, setFaceImagePreview] = useState<string | null>(null);

  // Form State
  const [promptState, setPromptState] = useState<PromptState>(INITIAL_PROMPT_STATE);
  
  // UI State
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to manage Object URL lifecycle for memory safety
  useEffect(() => {
    let mainUrl = mainImagePreview;
    let faceUrl = faceImagePreview;

    return () => {
      if (mainUrl) URL.revokeObjectURL(mainUrl);
      if (faceUrl) URL.revokeObjectURL(faceUrl);
    };
  }, [mainImagePreview, faceImagePreview]);


  const handleMainImageChange = (file: File | null) => {
    setMainImageFile(file);
    if (mainImagePreview) {
      URL.revokeObjectURL(mainImagePreview); // Clean up previous URL
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setMainImagePreview(url);
    } else {
      setMainImagePreview(null);
    }
  };

  const handleFaceImageChange = (file: File | null) => {
    setFaceImageFile(file);
    if (faceImagePreview) {
      URL.revokeObjectURL(faceImagePreview); // Clean up previous URL
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setFaceImagePreview(url);
    } else {
      setFaceImagePreview(null);
    }
  };

  const handleDropdownChange = (key: keyof PromptState, value: string) => {
    setPromptState(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!mainImageFile) {
      setError("Mohon upload gambar model utama terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');

    try {
      const mainImagePart = await fileToGenerativePart(mainImageFile);
      const faceImagePart = faceImageFile ? await fileToGenerativePart(faceImageFile) : null;

      const result = await generateDetailedPrompt(mainImagePart, faceImagePart, promptState);
      setGeneratedPrompt(result);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan yang tidak diketahui.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 flex flex-col items-center">
      
      {/* Header */}
      <header className="max-w-6xl w-full mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-purple-900/30 rounded-full mb-4 border border-purple-500/30">
          <Sparkles className="text-purple-400 w-6 h-6 mr-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Generator Prompt Foto Model
          </h1>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Ubah gambar karakter menjadi prompt AI yang sangat detail. Kustomisasi pose, ekspresi, dan gaya sesuai keinginanmu.
        </p>
      </header>

      <main className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input (8 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-white border-b border-slate-800 pb-4">
              <span className="bg-purple-600 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3">1</span>
              Unggah Gambar & Pilih Opsi
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <FileUpload 
                id="main-image"
                label="Gambar Model Karakter (Wajib)" 
                subLabel="Analisis Pose & Pakaian"
                image={mainImagePreview} 
                onImageChange={handleMainImageChange} 
              />
              <FileUpload 
                id="face-image"
                label="Gambar Khusus Wajah (Opsional)" 
                subLabel="Referensi Detail Wajah"
                image={faceImagePreview} 
                onImageChange={handleFaceImageChange} 
              />
            </div>

            {/* Dropdowns Grid */}
            <div className="space-y-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Dropdown 
                  label="Jenis Kelamin" 
                  value={promptState.gender} 
                  options={GENDER_OPTIONS} 
                  onChange={(v) => handleDropdownChange('gender', v)} 
                />
                <Dropdown 
                  label="Ekspresi Wajah" 
                  value={promptState.expression} 
                  options={EXPRESSION_OPTIONS} 
                  onChange={(v) => handleDropdownChange('expression', v)} 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Dropdown 
                  label="Tipe Bidikan (Shot Type)" 
                  value={promptState.shotType} 
                  options={SHOT_TYPE_OPTIONS} 
                  onChange={(v) => handleDropdownChange('shotType', v)} 
                />
                <Dropdown 
                  label="Sudut Kamera" 
                  value={promptState.cameraAngle} 
                  options={ANGLE_OPTIONS} 
                  onChange={(v) => handleDropdownChange('cameraAngle', v)} 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Dropdown 
                  label="Pose Karakter" 
                  value={promptState.pose} 
                  options={POSE_OPTIONS} 
                  onChange={(v) => handleDropdownChange('pose', v)} 
                />
                <Dropdown 
                  label="Latar Belakang / Lokasi" 
                  value={promptState.background} 
                  options={BACKGROUND_OPTIONS} 
                  onChange={(v) => handleDropdownChange('background', v)} 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <Dropdown 
                  label="Gaya Seni" 
                  value={promptState.artStyle} 
                  options={ART_STYLE_OPTIONS} 
                  onChange={(v) => handleDropdownChange('artStyle', v)} 
                />
                <Dropdown 
                  label="Pencahayaan" 
                  value={promptState.lighting} 
                  options={LIGHTING_OPTIONS} 
                  onChange={(v) => handleDropdownChange('lighting', v)} 
                />
                 <Dropdown 
                  label="Tone Warna" 
                  value={promptState.colorTone} 
                  options={COLOR_TONE_OPTIONS} 
                  onChange={(v) => handleDropdownChange('colorTone', v)} 
                />
              </div>
            </div>

            {/* Additional Text */}
            <div className="mt-6">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                Deskripsi Tambahan (Opsional)
              </label>
              <textarea
                value={promptState.additionalText}
                onChange={(e) => handleDropdownChange('additionalText', e.target.value)}
                placeholder="Contoh: 'Rambut berwarna perak panjang', 'Memegang pedang bercahaya', 'Suasana melankolis'..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none min-h-[80px]"
              />
            </div>

             <div className="mt-8 flex justify-end">
               <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`
                  flex items-center justify-center px-8 py-3 rounded-lg font-bold text-white shadow-lg transition-all
                  ${isLoading 
                    ? 'bg-slate-700 cursor-not-allowed opacity-70' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/25 active:scale-95'
                  }
                `}
               >
                 {isLoading ? (
                   <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Sedang Menganalisis...
                   </>
                 ) : (
                   <>
                    <Wand2 className="mr-2" size={20} />
                    Buat Prompt Sekarang
                   </>
                 )}
               </button>
             </div>
             
             {error && (
               <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 text-red-200 text-sm rounded-lg">
                 {error}
               </div>
             )}
          </div>
        </section>

        {/* Right Column: Output (4 cols) */}
        <section className="lg:col-span-5">
           <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm sticky top-6 h-fit">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-white border-b border-slate-800 pb-4">
              <span className="bg-slate-700 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3">2</span>
              Hasil Prompt AI (English)
            </h2>

            <div className="relative">
              <div className={`
                w-full min-h-[300px] bg-slate-950 border rounded-xl p-4 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap
                ${generatedPrompt ? 'border-purple-500/50 shadow-inner' : 'border-slate-800 flex items-center justify-center text-slate-500 italic'}
              `}>
                {generatedPrompt || "Prompt hasil analisis dan kustomisasi akan muncul di sini. Prompt akan dibuat dalam Bahasa Inggris untuk hasil terbaik pada model AI Generatif (Stable Diffusion, Midjourney, dll)."}
              </div>

              {generatedPrompt && (
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg border border-slate-700 transition-all shadow-lg"
                  title="Copy to Clipboard"
                >
                  {isCopied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                </button>
              )}
            </div>

            <div className="mt-6 p-4 bg-indigo-900/20 rounded-lg border border-indigo-500/20">
              <h4 className="text-indigo-300 font-semibold text-sm mb-2">Tips Penggunaan:</h4>
              <ul className="text-xs text-indigo-200/70 space-y-1 list-disc list-inside">
                <li>Salin prompt di atas.</li>
                <li>Tempel (Paste) ke Midjourney (/imagine) atau Stable Diffusion.</li>
                <li>Jika hasil belum sesuai, ubah dropdown di sebelah kiri dan klik "Buat Prompt" lagi.</li>
              </ul>
            </div>
             
             <div className="mt-4 text-center text-xs text-slate-600">
               Powered by Alit
             </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;