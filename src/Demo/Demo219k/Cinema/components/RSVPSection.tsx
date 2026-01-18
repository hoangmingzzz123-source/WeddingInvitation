import React, { useState } from 'react';
import { motion } from 'motion/react';
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
    <section className="min-h-screen bg-[#1C1C1C] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Central spotlight */}
      <motion.div
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.08, 0.12, 0.08]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C9A24D] blur-[150px] rounded-full"
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
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-[#F6F1EB] text-3xl md:text-5xl tracking-[0.2em] mb-12 text-center"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            XÁC NHẬN THAM DỰ
          </motion.h3>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '120px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="h-[1px] bg-[#C9A24D] mx-auto mb-12"
          />

          {!isSubmitted ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.9 }}
              onSubmit={handleSubmit}
              className="bg-gradient-to-br from-[#F6F1EB] to-[#F6F1EB]/95 rounded-2xl p-8 md:p-12 shadow-2xl border-2 border-[#C9A24D]/30"
            >
              {/* Name field */}
              <div className="mb-6">
                <label className="block text-[#5A1E2A] mb-3 tracking-[0.1em] text-lg" style={{ fontFamily: 'Lora, serif' }}>
                  Họ và Tên *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A1E2A]/60" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-14 pr-5 py-4 rounded-xl bg-white border-2 border-[#C9A24D]/30 text-[#1C1C1C] focus:border-[#C9A24D] focus:outline-none transition-all shadow-sm text-lg"
                    style={{ fontFamily: 'Lora, serif' }}
                    placeholder="Nhập họ và tên của bạn"
                    required
                  />
                </div>
              </div>

              {/* Attending field */}
              <div className="mb-6">
                <label className="block text-[#5A1E2A] mb-3 tracking-[0.1em] text-lg" style={{ fontFamily: 'Lora, serif' }}>
                  Bạn có tham dự không? *
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
                    <div className="px-5 py-4 rounded-xl bg-white border-2 border-[#C9A24D]/30 peer-checked:border-[#C9A24D] peer-checked:bg-[#C9A24D]/10 text-center transition-all shadow-sm">
                      <span className="text-lg" style={{ fontFamily: 'Lora, serif' }}>Có, tôi sẽ đến</span>
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
                    <div className="px-5 py-4 rounded-xl bg-white border-2 border-[#C9A24D]/30 peer-checked:border-[#C9A24D] peer-checked:bg-[#C9A24D]/10 text-center transition-all shadow-sm">
                      <span className="text-lg" style={{ fontFamily: 'Lora, serif' }}>Xin lỗi, không thể</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Guests field */}
              <div className="mb-6">
                <label className="block text-[#5A1E2A] mb-3 tracking-[0.1em] text-lg" style={{ fontFamily: 'Lora, serif' }}>
                  Số Lượng Khách *
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A1E2A]/60" size={20} />
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full pl-14 pr-5 py-4 rounded-xl bg-white border-2 border-[#C9A24D]/30 text-[#1C1C1C] focus:border-[#C9A24D] focus:outline-none transition-all shadow-sm text-lg appearance-none cursor-pointer"
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
              <div className="mb-8">
                <label className="block text-[#5A1E2A] mb-3 tracking-[0.1em] text-lg" style={{ fontFamily: 'Lora, serif' }}>
                  Lời Nhắn (Tùy chọn)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 text-[#5A1E2A]/60" size={20} />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full pl-14 pr-5 py-4 rounded-xl bg-white border-2 border-[#C9A24D]/30 text-[#1C1C1C] focus:border-[#C9A24D] focus:outline-none transition-all resize-none shadow-sm"
                    style={{ fontFamily: 'Lora, serif' }}
                    placeholder="Ghi chú đặc biệt (ăn chay, dị ứng thực phẩm...)"
                  />
                </div>
              </div>

              {submitError && (
                <div className="mb-4 p-4 bg-red-100 border-2 border-red-300 rounded-xl text-red-700 text-center" style={{ fontFamily: 'Lora, serif' }}>
                  {submitError}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 rounded-full bg-gradient-to-r from-[#C9A24D] via-[#C9A24D] to-[#C9A24D]/80 text-[#1C1C1C] text-lg hover:shadow-2xl hover:shadow-[#C9A24D]/50 transition-all duration-300 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Lora, serif' }}
              >
                {!isSubmitting && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                )}
                <span className="relative tracking-[0.15em] flex items-center justify-center gap-3">
                  <Ticket size={20} className="group-hover:rotate-12 transition-transform" />
                  {isSubmitting ? 'ĐANG GỬI...' : 'GỬI XÁC NHẬN'}
                </span>
              </button>

              <p className="text-[#5A1E2A]/60 text-sm text-center mt-6" style={{ fontFamily: 'Lora, serif' }}>
                Vui lòng xác nhận trước ngày 15.03.2026
              </p>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-[#F6F1EB] to-[#F6F1EB]/95 rounded-2xl p-16 text-center shadow-2xl border-2 border-[#C9A24D]/30"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#C9A24D] to-[#C9A24D]/70 mb-6 shadow-lg"
              >
                <Check className="text-[#1C1C1C]" size={48} strokeWidth={3} />
              </motion.div>
              
              <h4 className="text-[#5A1E2A] text-3xl mb-3 tracking-[0.1em]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Xác Nhận Thành Công!
              </h4>
              <p className="text-[#5A1E2A]/80 text-lg" style={{ fontFamily: 'Lora, serif' }}>
                Cảm ơn bạn đã xác nhận. Chúng tôi rất mong được gặp bạn!
              </p>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100px' }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-[1px] bg-[#C9A24D] mx-auto mt-6"
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}