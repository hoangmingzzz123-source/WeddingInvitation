import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Send } from 'lucide-react';

interface GuestMessage {
  id: number;
  name: string;
  message: string;
  emoji: string;
}

export function GuestbookSection() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('❤️');
  const [showHearts, setShowHearts] = useState(false);
  const [messages, setMessages] = useState<GuestMessage[]>([
    { id: 1, name: 'Nguyễn Văn A', message: 'Chúc hai bạn hạnh phúc và trăm năm hạnh phúc!', emoji: '❤️' },
    { id: 2, name: 'Trần Thị B', message: 'Mãi mãi bên nhau nhé! Chúc mừng!', emoji: '💑' },
    { id: 3, name: 'Lê Thị C', message: 'Hạnh phúc mãi mãi bên nhau nha cả hai!', emoji: '💕' },
  ]);

  const emojis = ['❤️', '💑', '💕', '🎉', '🥂', '💐'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && message.trim()) {
      const newMessage: GuestMessage = {
        id: Date.now(),
        name: name.trim(),
        message: message.trim(),
        emoji: selectedEmoji,
      };
      setMessages([newMessage, ...messages]);
      setName('');
      setMessage('');
      setSelectedEmoji('❤️');
      
      // Show flying hearts animation
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 2000);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#5A1E2A] to-[#1C1C1C] py-20 px-6 relative overflow-hidden flex items-center justify-center">
      {/* Flying hearts animation */}
      {showHearts && (
        <>
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: typeof window !== 'undefined' ? window.innerWidth / 2 : 400,
                y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
                opacity: 1,
                scale: 0
              }}
              animate={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
                y: -100,
                opacity: 0,
                scale: 1
              }}
              transition={{ duration: 2, delay: i * 0.1 }}
              className="absolute text-4xl pointer-events-none z-50"
            >
              ❤️
            </motion.div>
          ))}
        </>
      )}

      <div className="w-full flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-4xl w-full"
        >
          {/* Title */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-6"
          >
            <Heart className="inline-block text-[#C9A24D]" size={48} fill="#C9A24D" />
          </motion.div>

          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-[#F6F1EB] text-3xl md:text-4xl tracking-[0.2em] mb-3 text-center"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            GỬI LỜI CHÚC
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-[#C9A24D] text-lg text-center mb-8"
            style={{ fontFamily: 'Lora, serif' }}
          >
            Đến cô dâu chú rể
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="h-[1px] bg-[#C9A24D] mx-auto mb-12"
          />

          {/* Form - Love Letter Style */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.1 }}
            onSubmit={handleSubmit}
            className="bg-[#F6F1EB] rounded-2xl p-6 md:p-10 mb-12 shadow-2xl max-w-2xl mx-auto border-2 border-[#C9A24D]/20"
          >
            <div className="mb-6">
              <label className="block text-[#5A1E2A] mb-2 tracking-[0.1em]" style={{ fontFamily: 'Lora, serif' }}>
                Tên của bạn
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-[#C9A24D]/30 text-[#1C1C1C] focus:border-[#C9A24D] focus:outline-none transition-colors shadow-sm"
                style={{ fontFamily: 'Lora, serif' }}
                placeholder="Nhập tên của bạn"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-[#5A1E2A] mb-2 tracking-[0.1em]" style={{ fontFamily: 'Lora, serif' }}>
                Lời chúc của bạn
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-[#C9A24D]/30 text-[#1C1C1C] focus:border-[#C9A24D] focus:outline-none transition-colors resize-none shadow-sm"
                style={{ fontFamily: 'Lora, serif' }}
                placeholder="Gửi lời chúc đến cô dâu chú rể..."
                required
              />
            </div>

            <div className="mb-8">
              <label className="block text-[#5A1E2A] mb-3 tracking-[0.1em]" style={{ fontFamily: 'Lora, serif' }}>
                Chọn Biểu Tượng
              </label>
              <div className="flex gap-3 flex-wrap">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center text-2xl transition-all ${
                      selectedEmoji === emoji
                        ? 'border-[#C9A24D] bg-[#C9A24D]/20 scale-110 shadow-lg'
                        : 'border-[#C9A24D]/30 hover:border-[#C9A24D]/60 hover:scale-105'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#C9A24D] to-[#C9A24D]/80 text-[#1C1C1C] hover:shadow-xl hover:shadow-[#C9A24D]/40 transition-all duration-300 flex items-center justify-center gap-3 group"
              style={{ fontFamily: 'Lora, serif' }}
            >
              <Send size={20} className="group-hover:scale-110 transition-transform" />
              <span className="tracking-[0.15em]">GỬI LỜI CHÚC</span>
            </button>
          </motion.form>

          {/* Messages Wall */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="grid md:grid-cols-2 gap-4 md:gap-6"
          >
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, rotate: index % 2 === 0 ? -1 : 1 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#F6F1EB] rounded-xl p-6 shadow-lg border-l-4 border-[#C9A24D] transform hover:scale-105 transition-transform"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{msg.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[#C9A24D] mb-2 tracking-[0.05em]" style={{ fontFamily: 'Lora, serif' }}>
                      {msg.name}
                    </p>
                    <p className="text-[#5A1E2A] leading-relaxed" style={{ fontFamily: 'Lora, serif' }}>
                      {msg.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}