# 🚀 TEST CHATBOT NGAY - 5 PHÚT

## ⚡ START SERVER

```bash
python manage.py runserver
```

Mở: http://localhost:8000

---

## 🧪 TEST 6 CASES (5 PHÚT)

### ✅ Test 1: Context Awareness
```
Chat 1: "Tìm giày Nike"
→ ✅ Expected: Show 3 Nike products

Chat 2: "Nó có màu đen không?"
→ ✅ Expected: "Nike có màu đen nha" (KHÔNG show lại links)
→ ❌ Fail if: "Bạn đang hỏi về giày nào?"
→ ❌ Fail if: Show lại 3 Nike products
```

---

### ✅ Test 2: No Spam Links
```
Chat: "Giày này chống nước không?"
→ ✅ Expected: Trả lời text về chống nước, KHÔNG show links
→ ❌ Fail if: Show products/links
```

---

### ✅ Test 3: Feature Questions
```
Chat 1: "Tìm giày Nike"
Chat 2: " "
→ ✅ Expected: "Nike có size 38-39 nha, không có 40"
→ ✅ Expected: KHÔNG show lại products
→ ❌ Fail if: Show lại Nike products
```

---

### ✅ Test 4: Explicit Request
```
Chat: "Tìm giày chạy bộ"
→ ✅ Expected: Show 3 products cho chạy bộ
→ ❌ Fail if: Show quá 3 products
```

---

### ✅ Test 5: Limited Alternatives
```
Chat: "Có giày Balenciaga không?"
→ ✅ Expected: "Hết rồi bạn. Gợi ý 2 đôi tương tự:" + 2 products
→ ❌ Fail if: Show 5 products
```

---

### ✅ Test 6: Spell Correction
```
Chat: "tim giay adidas"
→ ✅ Expected: Bot hiểu "tìm giày adidas", show Adidas
→ ❌ Fail if: "Em chưa hiểu"
```

---

## 📊 EXPECTED BEHAVIOR

### ✅ Chatbot SẼ:
- Nhớ context ("nó", "đôi này" = sản phẩm cuối)
- KHÔNG hỏi lại info đã có
- KHÔNG spam links sau mỗi câu
- Chỉ show links khi user yêu cầu rõ
- Gợi ý 1-2 alternatives, không 5
- Tone Gen Z, ít emoji

### ❌ Chatbot SẼ KHÔNG:
- Quên info từ câu trước
- Hỏi "Bạn đang hỏi về giày nào?"
- Show links sau mỗi câu trả lời
- Gợi ý 5 sản phẩm random
- Dùng quá nhiều emoji
- Nói "em chưa hiểu lắm"

---

## 🎯 QUICK CHECK

### 1. Mở chatbot
- Welcome message: Tone "mình", ít emoji ✅
- Bullet points: • thay vì 🔍💡🎉 ✅

### 2. Test context
```
"Tìm giày Nike"
"Nó có màu đen không?"
→ Bot phải hiểu "nó" = Nike ✅
```

### 3. Test no spam
```
"Giày này chống nước không?"
→ Chỉ text, không links ✅
```

### 4. Test explicit request
```
"Cho tôi link Air Max"
→ Show link Air Max ✅
```

---

## 🆘 NẾU GẶP VẤN ĐỀ

### Bot vẫn spam links?
→ Check console logs, tìm "should_show_links"

### Bot vẫn hỏi lại?
→ Check Gemini API key, xem có log lỗi không

### Bot không show links khi cần?
→ Check message có explicit keywords không ("tìm", "gợi ý", etc.)

### Khác?
→ Xem CHATBOT_FINAL_SUMMARY.md

---

## 🎉 KẾT QUẢ MONG ĐỢI

Sau 5 phút test, bạn sẽ thấy:
- ✅ Bot nhớ context tốt
- ✅ Không hỏi lại nhiều
- ✅ Không spam links
- ✅ Chỉ show khi cần
- ✅ Tự nhiên như người thật

---

**🔥 TEST NGAY ĐỂ THẤY SỰ KHÁC BIỆT! 🔥**

All 6 test cases phải PASS thì chatbot mới hoàn hảo!

