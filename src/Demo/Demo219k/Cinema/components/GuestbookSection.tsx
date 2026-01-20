import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [isSubmitted, setIsSubmitted] = useState(false);
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
      setIsSubmitted(true);
      
      // Show flying hearts animation
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 2000);
      
      // Reset form after success animation
      setTimeout(() => {
        setName('');
        setMessage('');
        setSelectedEmoji('❤️');
        setIsSubmitted(false);
      }, 2000);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#1C1C1C] via-[#2a1a1f] to-[#1C1C1C] py-20 px-6 relative overflow-hidden flex items-center justify-center">
      {/* Decorative spotlight */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.08, 0.05]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#C9A24D] blur-[200px] rounded-full"
      />

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

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-[#F6F1EB] text-4xl md:text-5xl tracking-[0.15em] mb-4 text-center font-light"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            GỬI LỜI CHÚC
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-[#C9A24D]/90 text-lg text-center mb-10 tracking-[0.08em]"
            style={{ fontFamily: 'Lora, serif' }}
          >
            Đến cô dâu chú rể
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.9 }}
            className="h-[2px] bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent mx-auto mb-14"
          />

          {/* Form - Love Letter Style */}
          {!isSubmitted ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.1 }}
              onSubmit={handleSubmit}
              className="bg-gradient-to-br from-[#F6F1EB] via-[#F8F4F0] to-[#F6F1EB]/95 rounded-3xl p-10 md:p-14 mb-16 shadow-2xl max-w-2xl mx-auto border border-[#C9A24D]/25 relative z-10 backdrop-blur-sm"
            >
              <div className="mb-8">
                <label className="block text-[#5A1E2A] mb-3 tracking-[0.08em] text-base font-semibold" style={{ fontFamily: 'Lora, serif' }}>
                  Tên của bạn
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/80 border-2 border-[#C9A24D]/25 text-[#1C1C1C] focus:border-[#C9A24D] focus:outline-none focus:shadow-xl focus:bg-white transition-all shadow-md placeholder-[#5A1E2A]/40"
                  style={{ fontFamily: 'Lora, serif' }}
                  placeholder="Nhập tên của bạn"
                  required
                />
              </div>

              <div className="mb-8">
                <label className="block text-[#5A1E2A] mb-3 tracking-[0.08em] text-base font-semibold" style={{ fontFamily: 'Lora, serif' }}>
                  Lời chúc của bạn
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full px-6 py-4 rounded-2xl bg-white/80 border-2 border-[#C9A24D]/25 text-[#1C1C1C] focus:border-[#C9A24D] focus:outline-none focus:shadow-xl focus:bg-white transition-all resize-none shadow-md placeholder-[#5A1E2A]/40"
                  style={{ fontFamily: 'Lora, serif' }}
                  placeholder="Gửi lời chúc đến cô dâu chú rể..."
                  required
                />
              </div>

              <div className="mb-10">
                <label className="block text-[#5A1E2A] mb-5 tracking-[0.08em] text-base font-semibold" style={{ fontFamily: 'Lora, serif' }}>
                  Chọn Biểu Tượng
                </label>
                <div className="flex gap-4 flex-wrap justify-center">
                  {emojis.map((emoji) => (
                    <motion.button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      whileHover={{ scale: 1.2, y: -4 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-3xl transition-all shadow-md ${
                        selectedEmoji === emoji
                          ? 'border-[#C9A24D] bg-[#C9A24D]/20 shadow-lg scale-110'
                          : 'border-[#C9A24D]/30 hover:border-[#C9A24D]/60 hover:shadow-lg bg-white/40'
                      }`}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                type="submit"
                className="w-full py-6 rounded-full bg-gradient-to-r from-[#C9A24D] via-[#D4B86A] to-[#C9A24D]/85 text-[#1C1C1C] text-base font-semibold hover:shadow-2xl hover:shadow-[#C9A24D]/60 transition-all duration-300 group relative overflow-hidden tracking-[0.12em]"
                style={{ fontFamily: 'Lora, serif' }}
                whileHover={{ y: -3 }}
                whileTap={{ y: -1 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative flex items-center justify-center gap-3">
                  <Send size={22} className="group-hover:rotate-12 transition-transform" />
                  GỬI LỜI CHÚC
                </span>
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-[#F6F1EB] to-[#F6F1EB]/95 rounded-3xl p-12 text-center shadow-2xl max-w-2xl mx-auto border border-[#C9A24D]/20 relative z-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="text-6xl mb-6"
              >
                ✓
              </motion.div>
              <h3 className="text-[#5A1E2A] text-3xl mb-2 tracking-[0.05em]" style={{ fontFamily: '"Playfair Display", serif' }}>
                Cảm Ơn Bạn!
              </h3>
              <p className="text-[#5A1E2A]/80" style={{ fontFamily: 'Lora, serif' }}>
                Lời chúc của bạn đã được ghi nhận.
              </p>
            </motion.div>
          )}

          {/* Messages Wall */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="grid md:grid-cols-2 gap-5 md:gap-7 relative z-10"
          >
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, rotate: index % 2 === 0 ? -1 : 1 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(201, 162, 77, 0.15)' }}
                  className="bg-gradient-to-br from-[#F6F1EB] to-[#F6F1EB]/90 rounded-2xl p-7 shadow-lg border-l-4 border-[#C9A24D] transition-all cursor-default"
                >
                  <div className="flex items-start gap-4">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="text-4xl flex-shrink-0"
                    >
                      {msg.emoji}
                    </motion.span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#C9A24D] mb-2 tracking-[0.05em] font-semibold" style={{ fontFamily: 'Lora, serif' }}>
                        {msg.name}
                      </p>
                      <p className="text-[#5A1E2A] leading-relaxed text-sm" style={{ fontFamily: 'Lora, serif' }}>
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}