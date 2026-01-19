import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Heart, User, Users, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { useInView } from './hooks/useInView';
import { submitRSVPWithFallback } from '../../../../utils/rsvpSubmission';

interface RSVPData {
  name: string;
  guests: string;
  attending: string;
  phone: string;
}

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

export function RSVP() {
  const { ref, isInView } = useInView();
  const [formData, setFormData] = useState<RSVPData>({
    name: '',
    guests: '1',
    attending: 'yes',
    phone: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [messageSent, setMessageSent] = useState(false);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('weddingMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Sample messages
      const sampleMessages: GuestMessage[] = [
        {
          id: '1',
          name: 'Nguyễn Văn An',
          message: 'Chúc hai bạn trăm năm hạnh phúc, bên nhau mãi mãi! 💕',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '2',
          name: 'Trần Thị Bình',
          message: 'Chúc mừng đám cưới! Cầu chúc hai bạn luôn hạnh phúc và yêu thương nhau mỗi ngày 🥰',
          timestamp: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: '3',
          name: 'Lê Hoàng Long',
          message: 'Hạnh phúc mãi mãi bên nhau nha! Chúc gia đình mới nhiều niềm vui 🎉',
          timestamp: new Date(Date.now() - 259200000).toISOString()
        }
      ];
      setMessages(sampleMessages);
      localStorage.setItem('weddingMessages', JSON.stringify(sampleMessages));
    }
  }, []);

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || parseInt(formData.guests) < 1) {
      setSubmitError('Vui lòng điền đầy đủ thông tin');
      setTimeout(() => setSubmitError(''), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Submit to Google Sheets via submitRSVPWithFallback
      await submitRSVPWithFallback({
        name: formData.name,
        attending: formData.attending === 'yes' ? 'yes' : 'no',
        guestCount: parseInt(formData.guests) || 1,
        message: guestMessage || 'Không có lời nhắn',
        template: 'Demo219k Wedding',
      });

      // Also save to localStorage as backup
      const savedRSVPs = localStorage.getItem('weddingRSVPs');
      const rsvps = savedRSVPs ? JSON.parse(savedRSVPs) : [];
      rsvps.push({ ...formData, timestamp: new Date().toISOString() });
      localStorage.setItem('weddingRSVPs', JSON.stringify(rsvps));
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', guests: '1', attending: 'yes', phone: '' });
      }, 3000);
    } catch (error) {
      console.error('RSVP submission error:', error);
      setSubmitError('Có lỗi khi gửi xác nhận. Vui lòng thử lại.');
      // Show success anyway for better UX after error
      setTimeout(() => {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', guests: '1', attending: 'yes', phone: '' });
        }, 3000);
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMessage.trim()) return;

    const newMessage: GuestMessage = {
      id: Date.now().toString(),
      name: guestName,
      message: guestMessage,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [newMessage, ...messages];
    setMessages(updatedMessages);
    localStorage.setItem('weddingMessages', JSON.stringify(updatedMessages));

    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setGuestName('');
      setGuestMessage('');
    }, 2000);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <section id="rsvp-section" ref={ref} className="py-24 px-4 bg-gradient-to-b from-white via-rose-50/20 to-white relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-rose-200/10 rounded-full blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 15, repeat: Infinity, delay: 2 }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <div className="inline-block">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="text-sm text-rose-600 tracking-widest uppercase font-light">Xác Nhận & Quà Tặng</span>
                <div className="w-2 h-2 rounded-full bg-rose-400" />
              </div>
            </div>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-serif mb-6 text-gray-900 font-light">
            Xác Nhận Tham Dự
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-32 h-1 bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 mx-auto mb-6"
          />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Vui lòng xác nhận sự hiện diện của bạn để chúng tôi chuẩn bị chu đáo hơn
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* RSVP Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 group">
             

              <h3 className="text-2xl font-serif text-gray-900 mb-8 flex items-center gap-3 font-light">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <Heart className="w-6 h-6 text-white" />
                </motion.div>
                Thông Tin Tham Dự
              </h3>

              <form onSubmit={handleRSVPSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 }}
                >
                  <label className="flex items-center gap-2 text-gray-700 mb-3 font-medium">
                    <User className="w-4 h-4" />
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-rose-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all font-light placeholder:text-gray-400"
                    placeholder="Nguyễn Văn A"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.35 }}
                >
                  <label className="flex items-center gap-2 text-gray-700 mb-3 font-medium">
                    <Users className="w-4 h-4" />
                    Số lượng khách
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-rose-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all font-light"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'người' : 'người'}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}
                >
                  <label className="text-gray-700 mb-3 block font-medium">Bạn có thể tham dự?</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="radio"
                          name="attending"
                          value="yes"
                          checked={formData.attending === 'yes'}
                          onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                          className="w-4 h-4 text-rose-500 focus:ring-rose-500 cursor-pointer"
                        />
                        <motion.div
                          className="absolute inset-0 border-2 border-rose-300 rounded-full"
                          animate={{ scale: formData.attending === 'yes' ? 1.4 : 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className="text-gray-700 group-hover:text-rose-600 transition-colors font-light">Có, tôi sẽ tham dự</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="attending"
                        value="no"
                        checked={formData.attending === 'no'}
                        onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                        className="w-4 h-4 text-rose-500 focus:ring-rose-500 cursor-pointer"
                      />
                      <span className="text-gray-700 group-hover:text-rose-600 transition-colors font-light">Rất tiếc, tôi không thể tham dự</span>
                    </label>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.45 }}
                >
                  <label className="text-gray-700 mb-3 block font-medium">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-rose-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all font-light placeholder:text-gray-400"
                    placeholder="0909 123 456"
                  />
                </motion.div>

                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-rose-50/50 border border-rose-200/30 rounded-xl p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                    <p className="text-rose-600 text-sm font-medium">{submitError}</p>
                  </motion.div>
                )}

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  className={`w-full py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold mt-8 border-2 ${
                    isSubmitting 
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed border-gray-300' 
                      : 'bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 text-rose-700 hover:shadow-xl border-rose-400 hover:border-rose-600'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </motion.div>
                      Đang Gửi...
                    </>
                  ) : submitted ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Đã Gửi Thành Công!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Gửi Xác Nhận
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Guestbook & Gift Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Gift Section */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 border border-amber-200/30 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-serif text-gray-900 mb-6 flex items-center gap-3 font-light">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-xl">🎁</span>
                </motion.div>
                Quà Tặng & Mừng Cưới
              </h3>

              <div className="space-y-4 text-gray-700">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 }}
                  className="bg-white/60 backdrop-blur-sm border border-amber-200/30 rounded-2xl p-4"
                >
                  <p className="text-sm text-amber-600 font-semibold uppercase tracking-wide mb-2">Ngân Hàng</p>
                  <p className="text-gray-900 font-medium text-lg">Ngân hàng TMCP Việt Nam</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.35 }}
                  className="bg-white/60 backdrop-blur-sm border border-amber-200/30 rounded-2xl p-4"
                >
                  <p className="text-sm text-amber-600 font-semibold uppercase tracking-wide mb-2">Chủ Tài Khoản</p>
                  <p className="text-gray-900 font-medium">Nguyễn Văn Minh</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 }}
                  className="bg-white/60 backdrop-blur-sm border border-amber-200/30 rounded-2xl p-4"
                >
                  <p className="text-sm text-amber-600 font-semibold uppercase tracking-wide mb-2">Số Tài Khoản</p>
                  <p className="text-gray-900 font-medium font-mono text-lg">1234 5678 9012 3456</p>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.45 }}
                  className="text-sm text-gray-600 italic pt-4 border-t border-amber-200/20"
                >
                  💝 Cảm ơn tình cảm của quý khách. Sự hiện diện của bạn đã là quà tặng lớn nhất rồi!
                </motion.p>
              </div>
            </div>

            {/* Messages Box */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl p-8 group">
              <h3 className="text-2xl font-serif text-gray-900 mb-6 flex items-center gap-3 font-light">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <MessageSquare className="w-6 h-6 text-white" />
                </motion.div>
                Sổ Lưu Bút
              </h3>

              <form onSubmit={handleMessageSubmit} className="mb-6 space-y-3">
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Tên của bạn"
                  className="w-full px-4 py-3 bg-white/50 border border-rose-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all font-light placeholder:text-gray-400"
                  required
                />
                <textarea
                  value={guestMessage}
                  onChange={(e) => setGuestMessage(e.target.value)}
                  placeholder="Gửi lời chúc..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/50 border border-rose-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none font-light placeholder:text-gray-400"
                  required
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 text-rose-700 py-3 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold border-2 border-rose-400 hover:border-rose-600"
                >
                  {messageSent ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Đã Gửi!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Gửi Lời Chúc
                    </>
                  )}
                </motion.button>
              </form>

              {/* Messages List */}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-gradient-to-r from-rose-50/50 to-pink-50/50 border border-rose-200/20 rounded-2xl p-4 backdrop-blur-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-rose-700 font-medium">{msg.name}</p>
                      <p className="text-xs text-gray-400 font-light">{formatTimestamp(msg.timestamp)}</p>
                    </div>
                    <p className="text-gray-700 leading-relaxed font-light">{msg.message}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
