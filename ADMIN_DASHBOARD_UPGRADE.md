# 🚀 ADMIN DASHBOARD UPGRADE - HƯỚNG DẪN

## ✅ ĐÃ HOÀN THÀNH

### 1. Backend Models (✅ Done)
- ✅ `IntentTraining` - Training data cho intents
- ✅ `BotConfig` - Cấu hình bot (rules, features)
- ✅ `ConversationTag` - Tag conversations cho training
- ✅ `Alert` - Alerts và notifications

### 2. Backend APIs (✅ Done)
- ✅ `/api/ai/admin/dashboard/` - Dashboard tổng quan
- ✅ `/api/ai/admin/conversations/` - Quản lý conversations
- ✅ `/api/ai/admin/conversations/<id>/tags/` - Tag management
- ✅ `/api/ai/admin/intents/` - Intent training CRUD
- ✅ `/api/ai/admin/test-intent/` - Test intent
- ✅ `/api/ai/admin/config/` - Bot config
- ✅ `/api/ai/admin/context/` - Context & memory
- ✅ `/api/ai/admin/test-simulation/` - Test simulation
- ✅ `/api/ai/admin/alerts/` - Alert management

### 3. URLs (✅ Done)
- ✅ Đã thêm tất cả URLs vào `urls.py`

## 📝 CẦN LÀM TIẾP

### 4. Frontend Upgrade
File hiện tại: `frontend/src/features/admin/AIChatbotDashboard/AIChatbotDashboard.js` (674 lines)

**Cần thêm**:
1. Tabs component cho 7 nhóm chức năng
2. Tab 1: Dashboard Overview (đã có, cần cải thiện)
3. Tab 2: Conversation Management (đã có, cần thêm tags/notes)
4. Tab 3: Intent Training (MỚI)
5. Tab 4: Response & Rules Config (MỚI)
6. Tab 5: Context & Memory (MỚI)
7. Tab 6: Test & Simulation (MỚI)
8. Tab 7: Alert & Monitoring (MỚI)

### 5. CSS Upgrade
File: `frontend/src/features/admin/AIChatbotDashboard/AIChatbotDashboard.css`

**Cần thêm**:
- Tab styles
- Form styles cho intent training
- Config toggle switches
- Alert badges
- Test simulation UI

## 🔧 NEXT STEPS

1. **Tạo migration cho models mới**:
```bash
python manage.py makemigrations
python manage.py migrate
```

2. **Nâng cấp frontend**:
- Thêm tabs component
- Implement 7 tabs với đầy đủ features
- Cải thiện CSS

3. **Test**:
- Test tất cả APIs
- Test frontend UI
- Test integration

## 📚 FILES CREATED/MODIFIED

### Created:
- `shoe_store/core/ai_service/admin_views.py` - Backend APIs
- `ADMIN_DASHBOARD_UPGRADE.md` - This file

### Modified:
- `shoe_store/core/models.py` - Added 4 new models
- `shoe_store/shoe_store/urls.py` - Added admin URLs

### To Modify:
- `frontend/src/features/admin/AIChatbotDashboard/AIChatbotDashboard.js` - Add tabs
- `frontend/src/features/admin/AIChatbotDashboard/AIChatbotDashboard.css` - Add styles

