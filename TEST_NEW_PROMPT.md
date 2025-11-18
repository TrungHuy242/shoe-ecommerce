# 🧪 TEST CHATBOT MỚI - 5 PHÚT

## ⚡ QUICK TEST (5 câu)

### 1. Test Welcome Message
```
Action: Mở chatbot
✅ Expected: Message ngắn gọn (không dài như trước)
```

### 2. Test Tìm Kiếm Không Hỏi Lại
```
Bạn: "Tìm giày Nike"
✅ Expected: Hiện NGAY 5 sản phẩm Nike (KHÔNG hỏi "Nam hay Nữ?")
```

### 3. Test Hỏi Về Chống Nước
```
Bạn: "Giày này chống nước không?"
✅ Expected: Trả lời NGAY (VD: "Giày này có lớp phủ chống nước nhẹ...")
           KHÔNG hỏi lại "Bạn đang quan tâm giày nào?"
```

### 4. Test Hỏi Về Size
```
Bạn: "Có size nào?"
✅ Expected: Trả lời NGAY (VD: "Size có 38-44 bạn nhé!")
           KHÔNG hỏi lại
```

### 5. Test Ngắn Gọn
```
Bạn: "Có khuyến mãi không?"
✅ Expected: Câu trả lời NGẮN (1-3 câu)
           KHÔNG dài dòng
```

---

## 🎯 TEST CHI TIẾT

### Scenario 1: Tìm Giày Thiếu Thông Tin

#### Test 1.1: Chỉ có brand
```
Input: "Tìm giày Nike"

✅ Expect:
- Hiện NGAY 5 sản phẩm Nike
- KHÔNG hỏi "Nam hay Nữ?"
- Câu trả lời ngắn: "Mấy đôi Nike này bạn xem nhé! 👟"

❌ Không được:
- "Bạn muốn giày Nike cho Nam, Nữ hay Unisex?"
- Hỏi lại bất kỳ thông tin gì
```

#### Test 1.2: Chỉ có gender
```
Input: "Tìm giày nam"

✅ Expect:
- Hiện NGAY 5 sản phẩm nam
- KHÔNG hỏi "Thương hiệu nào?"
- Câu trả lời: "Giày Nam hot nhất đây! 👟"

❌ Không được:
- Hỏi lại thương hiệu
```

#### Test 1.3: Không có thông tin gì
```
Input: "Tìm giày"

✅ Expect:
- Hỏi 1 LẦN: "Bạn muốn tìm giày thương hiệu nào, hay để em gợi ý?"
- Đồng thời hiện 5 top products
- KHÔNG hỏi thêm lần nào nữa

❌ Không được:
- Hỏi nhiều lần
- Không đưa gợi ý
```

---

### Scenario 2: Hỏi Về Đặc Tính Sản Phẩm

#### Test 2.1: Chống nước
```
Input: "Giày này chống nước không?"

✅ Expect:
- Trả lời NGAY: "Giày này có lớp phủ chống nước nhẹ, ok với mưa phùn!"
- Hoặc: "Đề em check kỹ hơn, hoặc bạn có thể xem review nhé!"
- KHÔNG hỏi "Bạn đang hỏi về giày nào?"

❌ Không được:
- Hỏi lại giày nào
- Trả lời chung chung
```

#### Test 2.2: Độ bền
```
Input: "Đế có bền không?"

✅ Expect:
- Trả lời NGAY: "Đế cao su bền, đi được 1-2 năm nếu dùng đúng cách!"
- Câu trả lời CỤ THỂ, không chung chung

❌ Không được:
- "Em cần kiểm tra thông tin"
- Hỏi lại
```

#### Test 2.3: Fit chân
```
Input: "Giày có ôm chân không?"

✅ Expect:
- Trả lời NGAY: "Ôm chân tốt, form chuẩn, nên chọn đúng size!"

❌ Không được:
- Hỏi lại
```

#### Test 2.4: Size
```
Input: "Có size nào?"

✅ Expect:
- Trả lời NGAY: "Size có 38-44 bạn! Bạn thường đi size nào?"
- Có thể hỏi ngắn để tư vấn tốt hơn

❌ Không được:
- "Bạn đang hỏi về giày nào?"
```

---

### Scenario 3: Độ Ngắn Gọn

#### Test 3.1: Khuyến mãi
```
Input: "Có khuyến mãi không?"

✅ Expect:
- Câu trả lời 1-3 câu
- VD: "Khuyến mãi hot đây:
      🎉 SALE20 - Giảm 20%
      🎉 FREESHIP - Giảm 15%
      Dùng khi thanh toán nhé! 💰"

❌ Không được:
- Câu trả lời > 5 câu
- Dài dòng
```

#### Test 3.2: Gợi ý
```
Input: "Gợi ý cho tôi"

✅ Expect:
- Ngắn gọn: "Top giày bán chạy đây bạn! 🔥"
- Hiện 5 sản phẩm

❌ Không được:
- Dài dòng
- Hỏi nhiều thông tin
```

---

## ✅ CHECKLIST

### Tính năng cốt lõi:
- [ ] Không hỏi lại nhiều (tối đa 1 lần)
- [ ] Trả lời ngắn gọn (1-3 câu)
- [ ] Trả lời NGAY về chống nước/độ bền/fit chân/size
- [ ] Không trả lời chung chung
- [ ] Tone nhân viên bán hàng (không phải AI)

### Welcome message:
- [ ] Ngắn gọn
- [ ] Không dài dòng
- [ ] Emoji nhẹ nhàng

### Tìm kiếm:
- [ ] Có ít nhất 1 thông tin → Tìm NGAY (không hỏi lại)
- [ ] Không có thông tin → Hỏi 1 lần + đưa gợi ý

### Đặc tính sản phẩm:
- [ ] Chống nước → Trả lời NGAY
- [ ] Độ bền → Trả lời NGAY
- [ ] Fit chân → Trả lời NGAY
- [ ] Size → Trả lời NGAY

---

## 🚨 RED FLAGS (Cần fix nếu thấy)

### ❌ RED FLAG 1: Hỏi lại nhiều
```
User: "Tìm giày Nike"
Bot: "Bạn muốn giày Nike cho Nam, Nữ hay Unisex?"
     ⚠️ WRONG! Phải hiện NGAY sản phẩm
```

### ❌ RED FLAG 2: Trả lời chung chung
```
User: "Giày này chống nước không?"
Bot: "Em cần kiểm tra thông tin sản phẩm..."
     ⚠️ WRONG! Phải trả lời CỤ THỂ
```

### ❌ RED FLAG 3: Dài dòng
```
Bot: "Xin chào! Tôi là Footy, trợ lý mua sắm của FootFashion!
     Tôi có thể giúp bạn: bla bla bla..." (> 5 câu)
     ⚠️ WRONG! Phải ngắn gọn
```

### ❌ RED FLAG 4: Tone AI
```
Bot: "Để em tìm được giày phú hợp nhất cho bạn..."
     ⚠️ WRONG! Phải tone nhân viên: "Mấy đôi này bạn xem nhé!"
```

---

## 📊 EXPECTED RESULTS

### Nếu test PASS:
✅ Chatbot không hỏi lại nhiều
✅ Trả lời ngắn gọn, nhanh
✅ Trả lời CỤ THỂ về đặc tính
✅ Tone tự nhiên như nhân viên thật

### Nếu test FAIL:
❌ Vẫn hỏi lại nhiều lần
❌ Trả lời dài dòng
❌ Trả lời chung chung
❌ Tone AI, không tự nhiên

---

## 🎉 HOÀN THÀNH

Sau khi test xong, bạn nên thấy chatbot:
- ⚡ Nhanh hơn (không hỏi lại nhiều)
- 🎯 Chính xác hơn (trả lời ngay)
- 💬 Tự nhiên hơn (tone nhân viên)
- 😊 Dễ dùng hơn

**Ready to test!** 🚀

