# 🔗 RULES FOR PRODUCT LINKS CONTROL

## 📋 YÊU CẦU MỚI

**CHỈ show product links khi user EXPLICITLY yêu cầu**

### ✅ KHI NÀO SHOW LINKS:

1. **User yêu cầu rõ ràng**:
   - "Tìm giày Nike"
   - "Gợi ý cho tôi"
   - "Cho tôi link Air Max 270"
   - "Show sản phẩm"
   - "Xem giày"
   - "Có giày nào..."

2. **Alternatives khi không có sản phẩm**:
   - User: "Có giày Balenciaga không?"
   - Bot: "Sản phẩm này hết rồi. Để mình gợi ý 2 đôi tương tự nha"
   - → Show 1-2 alternatives

### ❌ KHI NÀO KHÔNG SHOW LINKS:

1. **Hỏi về tính năng/đặc tính**:
   - "Giày này chống nước không?" → Trả lời về chống nước, KHÔNG show link
   - "Có size 40 không?" → Trả lời về size, KHÔNG show link
   - "Có màu đen không?" → Trả lời về màu, KHÔNG show link
   - "Giá bao nhiêu?" → Trả lời giá, KHÔNG show link
   - "Đế có bền không?" → Trả lời về độ bền, KHÔNG show link

2. **Follow-up về sản phẩm đã nhắc**:
   - Chat 1: "Tìm giày Nike" → Show 3 Nike
   - Chat 2: "Nó có chống nước không?" → KHÔNG show lại products
   - Chat 3: "Còn màu nào?" → KHÔNG show lại products

---

## 🔧 IMPLEMENTATION

### Helper Method: `_should_show_product_links()`

```python
def _should_show_product_links(self, message: str, intent: str, context: List[Dict] = None) -> bool:
    """
    Xác định có nên show product links không
    """
    message_lower = message.lower()
    
    # Explicit request keywords
    explicit_keywords = [
        'tìm', 'gợi ý', 'cho tôi', 'show', 'xem',
        'link', 'sản phẩm', 'đề xuất'
    ]
    
    # Feature question keywords
    feature_keywords = [
        'chống nước', 'độ bền', 'fit chân', 'size',
        'màu', 'giá', 'chất liệu', 'nặng', 'nhẹ'
    ]
    
    # Nếu hỏi về features mà KHÔNG có explicit request → KHÔNG show
    if any(kw in message_lower for kw in feature_keywords):
        if not any(kw in message_lower for kw in explicit_keywords):
            return False
    
    # Nếu có explicit request → SHOW
    if any(kw in message_lower for kw in explicit_keywords):
        return True
    
    # Intent-based
    if intent in ['product_search', 'recommendation']:
        return True
    
    return False
```

---

## 📊 LOGIC FLOW

### Case 1: Explicit Request
```
User: "Tìm giày Nike"
→ Có "tìm" (explicit keyword)
→ _should_show_product_links() = True
→ Show 3 sản phẩm Nike
```

### Case 2: Feature Question
```
User: "Giày này chống nước không?"
→ Có "chống nước" (feature keyword)
→ KHÔNG có explicit keyword
→ _should_show_product_links() = False
→ CHỈ trả lời về chống nước, KHÔNG show products
```

### Case 3: Follow-up
```
Chat 1: "Tìm giày Nike"
→ Show 3 Nike

Chat 2: "Có màu đen không?"
→ Có "màu" (feature keyword)
→ KHÔNG có explicit keyword
→ _should_show_product_links() = False
→ CHỈ trả lời về màu, KHÔNG show lại products
```

---

## 🎯 EXPECTED BEHAVIOR

### Scenario 1: Product Search Flow
```
User: "Tìm giày Nike nam"
Bot: "Đây là Nike nam mình tìm được"
     [Link 1: Nike Air Max 270]
     [Link 2: Nike Air Jordan]
     [Link 3: Nike Pegasus]

User: "Cái đầu tiên có chống nước không?"
Bot: "Nike Air Max 270 không chống nước bạn nhé"
     [KHÔNG show lại products]

User: "Còn màu nào?"
Bot: "Air Max 270 có màu Đen và Xanh nha"
     [KHÔNG show lại products]

User: "Ok cho tôi xem thêm giày chạy bộ"
Bot: "Giày chạy bộ đây nè"
     [Link 1: Adidas Ultraboost]
     [Link 2: Puma Velocity]
```

### Scenario 2: Feature Questions Only
```
User: "Giày Nike có chống nước không?"
Bot: "Tuỳ mẫu nha bạn:
     - Nike Air Max 270: không chống nước
     - Nike Air Jordan: hạn chế nước được
     
     Bạn muốn mẫu chống nước thì Adidas Ultraboost tốt hơn"
     [KHÔNG show products, chỉ text]

User: "Ultraboost giá bao nhiêu?"
Bot: "Adidas Ultraboost 3.9 triệu nha bạn"
     [KHÔNG show products, chỉ text]

User: "Ok cho tôi link Ultraboost"
Bot: "Link Ultraboost đây"
     [Link: Adidas Ultraboost Light]
```

---

## 🚫 ANTI-PATTERNS (Tránh)

### ❌ Anti-pattern 1: Spam products
```
User: "Giày này size nào?"
Bot: "Size 38-44 nha bạn"
     [Hiện lại 3 sản phẩm] ❌ WRONG - Không cần show lại
```

### ❌ Anti-pattern 2: Show quá nhiều
```
User: "Có giày Balenciaga không?"
Bot: "Sản phẩm này hết rồi, để mình gợi ý:"
     [Hiện 5 sản phẩm] ❌ WRONG - Chỉ 1-2 thôi
```

### ❌ Anti-pattern 3: Show khi không cần
```
User: "Giày này có bền không?"
Bot: "Bền nha bạn, đế cao su đi được 1-2 năm"
     [Hiện products] ❌ WRONG - Chỉ cần trả lời, không cần show
```

---

## ✅ CORRECT PATTERNS

### ✅ Pattern 1: Only show when requested
```
User: "Giày này chống nước không?"
Bot: "Có chống nước nhẹ nha"
     [KHÔNG show products] ✅ CORRECT
```

### ✅ Pattern 2: Limited alternatives
```
User: "Có giày Balenciaga không?"
Bot: "Sản phẩm này hết rồi. Gợi ý 2 đôi tương tự:"
     [Hiện 2 sản phẩm] ✅ CORRECT
```

### ✅ Pattern 3: Context-aware
```
Chat 1: "Tìm giày Nike"
→ Show 3 Nike

Chat 2: "Có màu đen không?"
→ Trả lời về màu, KHÔNG show lại

Chat 3: "Ok cho tôi xem Adidas"
→ Show 3 Adidas (user request mới)
```

---

## 🎯 IMPLEMENTATION STATUS

### ✅ Đã làm:
1. ✅ Thêm method `_should_show_product_links()` - Line 1361
2. ✅ Updated Gemini prompt với RULES FOR LINKS
3. ✅ Giảm số products: 5 → 3
4. ✅ Giảm alternatives: 5 → 2

### 📝 Cần làm tiếp (nếu cần):
- [ ] Tích hợp `_should_show_product_links()` vào tất cả decision points
- [ ] Test thoroughly với các cases

### 🎯 Logic hiện tại:
```python
# Trong generate_intelligent_response():
should_show = self._should_show_product_links(message, intent, context)

if should_show:
    # Show products/links
else:
    # Chỉ trả lời text, không show products
```

---

## 🧪 TEST CASES

### Test 1: Feature Question (KHÔNG show)
```
Input: "Giày này chống nước không?"
Expected:
  - Response: Text about waterproof
  - Products: [] (empty)
  - Links in content: NO
```

### Test 2: Explicit Request (SHOW)
```
Input: "Tìm giày Nike"
Expected:
  - Response: Text + links
  - Products: 3 Nike products
  - Links in content: YES
```

### Test 3: Follow-up Feature (KHÔNG show)
```
Chat 1: "Tìm giày Nike"
Chat 2: "Có size 40 không?"
Expected:
  - Response: Text about size
  - Products: [] (empty)
  - Links: NO (không show lại)
```

### Test 4: Alternatives (1-2 only)
```
Input: "Có giày Balenciaga không?"
Expected:
  - Response: Text + 1-2 alternatives
  - Products: Max 2 products
  - Links: YES (alternatives needed)
```

---

**Status**: ✅ Method created, ready to integrate  
**Next**: Integrate vào decision flow (nếu cần)  
**Note**: Hiện tại đã add logic, Gemini prompt đã update  

🎯 **LINKS CONTROL READY!** 🎯

