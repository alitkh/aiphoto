import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  label: string;
  subLabel?: string;
  image: string | null;
  onImageChange: (file: File | null) => void;
  id: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, subLabel, image, onImageChange, id }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex justify-between items-end">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        {subLabel && <span className="text-xs text-slate-500">{subLabel}</span>}
      </div>

      <div 
        className={`relative group border-2 border-dashed rounded-lg p-4 transition-all duration-300 h-48 flex items-center justify-center cursor-pointer overflow-hidden
          ${image ? 'border-purple-500 bg-slate-800' : 'border-slate-600 hover:border-purple-400 hover:bg-slate-800/50 bg-slate-900'}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
          id={id}
        />

        {image ? (
          <>
            <img src={image} alt="Preview" className="w-full h-full object-contain z-0" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
              <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">Ganti Gambar</span>
            </div>
            <button 
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full z-20 transition-colors"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="text-center flex flex-col items-center">
            <div className="bg-slate-800 p-3 rounded-full mb-3 text-purple-400 group-hover:text-purple-300 transition-colors">
              <Upload size={24} />
            </div>
            <p className="text-sm text-slate-400 font-medium">Klik untuk upload</p>
            <p className="text-xs text-slate-600 mt-1">JPG, PNG (Max 5MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;