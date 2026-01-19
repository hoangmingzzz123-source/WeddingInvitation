import { motion } from 'motion/react';
import { MessageCircle, Send, Heart } from 'lucide-react';
import { useState } from 'react';

interface Wish {
  id: number;
  name: string;
  message: string;
}

export function WishesSection() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([
    { id: 1, name: 'Nguyễn Văn A', message: 'Chúc hai bạn trăm năm hạnh phúc, bên nhau mãi mãi!' },
    { id: 2, name: 'Trần Thị B', message: 'Chúc mừng ngày vui của hai bạn. Hạnh phúc mãi bên nhau nhé!' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && message.trim()) {
      const newWish: Wish = {
        id: Date.now(),
        name: name.trim(),
        message: message.trim()
      };
      setWishes([newWish, ...wishes]);
      setName('');
      setMessage('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-b from-white to-[#FBF6EE] relative">
      {/* Subtle floating petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 20}%`,
              top: '100%'
            }}
            animate={{
              y: [0, -800],
              x: [0, Math.sin(i) * 30, 0],
              rotate: [0, 360],
              opacity: [0, 0.1, 0]
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <ellipse cx="10" cy="10" rx="4" ry="8" fill="#D4AF37" opacity="0.3" />
            </svg>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full"
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageCircle className="text-[#8B1E1E]" size={32} />
            <h2 className="text-[#8B1E1E]">Gửi Lời Chúc</h2>
          </div>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-[#D4AF37] mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name input */}
            <div>
              <label htmlFor="name" className="block text-[#3A2F2F] mb-2">
                Họ tên
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#FBF6EE] focus:border-[#D4AF37] focus:outline-none transition-colors bg-[#FBF6EE] text-[#3A2F2F]"
                placeholder="Nhập họ tên của bạn"
                required
              />
            </div>

            {/* Message textarea */}
            <div>
              <label htmlFor="message" className="block text-[#3A2F2F] mb-2">
                Lời chúc
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#FBF6EE] focus:border-[#D4AF37] focus:outline-none transition-colors bg-[#FBF6EE] text-[#3A2F2F] resize-none"
                placeholder="Gửi lời chúc đến cô dâu chú rể..."
                required
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#8B1E1E] text-white rounded-lg hover:bg-[#A73333] transition-colors shadow-md"
            >
              <Send size={20} />
              <span>Gửi lời chúc</span>
            </button>
            
            {/* Success message */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 p-3 bg-green-100 border-2 border-green-300 rounded-lg text-green-700"
              >
                <Heart size={20} fill="currentColor" />
                <span>Cảm ơn bạn đã gửi lời chúc!</span>
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Wishes list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <div className="text-center mb-6">
            <p className="text-[#3A2F2F]">
              {wishes.length} lời chúc
            </p>
          </div>

          {wishes.map((wish, index) => (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#D4AF37] relative"
            >
              {/* Heart decoration */}
              <div className="absolute top-4 right-4">
                <Heart className="text-[#8B1E1E]" size={20} fill="currentColor" />
              </div>

              <h4 className="text-[#8B1E1E] mb-2">{wish.name}</h4>
              <p className="text-[#3A2F2F] leading-relaxed pr-8">
                {wish.message}
              </p>

              {/* Decorative dots */}
              <div className="flex gap-1 mt-4">
                <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-[#8B1E1E] rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}