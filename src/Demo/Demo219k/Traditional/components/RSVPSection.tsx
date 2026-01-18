import { motion } from 'motion/react';
import { CheckCircle2, Users, User, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { submitRSVPWithFallback } from '../../../../utils/rsvpSubmission';

export function RSVPSection() {
  const [formData, setFormData] = useState({
    name: '',
    guests: '1',
    attending: 'yes',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
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
        message: formData.notes || 'Không có lời nhắn',
        template: 'Traditional Wedding Demo',
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', guests: '1', attending: 'yes', notes: '' });
      }, 3000);
    } catch (error) {
      console.error('RSVP submission error:', error);
      setSubmitError('Có lỗi khi gửi xác nhận. Vui lòng thử lại.');
      setTimeout(() => {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', guests: '1', attending: 'yes', notes: '' });
        }, 3000);
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-16 px-4 bg-[#FBF6EE]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full"
      >
        {/* Decorative top border */}
        <div className="flex items-center justify-center mb-8">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-4 border-[#8B1E1E] relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="text-[#8B1E1E]" size={32} />
                <h2 className="text-[#8B1E1E]">Xác Nhận Tham Dự</h2>
              </div>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full mb-4"></div>
              <p className="text-[#3A2F2F]">
                Rất mong nhận được sự hiện diện của quý khách
              </p>
            </motion.div>

            {submitted ? (
              /* Success message */
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                >
                  <CheckCircle2 className="text-[#8B1E1E] mb-4" size={80} />
                </motion.div>
                <h3 className="text-[#8B1E1E] mb-3 text-center">Cảm ơn quý khách!</h3>
                <p className="text-center text-[#3A2F2F]">
                  Trân trọng cảm ơn sự xác nhận của quý khách
                </p>
                <div className="mt-6 flex gap-2">
                  <div className="w-3 h-3 bg-[#D4AF37] rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-[#8B1E1E] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </motion.div>
            ) : (
              /* Form */
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Name input */}
                <div>
                  <label htmlFor="rsvp-name" className="block text-[#3A2F2F] mb-2">
                    Họ tên <span className="text-[#8B1E1E]">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A2F2F]/60" size={20} />
                    <input
                      type="text"
                      id="rsvp-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-[#FBF6EE] focus:border-[#D4AF37] focus:outline-none transition-colors bg-[#FBF6EE] text-[#3A2F2F]"
                      placeholder="Nhập họ tên của bạn"
                      required
                    />
                  </div>
                </div>

                {/* Attending field */}
                <div>
                  <label className="block text-[#3A2F2F] mb-2">
                    Bạn có tham dự không? <span className="text-[#8B1E1E]">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="attending"
                        value="yes"
                        checked={formData.attending === 'yes'}
                        onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                        className="peer sr-only"
                      />
                      <div className="px-4 py-3 rounded-lg border-2 border-[#FBF6EE] peer-checked:border-[#D4AF37] peer-checked:bg-[#D4AF37]/10 text-center transition-all">
                        <span className="text-[#3A2F2F]">Có, tôi sẽ đến</span>
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="attending"
                        value="no"
                        checked={formData.attending === 'no'}
                        onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                        className="peer sr-only"
                      />
                      <div className="px-4 py-3 rounded-lg border-2 border-[#FBF6EE] peer-checked:border-[#D4AF37] peer-checked:bg-[#D4AF37]/10 text-center transition-all">
                        <span className="text-[#3A2F2F]">Xin lỗi, không thể</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Number of guests */}
                <div>
                  <label htmlFor="rsvp-guests" className="block text-[#3A2F2F] mb-2">
                    Số người tham dự <span className="text-[#8B1E1E]">*</span>
                  </label>
                  <select
                    id="rsvp-guests"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-[#FBF6EE] focus:border-[#D4AF37] focus:outline-none transition-colors bg-[#FBF6EE] text-[#3A2F2F]"
                    required
                  >
                    <option value="1">1 người</option>
                    <option value="2">2 người</option>
                    <option value="3">3 người</option>
                    <option value="4">4 người</option>
                    <option value="5">5+ người</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="rsvp-notes" className="block text-[#3A2F2F] mb-2">
                    Ghi chú (nếu có)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-[#3A2F2F]/60" size={20} />
                    <textarea
                      id="rsvp-notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-[#FBF6EE] focus:border-[#D4AF37] focus:outline-none transition-colors bg-[#FBF6EE] text-[#3A2F2F] resize-none"
                      placeholder="Các yêu cầu đặc biệt hoặc thông tin thêm..."
                    />
                  </div>
                </div>

                {submitError && (
                  <div className="p-4 bg-red-100 border-2 border-red-300 rounded-lg text-red-700 text-center">
                    {submitError}
                  </div>
                )}

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#8B1E1E] text-white rounded-lg hover:bg-[#A73333] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 size={24} />
                  <span>{isSubmitting ? 'Đang gửi...' : 'Xác nhận'}</span>
                </motion.button>
              </motion.form>
            )}
          </div>
        </motion.div>

        {/* Decorative bottom border */}
        <div className="flex items-center justify-center mt-8">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
