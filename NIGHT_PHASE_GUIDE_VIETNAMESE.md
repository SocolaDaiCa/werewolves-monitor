# 🌙 Hướng Dẫn Phát Triển Ban Đêm - Tiếng Việt

## 📋 Tóm Tắt Dự Án

Bạn đang phát triển một ứng dụng **Game Master** cho trò chơi **Werewolves (Sói Người)**. Ứng dụng này giúp quản trò theo dõi các hành động của nhân vật trong trò chơi.

### Hiện Tại ✅
- Werewolf cơ bản (sói giết người đêm)

### Cần Thêm
- 30+ nhân vật khác với tính năng ban đêm

---

## 🎯 Các Giai Đoạn Phát Triển

### Giai Đoạn 1: CẶP (Rất Quan Trọng) ⚡⚡⚡
**Thời gian: 40-60 giờ**

Các nhân vật quan trọng nhất:

1. **Tiên Tri** (Seer) - Điều tra: mục tiêu là sói hay không?
2. **Phù Thủy** (Witch) - Chữa bệnh/Dùng độc (mỗi cái 1 lần)
3. **Bảo Vệ** (Body Guard) - Bảo vệ người chơi khỏi cái chết
4. **Sói Con** (Wolf Cub) - Sói đặc biệt
5. **Sói Tuyết** (Dire Wolf) - Sói đặc biệt khác

**Tại sao quan trọng?** Cần có investigation & protection để game cân bằng

---

### Giai Đoạn 2: QUAN TRỌNG ⚡⚡
**Thời gian: 50-80 giờ**

Các nhân vật đêm đầu & liên hệ:

1. **Thần Tình Yêu** (Cupid) - Tạo cặp tình yêu (chết theo nhau)
2. **Kẻ Phản Bội** (Minion) - Học biết danh tính sói
3. **Sinh Đôi** (Mason) - Tìm Sinh Đôi khác
4. **Kẻ Say Rượu** (Drunk) - Trao đổi vai trò với ai
5. **Mụ Già** (Old Hag) - Nguyền rủa người chơi
6. **Người Nhân Bản** (Doppelganger) - Sao chép vai trò
7. **Nhà Tiên Tri** (Nostradamis) - Dự đoán ai chết

**Tại sao quan trọng?** Tạo ra các liên hệ phức tạp trong trò

---

### Giai Đoạn 3: TRUNG BÌNH ⚡
**Thời gian: 60-100 giờ**

Các vai trò đặc biệt:

1. **Ma Cà Rồng** (Vampire) - Giết vào buổi chiều
2. **Kẻ Sùng Đạo** (Cult Leader) - Tuyển dụng người chơi
3. **Thợ Săn** (Hunter) - Bắn khi bị loại
4. **Tiên Tri Vũ Trụ** (Aura Seer) - Phát hiện vai trò đặc biệt
5. **Thám Tử** (P.I) - Điều tra mối liên hệ
6. **Pháp Sư Câm** (Spellcaster) - Làm im lặng
7. **Kẻ Phá Rối** (Troublemaker) - Hoán đổi 2 người
8. **Mục Sư** (Priest) - Bảo vệ (1 lần)

---

### Giai Đoạn 4: ÍT DÙNG 🔸
**Thời gian: 40-60 giờ**

Các vai trò hiếm & niche:

- **Hồn Ma** (Ghost) - Gửi tin nhắn
- **Ông Kẹ, Yêu Tinh, Xác Sống, Bá Tước** - Hiệu ứng đặc biệt
- **Các vai trò khác** - Martyr, Lycan, Time Bandit, v.v.

---

## 🏗️ Thay Đổi Mã Nguồn Cần Làm

### 1. Cập Nhật Cấu Trúc Dữ Liệu

**Tệp: `app/stores/roles.ts`**

Thêm 5 trường vào `Role` interface:

```typescript
interface Role {
  // ... trường hiện tại ...
  
  nightOrder: number           // Thứ tự gọi (1-42)
  actionType: RoleActionType   // Loại hành động
  maxUsesPerGame?: number      // Sử dụng tối đa (null = vô hạn)
  displayOrder?: number        // Ưu tiên hiển thị
  defaultOrderPosition?: number // Vị trí mặc định
}

// Loại hành động
type RoleActionType = 
  'SELECT_PLAYER'   // Chọn 1 người
  | 'DUAL_SELECT'   // Chọn 2 người
  | 'TEXT_INPUT'    // Nhập văn bản
  | 'DUAL_OPTION'   // Chọn giữa 2 tuỳ chọn
  | 'ACKNOWLEDGE'   // Chỉ xác nhận
  | 'NONE'          // Không có hành động
```

### 2. Cập Nhật Game State

**Tệp: `app/stores/game.ts`**

Thêm trạng thái mới:

```typescript
// Liên hệ giữa người chơi
const lovers = ref<[string, string][]>([])        // Cặp tình yêu
const possessed = ref<Map<string, string>>()      // Người nhân bản sao chép
const cursed = ref<string[]>([])                  // Người bị nguyền
const silenced = ref<string[]>([])                // Người bị im lặng

// Theo dõi sử dụng khả năng
const witchHealUsed = ref(false)
const witchPoisonUsed = ref(false)
const drunkRealRole = ref({})
```

### 3. Thêm Nhân Vật Vào Roles

**Tệp: `app/stores/roles.ts`**

Uncomment & cập nhật các nhân vật từ dòng 30+:

```typescript
{
  id: 'seer',
  name: 'Seer',
  nameVi: 'Tiên Tri',
  description: 'Each night, choose a player to learn if they are a werewolf or not.',
  descriptionVi: 'Mỗi đêm, chọn một người chơi để biết họ có phải sói hay không.',
  faction: 'VILLAGER',
  balancePoints: 7,
  nightly: 'ALWAYS',
  nightOrder: 14,           // ← THÊM
  actionType: 'SELECT_PLAYER', // ← THÊM
  maxUsesPerGame: undefined // ← THÊM
}
```

### 4. Cập Nhật Components

**Tệp: `app/components/RoleAction.vue`**

Hỗ trợ tất cả loại hành động:
- SELECT_PLAYER: Dropdown chọn 1 người
- DUAL_SELECT: Chọn 2 người khác nhau
- TEXT_INPUT: Ô nhập văn bản
- DUAL_OPTION: 2 nút bấm
- ACKNOWLEDGE: Nút xác nhận
- NONE: Chỉ hiển thị

### 5. Cập Nhật Xử Lý Hành Động

**Tệp: `app/composables/useNightPhaseActions.ts`**

Thêm handler cho mỗi nhân vật:

```typescript
case 'seer':
  handleSeerInvestigation(action)
  break
case 'witch':
  handleWitchAction(action)
  break
case 'bodyguard':
  handleProtection(action)
  break
// ... thêm các role khác
```

### 6. Thêm Bản Dịch

**Tệp: `i18n/locales/en.json` & `vi.json`**

Thêm tên & mô tả cho tất cả nhân vật

---

## 📊 Thứ Tự Gọi Ban Đêm (Đơn Giản)

```
ĐÊM ĐẦU TIÊN:
1. Ghost (Hồn ma)
2. Cupid (Thần tình yêu) 
3. Doppelganger (Người nhân bản)
...

MỖI ĐÊM:
5. Werewolf (Sói)
6. Minion (Kẻ phản bội) - chỉ đêm đầu
7. Vampire (Ma cà rồng)
...
12. Body Guard (Bảo vệ)
13. Witch (Phù thủy)
14. Seer (Tiên tri)
...

GM TỰ CHỌN THỨ TỰ:
23. Priest (Mục sư)
24. Martyr (Kẻ tử đạo)
... và các vai trò khác
```

---

## 🧪 Ví Dụ: Triển Khai Tiên Tri

### Bước 1: Thêm vào roles.ts

```typescript
{
  id: 'seer',
  name: 'Seer',
  nameVi: 'Tiên Tri',
  description: 'Each night, choose a player to learn if they are a werewolf or not.',
  descriptionVi: 'Mỗi đêm, chọn một người chơi để biết họ có phải sói hay không.',
  faction: 'VILLAGER',
  balancePoints: 7,
  nightly: 'ALWAYS',
  nightOrder: 14,
  actionType: 'SELECT_PLAYER',
  maxUsesPerGame: undefined
}
```

### Bước 2: Thêm handler vào useNightPhaseActions.ts

```typescript
case 'seer':
  handleSeerInvestigation(action)
  break

// Định nghĩa hàm
const handleSeerInvestigation = (action: RoleAction) => {
  if (action.targetPlayerId) {
    const targetRole = gameStore.playerRoles[action.targetPlayerId]
    const isWerewolf = targetRole === 'werewolf'
    
    investigationResults.value.set(action.playerId, isWerewolf)
    results.value.push({
      playerId: action.playerId,
      action: 'investigate',
      success: true,
      message: isWerewolf ? 'Đó là sói' : 'Đó không phải sói',
      affectedPlayer: action.targetPlayerId
    })
  }
}
```

### Bước 3: Thêm bản dịch

**en.json:**
```json
{
  "roles": {
    "seer": {
      "name": "Seer",
      "description": "Each night, choose a player to learn if they are a werewolf or not."
    }
  }
}
```

**vi.json:**
```json
{
  "roles": {
    "seer": {
      "name": "Tiên Tri",
      "description": "Mỗi đêm, chọn một người chơi để biết họ có phải sói hay không."
    }
  }
}
```

---

## ⚠️ Những Lỗi Thường Gặp

### ❌ Quên thêm nightOrder
Kết quả: Nhân vật không xuất hiện trong thứ tự đúng

**Fix:** Thêm `nightOrder: <số>` vào tất cả role

### ❌ Để người chơi chết được chọn làm mục tiêu
Kết quả: Tiên tri điều tra người chết

**Fix:** Kiểm tra `gameStore.alivePlayers.includes(targetId)`

### ❌ Bảo vệ được áp dụng SAU khi người chết
Kết quả: Người bảo vệ vẫn chết

**Fix:** Kiểm tra bảo vệ TRƯỚC tiêu diệt

### ❌ Quên filter FIRST_NIGHT
Kết quả: Cupid gọi vào đêm 2

**Fix:** Kiểm tra `role.nightly === 'FIRST_NIGHT' && gameStore.round !== 1`

### ❌ Không theo dõi sử dụng khả năng
Kết quả: Phù thủy dùng độc vô số lần

**Fix:** Đặt cờ `witchPoisonUsed = true` sau khi sử dụng

---

## 📈 Lộ Trình Triển Khai

### Tuần 1-2: Nền Tảng (20 giờ)
- [ ] Cập nhật Role interface
- [ ] Thêm Phase 1 roles
- [ ] Cập nhật game store
- [ ] Tạo components cơ bản

### Tuần 2-3: Phase 1 (20 giờ)
- [ ] Tiên Tri
- [ ] Phù Thủy
- [ ] Bảo Vệ
- [ ] Sói Con & Sói Tuyết

### Tuần 3-4: Phase 2 (25 giờ)
- [ ] Thần Tình Yêu
- [ ] Kẻ Phản Bội
- [ ] Sinh Đôi
- [ ] Kẻ Say Rượu
- [ ] Mụ Già
- [ ] Người Nhân Bản
- [ ] Nhà Tiên Tri

### Tuần 4-5: Phase 3 (30 giờ)
- [ ] Ma Cà Rồng
- [ ] Kẻ Sùng Đạo
- [ ] Thợ Săn
- [ ] Các vai trò Phase 3 khác

### Tuần 5-6: Phase 4 & Kiểm Thử (30 giờ)
- [ ] Các vai trò còn lại
- [ ] Kiểm thử E2E
- [ ] Fix bug
- [ ] Tối ưu

**Tổng cộng: 200-250 giờ (~6 tuần)**

---

## 🎯 Tiêu Chí Thành Công

### Phase 1 Hoàn Thành ✅
- ✅ Tiên Tri có thể điều tra
- ✅ Phù Thủy có thể chữa/độc
- ✅ Bảo Vệ có thể bảo vệ
- ✅ Tất cả loại hành động hoạt động
- ✅ Không có xung đột giải quyết sai

### Phase 2 Hoàn Thành ✅
- ✅ Tình yêu chết theo nhau
- ✅ Minion biết danh tính sói
- ✅ Các liên hệ khác hoạt động

### Full Implementation ✅
- ✅ Tất cả 30+ role hoạt động
- ✅ Không lỗi console
- ✅ UI thân thiện với GM
- ✅ Bản dịch tiếng Việt

---

## 📚 Tài Liệu Chi Tiết

Để hiểu rõ hơn, đọc:

1. **NIGHT_PHASE_SPEC.md** - Mô tả chi tiết mỗi role
2. **IMPLEMENTATION_GUIDE.md** - Hướng dẫn kỹ thuật
3. **QUICK_REFERENCE.md** - Tham khảo nhanh
4. **FILES_TO_MODIFY.md** - Tệp nào cần sửa

---

## 🚀 Bắt Đầu Ngay

### Bước 1: Hiểu Kiến Trúc (1 giờ)
- Đọc file `app/stores/roles.ts`
- Đọc file `app/components/RoleActionPanel.vue`
- Đọc file `app/composables/useNightPhaseActions.ts`

### Bước 2: Cập Nhật Interface (1 giờ)
- Thêm `nightOrder`, `actionType` vào Role
- Thêm trạng thái vào game store

### Bước 3: Thêm Phase 1 Roles (1 giờ)
- Uncomment Seer, Witch, Body Guard
- Thêm các trường mới

### Bước 4: Triển Khai Phase 1 (4-6 giờ)
- Thêm handlers
- Cập nhật UI
- Thêm bản dịch

### Bước 5: Kiểm Thử (2 giờ)
- Test tìm hiểu, bảo vệ, chữa/độc
- Fix bug

### Bước 6: Tiếp Tục Phase 2, 3, 4
- Lặp lại các bước trên

---

## 💡 Mẹo Hữu Ích

1. **Sắp xếp role đúng**: Dùng `nightOrder` để sắp xếp, không sắp xếp ngẫu nhiên

2. **Kiểm tra người sống**: Luôn kiểm tra `gameStore.alivePlayers` trước khi chọn mục tiêu

3. **Theo dõi khả năng**: Dùng flag boolean cho khả năng 1 lần (Witch potions)

4. **Test từng phase**: Không chờ tới cuối rồi test

5. **Dùng console.log**: Debug thường xuyên để hiểu flow

---

## 🎮 Quy Trình Game Master

1. GM bắt đầu trò chơi
2. Chỉ định vai trò cho người chơi
3. Vào ban đêm:
   - Chọn từng role theo thứ tự
   - Thực hiện hành động
   - Tiếp tục role tiếp theo
4. Hoàn thành ban đêm
5. Hiển thị kết quả
6. Vào ban ngày

---

## ❓ Câu Hỏi Thường Gặp

**Q: Có phải implement tất cả 42 role không?**
A: Không, chỉ implement role trong `defaultRoles` array

**Q: Tại sao cần nightOrder?**
A: Để gọi role theo thứ tự đúng (Tiên Tri trước, Sói sau, v.v.)

**Q: Làm sao xử lý khả năng 1 lần?**
A: Dùng `maxUsesPerGame: 1` và flag `witchHealUsed`

**Q: Nếu 2 người chết cùng 1 đêm?**
A: Cả 2 chết, hiển thị trong morning report

**Q: Các nhân vật đêm đầu gọi khi nào?**
A: Chỉ gọi khi `gameStore.round === 1`

---

## ✅ Checklist Bắt Đầu

- [ ] Đã đọc SUMMARY.md
- [ ] Đã hiểu kiến trúc hiện tại
- [ ] Đã chuẩn bị cập nhật Role interface
- [ ] Đã lên kế hoạch Phase 1
- [ ] Sẵn sàng bắt đầu code

---

**Tổng Thời Gian Dự Kiến: 200-250 giờ**

**Bắt Đầu Ngay!** ✨


