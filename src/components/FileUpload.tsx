import { useState, DragEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud } from 'lucide-react';

export default function FileUpload({ endpoint }: { endpoint: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-teal-400 bg-teal-500/10' : 'border-gray-700'}`}>
        <UploadCloud className="mx-auto h-16 w-16 text-gray-500 mb-4" />
        <label htmlFor="file-upload" className="cursor-pointer font-semibold text-teal-400 hover:text-teal-300">
          <span>Select a file</span>
          <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
        </label>
        <p className="text-gray-500">or drag and drop</p>
      </div>

      {file && (
        <div className="mt-6 text-center">
          <p className="mb-4">Selected file: {file.name}</p>
          <button 
            onClick={handleUpload} 
            disabled={status === 'uploading'}
            className="bg-teal-500 text-black font-bold py-3 px-8 rounded-full hover:bg-teal-400 transition-all duration-300 disabled:bg-gray-600"
          >
            {status === 'uploading' ? 'Uploading...' : 'Upload'}
          </button>
          {status === 'success' && <p className="text-green-500 mt-4">File uploaded successfully!</p>}
          {status === 'error' && <p className="text-red-500 mt-4">Upload failed. Please try again.</p>}
        </div>
      )}
    </div>
  );
}
