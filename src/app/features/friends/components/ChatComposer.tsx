import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatComposerProps {
  onSend: (body: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatComposer({
  onSend,
  disabled = false,
  placeholder = 'Digite uma mensagem...',
}: ChatComposerProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  return (
    <div className="flex items-end gap-2 p-3 bg-white border-t border-gray-100">
      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder={placeholder}
        rows={1}
        className="flex-1 min-h-[44px] max-h-[120px] px-4 py-2.5 bg-muted rounded-xl border border-transparent focus:border-[#932d6f] focus:outline-none resize-none text-sm"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!text.trim() || disabled}
        className="flex-shrink-0 w-11 h-11 rounded-full bg-[#932d6f] text-white flex items-center justify-center hover:bg-[#83285f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Enviar"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
