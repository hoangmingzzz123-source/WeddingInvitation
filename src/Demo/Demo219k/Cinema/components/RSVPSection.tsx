import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Users, Ticket, User, MessageSquare } from 'lucide-react';
import { submitRSVPWithFallback } from '../../../../utils/rsvpSubmission';

export function RSVPSection() {
  const [formData, setFormData] = useState({
    name: '',
    guests: '1',
    attending: 'yes',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || parseInt(formData.guests) < 1) {
      setSubmitError('Vui lòng điền đầy đủ thông tin');
      setTimeout(() => setSubmitError(''), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await submitRSVPWithFallback({
        name: formData.name,
        attending: formData.attending === 'yes' ? 'yes' : 'no',
        guestCount: parseInt(formData.guests) || 1,
        message: formData.message || 'Không có lời nhắn',
        template: 'Cinema Wedding Demo',
      });

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', guests: '1', attending: 'yes', message: '' });
      }, 4000);
    } catch (error) {
      console.error('RSVP submission error:', error);
      setSubmitError('Có lỗi khi gửi xác nhận. Vui lòng thử lại.');
      setTimeout(() => {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', guests: '1', attending: 'yes', message: '' });
        }, 3000);
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#1C1C1C] via-[#2a1a1f] to-[#1C1C1C] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Dual spotlight effect */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.06, 0.1, 0.06]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/3 left-1/3 w-[700px] h-[700px] bg-[#C9A24D] blur-[200px] rounded-full"
      />
      <motion.div
        animate={{ 
          scale: [1.1, 0.9, 1.1],
          opacity: [0.05, 0.08, 0.05]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#C9A24D]/50 blur-[200px] rounded-full"
      />

      <div className="w-full flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-2xl w-full relative z-10"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-6"
          >
            <Ticket className="inline-block text-[#C9A24D]" size={56} />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-[#F6F1EB] text-4xl md:text-6xl tracking-[0.12em] mb-6 text-center font-light"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            XÁC NHẬN THAM DỰ
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.7 }}
            className="h-[2px] bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent mx-auto mb-16"
          />

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.9 }}
                onSubmit={handleSubmit}
                className="bg-gradient-to-br from-[#F6F1EB] via-[#F6F1EB]/98 to-[#F6F1EB]/95 rounded-3xl p-10 md:p-14 shadow-2xl border border-[#C9A24D]/20 relative z-10 max-w-2xl w-full backdrop-blur-sm"
              >
              {/* Name field */}
              <div className="mb-8">
                <label className="block text-[#5A1E2A] mb-3 tracking-[0.08em] text-lg font-medium" style={{ fontFamily: 'Lora, serif' }}>
                  Họ và Tên
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A1E2A]/60" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white border-2 border-[#C9A24D]/20 text-[#1C1C1C] focus:border-[#C9A24D] focus:outline-none focus:shadow-lg transition-all shadow-sm text-lg"
                    style={{ fontFamily: 'Lora, serif' }}
                    placeholder="Nhập họ và tên của bạn"
                    required
                  />
                </div>
              </div>

              {/* Attending field */}
              <div className="mb-8">
                <label className="block text-[#5A1E2A] mb-4 tracking-[0.08em] text-lg font-medium" style={{ fontFamily: 'Lora, serif' }}>
                  Bạn có tham dự không?
                </label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="attending"
                      value="yes"
                      checked={formData.attending === 'yes'}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="px-5 py-4 rounded-2xl bg-white border-2 border-[#C9A24D]/20 peer-checked:border-[#C9A24D] peer-checked:bg-[#C9A24D]/15 peer-checked:shadow-md text-center transition-all shadow-sm hover:border-[#C9A24D]/40">
                      <span className="text-lg font-medium" style={{ fontFamily: 'Lora, serif' }}>Có, tôi sẽ đến</span>
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="attending"
                      value="no"
                      checked={formData.attending === 'no'}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="px-5 py-4 rounded-2xl bg-white border-2 border-[#C9A24D]/20 peer-checked:border-[#C9A24D] peer-checked:bg-[#C9A24D]/15 peer-checked:shadow-md text-center transition-all shadow-sm hover:border-[#C9A24D]/40">
                      <span className="text-lg font-medium" style={{ fontFamily: 'Lora, serif' }}>Xin lỗi, không thể</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Guests field */}
              <div className="mb-8">
                <label className="block text-[#5A1E2A] mb-3 tracking-[0.08em] text-lg font-medium" style={{ fontFamily: 'Lora, serif' }}>
                  Số Lượng Khách
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A1E2A]/60" size={20} />
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white border-2 border-[#C9A24D]/20 text-[#1C1C1C] focus:border-[#C9A24D] focus:outline-none focus:shadow-lg transition-all shadow-sm text-lg appearance-none cursor-pointer"
                    style={{ fontFamily: 'Lora, serif' }}
                    required
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'người' : 'người'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message field */}
              <div className="mb-10">
                <label className="block text-[#5A1E2A] mb-3 tracking-[0.08em] text-lg font-medium" style={{ fontFamily: 'Lora, serif' }}>
                  Lời Nhắn (Tùy chọn)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 text-[#5A1E2A]/60" size={20} />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white border-2 border-[#C9A24D]/20 text-[#1C1C1C] focus:border-[#C9A24D] focus:outline-none focus:shadow-lg transition-all resize-none shadow-sm"
                    style={{ fontFamily: 'Lora, serif' }}
                    placeholder="Ghi chú đặc biệt (ăn chay, dị ứng thực phẩm...)"
                  />
                </div>
              </div>

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-red-100/90 border-2 border-red-300 rounded-xl text-red-700 text-center text-sm" style={{ fontFamily: 'Lora, serif' }}
                >
                  {submitError}
                </motion.div>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 rounded-full bg-gradient-to-r from-[#C9A24D] via-[#C9A24D] to-[#C9A24D]/80 text-[#1C1C1C] text-lg font-semibold hover:shadow-2xl hover:shadow-[#C9A24D]/50 transition-all duration-300 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Lora, serif' }}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {!isSubmitting && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                )}
                <span className="relative tracking-[0.15em] flex items-center justify-center gap-3">
                  <Ticket size={22} className="group-hover:rotate-12 transition-transform" />
                  {isSubmitting ? 'ĐANG GỬI...' : 'GỬI XÁC NHẬN'}
                </span>
              </motion.button>

              <p className="text-[#5A1E2A]/60 text-sm text-center mt-8 tracking-[0.05em]" style={{ fontFamily: 'Lora, serif' }}>
                Vui lòng xác nhận trước ngày 15.03.2026
              </p>
            </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="bg-gradient-to-br from-[#F6F1EB] to-[#F6F1EB]/95 rounded-3xl p-16 text-center shadow-2xl border border-[#C9A24D]/20 relative z-10 max-w-2xl w-full"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.8, delay: 0.1 }}
                  className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-[#C9A24D] to-[#C9A24D]/70 mb-8 shadow-xl"
                >
                  <Check className="text-[#1C1C1C]" size={56} strokeWidth={2.5} />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[#5A1E2A] text-4xl mb-3 tracking-[0.08em] font-light" style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Xác Nhận Thành Công!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-[#5A1E2A]/80 text-lg leading-relaxed" style={{ fontFamily: 'Lora, serif' }}
                >
                  Cảm ơn bạn đã xác nhận. Chúng tôi rất mong được gặp bạn!
                </motion.p>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100px' }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="h-[2px] bg-[#C9A24D] mx-auto mt-8"
                />
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </section>
  );
}