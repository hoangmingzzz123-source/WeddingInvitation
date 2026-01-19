import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Heart, User, Users, MessageSquare, CheckCircle } from 'lucide-react';
import { useInView } from './hooks/useInView';

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

  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage
    const savedRSVPs = localStorage.getItem('weddingRSVPs');
    const rsvps = savedRSVPs ? JSON.parse(savedRSVPs) : [];
    rsvps.push({ ...formData, timestamp: new Date().toISOString() });
    localStorage.setItem('weddingRSVPs', JSON.stringify(rsvps));
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', guests: '1', attending: 'yes', phone: '' });
    }, 3000);
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
    <section ref={ref} className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-rose-900">
            Xác Nhận Tham Dự
          </h2>
          <div className="w-24 h-1 bg-rose-300 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Vui lòng xác nhận sự hiện diện của bạn để chúng tôi chuẩn bị chu đáo hơn
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* RSVP Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-rose-50 to-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-serif text-rose-900 mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6" />
                Thông Tin Tham Dự
              </h3>

              <form onSubmit={handleRSVPSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 mb-2">
                    <Users className="w-4 h-4" />
                    Số lượng khách
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'người' : 'người'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-700 mb-2 block">Bạn có thể tham dự?</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="attending"
                        value="yes"
                        checked={formData.attending === 'yes'}
                        onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                        className="w-4 h-4 text-rose-500 focus:ring-rose-500"
                      />
                      <span>Có, tôi sẽ tham dự</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="attending"
                        value="no"
                        checked={formData.attending === 'no'}
                        onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                        className="w-4 h-4 text-rose-500 focus:ring-rose-500"
                      />
                      <span>Rất tiếc, tôi không thể tham dự</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-gray-700 mb-2 block">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                    placeholder="0909 123 456"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  {submitted ? (
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
                </button>
              </form>
            </div>
          </motion.div>

          {/* Guestbook */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-white to-rose-50 rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-serif text-rose-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Sổ Lưu Bút
              </h3>

              {/* Message Form */}
              <form onSubmit={handleMessageSubmit} className="mb-8">
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Tên của bạn"
                  className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all mb-3"
                  required
                />
                <textarea
                  value={guestMessage}
                  onChange={(e) => setGuestMessage(e.target.value)}
                  placeholder="Gửi lời chúc đến cô dâu chú rể..."
                  rows={4}
                  className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all resize-none mb-3"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition-colors duration-300 flex items-center justify-center gap-2"
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
                </button>
              </form>

              {/* Messages List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg p-4 shadow-sm border border-rose-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-rose-700">{msg.name}</p>
                      <p className="text-xs text-gray-400">{formatTimestamp(msg.timestamp)}</p>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{msg.message}</p>
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
