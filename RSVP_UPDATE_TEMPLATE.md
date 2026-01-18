# 🔄 Template Code Snippets cho RSVP với Google Sheets

## 📌 Import Statements (Thêm vào đầu file)

```tsx
import { Mail } from 'lucide-react'; // Nếu chưa có
import { submitRSVPWithFallback } from '../../utils/rsvpSubmission';
```

## 📌 State Declarations (Thêm vào component state)

```tsx
const [formData, setFormData] = useState({ name: '', email: '', message: '' });
const [isSubmitting, setIsSubmitting] = useState(false);
```

## 📌 Form Submit Handler (Thay thế handleSubmit hoặc onSubmit)

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!attending) return;
  
  setIsSubmitting(true);
  
  try {
    await submitRSVPWithFallback({
      name: formData.name,
      email: formData.email || undefined,
      attending: attending,
      guestCount: attending === 'yes' ? guestCount : 0,
      message: formData.message || undefined,
      template: 'YOUR_TEMPLATE_NAME', // ⚠️ Thay đổi tên template
    });
    
    setSubmitted(true);
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    setSubmitted(true);
  } finally {
    setIsSubmitting(false);
  }
};
```

## 📌 Name Input Field (Cập nhật Input)

```tsx
<Input
  placeholder="Họ và tên *"
  required
  value={formData.name}
  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  className="YOUR_CLASSNAMES"
/>
```

## 📌 Email Input Field (Thêm sau Name field)

```tsx
<div className="relative">
  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-YOUR_COLOR" />
  <Input
    type="email"
    placeholder="Email (không bắt buộc)"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    className="pl-12 YOUR_OTHER_CLASSNAMES"
  />
</div>
```

## 📌 Message Textarea (Cập nhật Textarea)

```tsx
<Textarea
  placeholder="Lời nhắn (không bắt buộc)"
  value={formData.message}
  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
  className="YOUR_CLASSNAMES"
/>
```

## 📌 Submit Button (Cập nhật Button)

```tsx
<Button 
  type="submit"
  disabled={isSubmitting}
  className="YOUR_CLASSNAMES disabled:opacity-50"
>
  {isSubmitting ? (
    <>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-6 h-6 mr-2 border-2 border-current border-t-transparent rounded-full"
      />
      Đang gửi...
    </>
  ) : (
    <>
      <Send className="w-6 h-6 mr-2" />
      Gửi Xác Nhận
    </>
  )}
</Button>
```

---

## 📋 Checklist cho mỗi file

- [ ] Add imports: `Mail` icon và `submitRSVPWithFallback`
- [ ] Add state: `formData` và `isSubmitting`
- [ ] Update form submit handler with async/await
- [ ] Add email input field với icon
- [ ] Add value/onChange to name input
- [ ] Add value/onChange to message textarea
- [ ] Update submit button với loading state
- [ ] Change template name trong submitRSVPWithFallback

---

## 🎯 Template Names Reference

| File | Template Name |
|------|---------------|
| LuxuryGoldCinematicEnhanced.tsx | 'Luxury Gold Cinematic Enhanced' |
| BlushFloralEnhanced.tsx | 'Blush Floral Enhanced' |
| MinimalElegantEnhanced.tsx | 'Minimal Elegant Enhanced' |
| BloomCrystal3DEnhanced.tsx | 'Bloom Crystal 3D Enhanced' |
| ArtDecoRoyalEnhanced.tsx | 'Art Deco Royal Enhanced' |
| CinematicLoveStoryEnhanced.tsx | 'Cinematic Love Story Enhanced' |
| LuxuryGoldCinematic.tsx | 'Luxury Gold Cinematic' |
| BlushFloral.tsx | 'Blush Floral' |
| SoftFadeFloral.tsx | 'Soft Fade Floral' |
| GreenElegance.tsx | 'Green Elegance' |
| ArtDecoRoyal.tsx | 'Art Deco Royal' |
| TropicalSunset.tsx | 'Tropical Sunset' |

---

## ⚙️ Color Reference (cho Mail icon)

| Template | Icon Color Class |
|----------|------------------|
| Luxury Gold | `text-[#FFD700]` |
| Blush Floral | `text-[#FF69B4]` |
| Minimal Elegant | `text-[#2A5D67]` |
| Bloom Crystal 3D | `text-[#FF69B4]` |
| Art Deco Royal | `text-[#C29B43]` |
| Cinematic | `text-[#C29B43]` |
| Green Elegance | `text-[#4A7C59]` |
| Tropical Sunset | `text-[#FF6B6B]` |
