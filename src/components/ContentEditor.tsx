import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import '../styles/quill.css';

const TiptapEditor = ({ content, onChange }: { content: string, onChange: (value: string) => void }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="tiptap-editor">
      <EditorContent editor={editor} />
    </div>
  );
};

export default function ContentEditor() {
  const [content, setContent] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'success' | 'error'>('loading');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/admin/content');
        const data = await response.json();
        setContent(data);
        setStatus('idle');
      } catch (err) {
        setStatus('error');
      }
    };
    fetchContent();
  }, []);

  const handleTiptapChange = (value: string, lang: string, ...path: string[]) => {
    const updatedContent = { ...content };
    let current = updatedContent;
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
    }
    current[lang] = value;
    setContent(updatedContent);
  };

  const handleInputChange = (value: string, lang: string, ...path: string[]) => {
    const updatedContent = { ...content };
    let current = updatedContent;
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
    }
    current[lang] = value;
    setContent(updatedContent);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('saving');
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content }),
      });
      if (response.ok) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 2000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'loading') return <div className="flex items-center justify-center h-64"><div className="neon-spinner"></div></div>;
  if (status === 'error') return <div className="text-red-500 p-4 bg-red-500/10 rounded-lg">An error occurred while loading content.</div>;
  if (!content) return null;

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' },
    { code: 'bn', name: 'Bangla' }
  ];

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-20"
    >
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-teal-400 border-b border-gray-800 pb-4">Hero Section</h2>
        <div className="space-y-8">
          {languages.map(lang => (
            <div key={`hero-title-${lang.code}`} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-400">{lang.name}</h3>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Title</label>
                <input 
                  type="text"
                  value={content.home.hero.title[lang.code]} 
                  onChange={(e) => handleInputChange(e.target.value, lang.code, 'home', 'hero', 'title')}
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Subtitle</label>
                <TiptapEditor
                  content={content.home.hero.subtitle[lang.code]}
                  onChange={(value) => handleTiptapChange(value, lang.code, 'home', 'hero', 'subtitle')}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-teal-400 border-b border-gray-800 pb-4">Services</h2>
        <div className="space-y-12">
          {content.services.map((service: any, index: number) => (
            <div key={`service-${index}`} className="p-6 bg-[#2a2a2a]/30 rounded-lg border border-gray-700 space-y-6">
              <h3 className="text-xl font-bold text-white">Service {index + 1}: {service.id}</h3>
              {languages.map(lang => (
                <div key={`service-${index}-${lang.code}`} className="space-y-4 border-l-2 border-teal-500/30 pl-4">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{lang.name}</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                    <input 
                      type="text"
                      value={service.title[lang.code]}
                      onChange={(e) => {
                        const newContent = {...content};
                        newContent.services[index].title[lang.code] = e.target.value;
                        setContent(newContent);
                      }}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <textarea 
                      value={service.description[lang.code]}
                      onChange={(e) => {
                        const newContent = {...content};
                        newContent.services[index].description[lang.code] = e.target.value;
                        setContent(newContent);
                      }}
                      rows={3}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-teal-400 border-b border-gray-800 pb-4">FAQs</h2>
        <div className="space-y-8">
          {content.faq.map((item: any, index: number) => (
            <div key={`faq-${index}`} className="p-6 bg-[#2a2a2a]/30 rounded-lg border border-gray-700 space-y-6">
              {languages.map(lang => (
                <div key={`faq-${index}-${lang.code}`} className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{lang.name}</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Question</label>
                    <input 
                      type="text"
                      value={item.question[lang.code]}
                      onChange={(e) => {
                        const newContent = {...content};
                        newContent.faq[index].question[lang.code] = e.target.value;
                        setContent(newContent);
                      }}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Answer</label>
                    <textarea 
                      value={item.answer[lang.code]}
                      onChange={(e) => {
                        const newContent = {...content};
                        newContent.faq[index].answer[lang.code] = e.target.value;
                        setContent(newContent);
                      }}
                      rows={2}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          type="submit" 
          disabled={status === 'saving'} 
          className="bg-teal-500 text-black font-bold py-4 px-12 rounded-full hover:bg-teal-400 transition-all duration-300 shadow-[0_0_20px_rgba(45,212,191,0.6)] hover:shadow-[0_0_30px_rgba(45,212,191,0.9)] disabled:bg-gray-600 transform hover:scale-105"
        >
          {status === 'saving' ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : (status === 'success' ? '✓ Changes Saved!' : 'Save All Changes')}
        </button>
      </div>
    </motion.form>
  );
}
