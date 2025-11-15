# Werewolves Monitor - Night Phase Specification

## Tổng Quan
Ứng dụng là một Game Master tool cho trò chơi Werewolves (Sói Người). Giai đoạn ban đêm cho phép quản trò thực hiện các hành động của các nhân vật theo một trình tự cụ thể.

## Thứ Tự Gọi Nhân Vật Ban Đêm (Night Phase Order)

Các nhân vật được gọi theo thứ tự dưới đây:

### Nhóm 1: Các Nhân Vật Luôn Gọi Vào Đêm Đầu (§)
1. **Ghost** - Hồn ma: Viết thông điệp cho làng
2. **Cupid** - Thần tình yêu: Chọn 2 người chơi để trở thành tình yêu
3. **Doppelganger** - Người nhân bản: Chọn một người chơi để sao chép vai trò (nếu mục tiêu chết vào đêm)
4. **Nostradamis** - Nhà tiên tri: Dự đoán ai sẽ chết vào đêm tiếp theo

### Nhóm 2: Các Nhân Vật Hành Động Chính
5. **Werewolf** - Sói: Giới thiệu nhau rồi thực hiện hành động theo thứ tự do quản trò sắp xếp
6. **Minion** - Kẻ phản bội (§): Được giới thiệu với sói vào đêm đầu

### Nhóm 3: Các Nhân Vật Đặc Biệt Hành Động Sớm
7. **Vampire** - Ma cà rồng: Chọn nạn nhân (chết vào buổi chiều)
8. **Bogeyman** - Ông kẹ: Tạo sợ hãi cho người được chọn
9. **Leprechaun** - Yêu tinh: Lấy cắp thứ gì đó từ người được chọn
10. **Zombie** - Xác sống: Lây nhiễm cho người được chọn
11. **Count Dracula** - Bá tước Dracula: Hút máu từ người được chọn

### Nhóm 4: Các Nhân Vật Phòng Vệ
12. **Body Guard** - Bảo vệ: Chọn người để bảo vệ khỏi cái chết
13. **Witch** - Phù thủy: Sử dụng phần thuốc chữa bệnh hoặc độc (1 lần mỗi game)
14. **Seer** - Tiên tri: Chọn người để biết họ là sói hay không
15. **Hunter** - Thợ săn: Chuẩn bị bắn ai khi chết (thực hiện vào ban ngày)
16. **Huntress** - Nữ thợ săn: Chuẩn bị bắn ai khi chết (thực hiện vào ban ngày)

### Nhóm 5: Các Nhân Vật Gọi Vào Đêm Đầu (§)
17. **Drunk** - Kẻ say rượu: Trao đổi thẻ vai trò với người được chọn

### Nhóm 6: Các Nhân Vật Điều Tra
18. **P.I** - Thám tử: Điều tra 2 người để biết mối liên hệ
19. **Old Hag** - Mụ già: Nguyền rủa người được chọn (loại bỏ họ khỏi hoạt động)
20. **Troublemaker** - Kẻ phá rối: Hoán đổi 2 người (nếu được kích hoạt)

### Nhóm 7: Các Nhân Vật Gọi Vào Đêm Đầu (§) - Tuỳ Chọn
21. **Virginia Wolf** - Virginia Sói: Tìm một sói khác
22. **Mason** - Sinh đôi: Tìm các sinh đôi khác

### Nhóm 8: Các Nhân Vật Tuỳ Chọn (Quản Trò Sắp Xếp)
23. **Priest** - Mục sư: Bảo vệ người được chọn khỏi cái chết
24. **Martyr** - Kẻ tử đạo: Chuẩn bị để hy sinh cho người khác
25. **Lycan** - Người lai sói: Xuất hiện là sói cho tiên tri (không hành động)
26. **Time Bandit** - Tên cướp thời gian: Lấy lại 1 phút thảo luận từ ngày
27. **Village Idiot** - Thằng ngốc: Chuẩn bị bỏ phiếu (không hành động đêm)
28. **Tanner** - Chán đời: Bỏ qua hành động đêm (không hoạt động)
29. **Prince** - Hoàng tử: Bảo vệ khỏi loại bỏ vào ngày (không hành động đêm)
30. **Tough Guy** - Lực sĩ: Không hành động đêm (hiệu ứng: chết vào đêm tiếp theo nếu bị cắn)
31. **Diseased** - Con bệnh: Không hành động đêm (hiệu ứng: sói bỏ qua lần giết tiếp theo nếu cắn)
32. **Pacifist** - Người yêu hoà bình: Không hành động đêm (bỏ phiếu cứu người ngày hôm sau)
33. **Mayor** - Thị trưởng: Không hành động đêm (phiếu tính gấp đôi)
34. **Old Man** - Ông già: Không hành động đêm (chết vào đêm X)
35. **Apprentice Seer** - Tiên tri tập sự: Học hỏi từ Tiên tri (§ vào đêm đầu)

### Nhóm 9: Các Nhân Vật Cuối Cùng
36. **The Thing** - Quái vật kinh dị: Chọn người để "thay thế"
37. **Sasquatch** - Chân to (§): Tìm một người chơi khác
38. **Cursed** - Kẻ bị nguyền rủa (§): Nhận thức rằng đã bị nguyền nếu được cắn
39. **Cult Leader** - Kẻ sùng đạo: Tuyển dụng người được chọn
40. **Frankenstein** - Quái vật Frankenstein: Hồi sinh hoặc sát hại
41. **Spellcaster** - Pháp sư câm: Im lặng người được chọn (loại bỏ họ khỏi thảo luận ngày hôm sau)
42. **Aura Seer** - Tiên tri vũ trụ: Khám phá nếu người được chọn có vai trò đặc biệt

## Hành Động Từng Nhân Vật (Detailed Actions)

### NIGHT 0 - Đêm Đầu Tiên

#### 1. Ghost (Hồn ma)
- **Nightly**: ALWAYS
- **Action Type**: TEXT_INPUT
- **Description**: Viết một thông điệp cho làng (quản trò sẽ đọc vào ban ngày)
- **UI**: Text input field để nhập thông điệp
- **Database**: Lưu thông điệp vào game log

#### 2. Cupid (Thần tình yêu) §
- **Nightly**: FIRST_NIGHT
- **Action Type**: DUAL_SELECT
- **Description**: Chọn 2 người chơi để trở thành tình yêu. Nếu một người chết, người kia cũng chết
- **UI**: Player selection interface cho phép chọn 2 người khác nhau
- **Database**: Lưu cặp tình yêu vào game state

#### 3. Doppelganger (Người nhân bản) §
- **Nightly**: FIRST_NIGHT
- **Action Type**: SELECT_PLAYER
- **Description**: Chọn một người chơi để sao chép vai trò. Nếu mục tiêu chết vào đêm, Doppelganger sẽ giả như người đó
- **UI**: Player selection interface
- **Database**: Lưu mục tiêu vào game state

#### 4. Nostradamis (Nhà tiên tri) §
- **Nightly**: FIRST_NIGHT
- **Action Type**: SELECT_PLAYER
- **Description**: Dự đoán ai sẽ chết vào đêm tiếp theo
- **UI**: Player selection interface
- **Database**: Lưu dự đoán vào game log (tiết lộ sau khi đêm kết thúc)

### NIGHT MAIN - Các Hành Động Chính

#### 5. Werewolf (Sói) & Wolf Cub (Sói con) & Dire Wolf (Sói tuyết)
- **Nightly**: ALWAYS
- **Action Type**: SELECT_PLAYER (cho mỗi sói)
- **Description**: 
  - Werewolf thông thường giết được 1 người
  - Wolf Cub giết được 1 người nhưng nếu chết thì sói giết được 2 người đêm tiếp theo
  - Dire Wolf giết được 1 người nhưng gắn với một "người bạn" (đêm đầu)
- **UI**: Werewolves riêng biệt, mỗi người giơ bài lên rồi quản trò sắp xếp thứ tự
- **Special**: Quản trò quyết định thứ tự thực hiện hành động nếu có nhiều sói

#### 6. Minion (Kẻ phản bội) §
- **Nightly**: FIRST_NIGHT
- **Action Type**: ACKNOWLEDGE
- **Description**: Nhận biết người được giới thiệu là sói nhưng không hành động cùng họ
- **UI**: Hiển thị danh sách sói để Minion biết
- **Database**: Ghi nhận Minion đã được giới thiệu

### VAMPIRE & SPECIAL ACTIONS

#### 7. Vampire (Ma cà rồng)
- **Nightly**: ALWAYS
- **Action Type**: SELECT_PLAYER
- **Description**: Chọn nạn nhân chết vào buổi chiều (không phải ban đêm)
- **UI**: Player selection interface
- **Database**: Lưu nạn nhân vào game log, chết vào thời gian xác định

#### 8. Bogeyman (Ông kẹ)
- **Nightly**: ALWAYS
- **Action Type**: SELECT_PLAYER
- **Description**: Tạo sợ hãi cho người được chọn (quản trò sẽ thông báo)
- **UI**: Player selection interface
- **Database**: Lưu mục tiêu

#### 9. Leprechaun (Yêu tinh)
- **Nightly**: ALWAYS
- **Action Type**: SELECT_PLAYER
- **Description**: "Lấy cắp" thứ gì từ người được chọn (quản trò sẽ quyết định)
- **UI**: Player selection interface
- **Database**: Lưu mục tiêu

#### 10. Zombie (Xác sống)
- **Nightly**: ALWAYS
- **Action Type**: SELECT_PLAYER
- **Description**: Lây nhiễm cho người được chọn
- **UI**: Player selection interface
- **Database**: Lưu mục tiêu nhiễm

#### 11. Count Dracula (Bá tước Dracula)
- **Nightly**: ALWAYS
- **Action Type**: SELECT_PLAYER
- **Description**: Hút máu từ người được chọn
- **UI**: Player selection interface
- **Database**: Lưu mục tiêu

### PROTECTION & INVESTIGATION

#### 12. Body Guard (Bảo vệ)
- **Nightly**: ALWAYS
- **Action Type**: SELECT_PLAYER
- **Description**: Bảo vệ một người khác khỏi cái chết vào đêm
- **UI**: Player selection interface (không được chọn chính mình)
- **Database**: Lưu người được bảo vệ

#### 13. Witch (Phù thủy)
- **Nightly**: ALWAYS
- **Action Type**: DUAL_OPTION (chọn hành động: chữa/độc/bỏ qua)
- **Description**: 
  - Có 2 phần thuốc: một chữa (cứu người bị giết), một độc (giết ai)
  - Chỉ có 1 lần mỗi loại cho cả game
- **UI**: 
  - Button chọn: "Chữa bệnh", "Dùng độc", "Bỏ qua"
  - Nếu chọn "Chữa": select player (người bị giết)
  - Nếu chọn "Dùng độc": select player (người bất kỳ)
- **Database**: Lưu sử dụng phần thuốc

#### 14. Seer (Tiên tri)
- **Nightly**: ALWAYS
- **Action Type**: SELECT_PLAYER
- **Description**: Chọn người để biết họ là sói hay không (result: "Werewolf" hoặc "Villager")
- **UI**: Player selection interface
- **Database**: Lưu kết quả điều tra

#### 15. Hunter (Thợ săn)
- **Nightly**: NEVER (chỉ hoạt động khi chết ban ngày)
- **Action Type**: NONE
- **Description**: Chuẩn bị để bắn ai khi chết (xử lý vào ban ngày)
- **UI**: Không cần gọi ban đêm
- **Database**: N/A

#### 16. Huntress (Nữ thợ săn)
- **Nightly**: NEVER (chỉ hoạt động khi chết ban ngày)
- **Action Type**: NONE
- **Description**: Chuẩn bị để bắn ai khi chết (xử lý vào ban ngày)
- **UI**: Không cần gọi ban đêm
- **Database**: N/A

### FIRST NIGHT SPECIAL ROLE

#### 17. Drunk (Kẻ say rượu) §
- **Nightly**: FIRST_NIGHT
- **Action Type**: SELECT_PLAYER
- **Description**: Trao đổi thẻ vai trò với người được chọn (không biết mình là sói cho đến đêm 3)
- **UI**: Player selection interface
- **Database**: Lưu trao đổi, ẩn vai trò thực của Drunk

### INVESTIGATION & DISRUPTION

#### 18. P.I (Thám tử)
- **Nightly**: ALWAYS
- **Action Type**: DUAL_SELECT
- **Description**: Điều tra 2 người để biết họ có liên quan (một trong hai có vai trò gian lận?)
- **UI**: Player selection interface cho phép chọn 2 người
- **Database**: Lưu kết quả điều tra

#### 19. Old Hag (Mụ già)
- **Nightly**: ALWAYS
- **Action Type**: SELECT_PLAYER
- **Description**: Nguyền rủa người được chọn (loại bỏ họ khỏi hoạt động ban ngày)
- **UI**: Player selection interface
- **Database**: Lưu mục tiêu bị nguyền

#### 20. Troublemaker (Kẻ phá rối)
- **Nightly**: ALWAYS (hoặc FIRST_NIGHT tuỳ biến thể)
- **Action Type**: DUAL_SELECT
- **Description**: Hoán đổi 2 người (nếu được kích hoạt, có thể làm người khác hoán đổi)
- **UI**: Player selection interface cho phép chọn 2 người
- **Database**: Lưu hoán đổi

### FIRST NIGHT OPTIONAL

#### 21. Virginia Wolf (Virginia Sói) §
- **Nightly**: FIRST_NIGHT
- **Action Type**: SELECT_PLAYER
- **Description**: Tìm một sói khác (nếu không tìm thấy, chết vào đêm tiếp theo)
- **UI**: Player selection interface
- **Database**: Lưu tìm kiếm

#### 22. Mason (Sinh đôi) §
- **Nightly**: FIRST_NIGHT
- **Action Type**: SELECT_PLAYER
- **Description**: Tìm các sinh đôi khác (hoạt động giống nhau)
- **UI**: Player selection interface + danh sách các Mason khác nếu có
- **Database**: Lưu nhóm Mason

### GAMEMASTER ORDERED OPTIONAL ACTIONS

#### 23-35. Các Nhân Vật Tuỳ Chọn (Priest, Martyr, Lycan, etc.)
Tất cả có thể được quản trò gọi vào đêm theo thứ tự tuỳ chọn:

**Priest (Mục sư)**
- **Action Type**: SELECT_PLAYER
- **Description**: Bảo vệ một người khỏi cái chết (1 lần/game)
- **Database**: Lưu sử dụng

**Martyr (Kẻ tử đạo)**
- **Action Type**: ACKNOWLEDGE
- **Description**: Chuẩn bị để hy sinh
- **Database**: N/A

**Lycan (Người lai sói)**
- **Action Type**: NONE
- **Description**: Không hành động đêm (nhưng xuất hiện sói cho tiên tri)
- **Database**: N/A

**Time Bandit (Tên cướp thời gian)**
- **Action Type**: SELECT_PLAYER
- **Description**: Lấy lại 1 phút thảo luận từ ngày hôm trước
- **Database**: Lưu mục tiêu

**Village Idiot (Thằng ngốc)**
- **Action Type**: NONE
- **Description**: Không hành động đêm
- **Database**: N/A

**Tanner (Chán đời)**
- **Action Type**: NONE
- **Description**: Không hành động đêm
- **Database**: N/A

**Prince (Hoàng tử)**
- **Action Type**: NONE
- **Description**: Bảo vệ khỏi loại bỏ vào ngày (không hành động đêm)
- **Database**: N/A

**Tough Guy (Lực sĩ)**
- **Action Type**: NONE
- **Description**: Không hành động đêm (chết vào đêm tiếp theo nếu bị cắn)
- **Database**: N/A

**Diseased (Con bệnh)**
- **Action Type**: NONE
- **Description**: Không hành động đêm (sói bỏ qua lần giết tiếp theo nếu cắn)
- **Database**: N/A

**Pacifist (Người yêu hoà bình)**
- **Action Type**: NONE
- **Description**: Không hành động đêm
- **Database**: N/A

**Mayor (Thị trưởng)**
- **Action Type**: NONE
- **Description**: Không hành động đêm
- **Database**: N/A

**Old Man (Ông già)**
- **Action Type**: NONE
- **Description**: Không hành động đêm (chết vào đêm X = số sói + 1)
- **Database**: N/A

**Apprentice Seer (Tiên tri tập sự) §**
- **Action Type**: ACKNOWLEDGE (vào đêm đầu)
- **Description**: Nhận thức vai trò trước khi Tiên tri
- **Database**: Ghi nhận

### FINAL ACTIONS

#### 36. The Thing (Quái vật kinh dị)
- **Nightly**: ALWAYS
- **Action Type**: SELECT_PLAYER
- **Description**: Chọn người để "thay thế"
- **Database**: Lưu mục tiêu

#### 37. Sasquatch (Chân to) §
- **Nightly**: FIRST_NIGHT
- **Action Type**: SELECT_PLAYER
- **Description**: Tìm một người chơi khác để "ghép"
- **Database**: Lưu ghép

#### 38. Cursed (Kẻ bị nguyền rủa) §
- **Nightly**: FIRST_NIGHT
- **Action Type**: ACKNOWLEDGE
- **Description**: Nhận thức rằng đã bị nguyền (nếu được cắn vào đêm sau)
- **Database**: Ghi nhận

#### 39. Cult Leader (Kẻ sùng đạo)
- **Nightly**: ALWAYS
- **Action Type**: SELECT_PLAYER
- **Description**: Tuyển dụng người được chọn vào giáo phái
- **UI**: Player selection interface
- **Database**: Lưu tuyển dụng

#### 40. Frankenstein (Quái vật Frankenstein)
- **Nightly**: ALWAYS
- **Action Type**: DUAL_OPTION (chọn: hồi sinh hoặc sát hại)
- **Description**: Hồi sinh ai hoặc sát hại ai
- **Database**: Lưu hành động

#### 41. Spellcaster (Pháp sư câm)
- **Nightly**: ALWAYS
- **Action Type**: SELECT_PLAYER
- **Description**: Im lặng người được chọn (loại bỏ khỏi thảo luận ban ngày hôm sau)
- **UI**: Player selection interface
- **Database**: Lưu im lặng

#### 42. Aura Seer (Tiên tri vũ trụ)
- **Nightly**: ALWAYS
- **Action Type**: SELECT_PLAYER
- **Description**: Khám phá nếu người được chọn có vai trò đặc biệt (không phải villager/werewolf)
- **UI**: Player selection interface
- **Database**: Lưu kết quả

## Yêu Cầu Kỹ Thuật

### 1. Cấu Trúc Dữ Liệu
- Mở rộng `Role` interface để bao gồm:
  - `nightOrder`: số thứ tự gọi ban đêm (1-42)
  - `actionType`: loại hành động ('SELECT_PLAYER', 'DUAL_SELECT', 'TEXT_INPUT', 'ACKNOWLEDGE', 'DUAL_OPTION', 'NONE')
  - `maxUsesPerGame`: số lần sử dụng tối đa mỗi game (null = vô hạn)
  - `displayOrder`: thứ tự hiển thị trong giao diện
  - `defaultOrderPosition`: vị trí mặc định trong thứ tự GM

### 2. Component RoleAction
- Hỗ trợ các `actionType` khác nhau:
  - SELECT_PLAYER: chọn một người chơi
  - DUAL_SELECT: chọn hai người chơi
  - TEXT_INPUT: nhập văn bản
  - DUAL_OPTION: chọn giữa 2 tùy chọn
  - ACKNOWLEDGE: chỉ xác nhận
  - NONE: không có hành động

### 3. Store Updates
- Mở rộng `useNightPhaseActions` composable để xử lý tất cả role action types
- Thêm logic để kiểm soát `maxUsesPerGame`
- Thêm logic để xử lý tài trợ (lovers, possessed, etc.)

### 4. Giao Diện
- Cập nhật `RoleActionPanel.vue` để hiển thị các role theo thứ tự đúng
- Hỗ trợ nhiều loại input (text, selection dual, etc.)
- Hiển thị thông tin vai trò (mô tả, icon, hành động)

### 5. Xử Lý Hành Động
- Tạo logic để xử lý từng loại hành động
- Tạo logic để giải quyết xung đột (ví dụ: bảo vệ vs giết)
- Tạo logic để xử lý liên kết (ví dụ: tình yêu, người nhân bản)

## Các Tệp Cần Sửa Đổi

1. **app/stores/roles.ts**
   - Thêm tất cả role mới với thông tin `nightOrder`, `actionType`, etc.
   - Cập nhật `Role` interface

2. **app/types/game.ts**
   - Mở rộng `RoleActionType` type
   - Thêm các type mới cho game state (lovers, possessions, etc.)

3. **app/composables/useNightPhaseActions.ts**
   - Thêm handler cho mỗi role
   - Thêm logic để giải quyết xung đột

4. **app/components/RoleActionPanel.vue**
   - Sắp xếp role theo `nightOrder`
   - Thêm logic để lọc role theo điều kiện (FIRST_NIGHT, ALWAYS, etc.)

5. **app/components/RoleAction.vue**
   - Hỗ trợ các `actionType` khác nhau
   - Thêm UI cho TEXT_INPUT, DUAL_OPTION, etc.

6. **app/stores/game.ts**
   - Thêm trạng thái để lưu tài trợ (lovers, possessed, etc.)
   - Thêm trạng thái để lưu sử dụng vai trò (Witch potion, etc.)

7. **i18n/locales/en.json** & **vi.json**
   - Thêm translation cho tất cả role
   - Thêm translation cho action descriptions

## Phụ Lục: Ghi Chú Implementation

### Priority (Ưu Tiên)

**Phase 1 (CRITICAL):**
- Werewolf (đã hoàn thành)
- Seer (Tiên tri)
- Witch (Phù thủy)
- Body Guard (Bảo vệ)

**Phase 2 (HIGH):**
- Cupid (Thần tình yêu)
- Minion (Kẻ phản bội)
- Mason (Sinh đôi)
- Old Hag (Mụ già)

**Phase 3 (MEDIUM):**
- Vampire (Ma cà rồng)
- Cult Leader (Kẻ sùng đạo)
- Hunter (Thợ săn)
- All other optional roles

**Phase 4 (LOW):**
- Less common roles (Ghost, Nostradamis, etc.)

### Action Resolution Order

1. **Khôi phục hành động** (Apprentice Seer hỗ trợ Seer)
2. **Thực hiện bảo vệ** (Body Guard, Priest)
3. **Thực hiện hành động "lấy cắp"** (Leprechaun, Time Bandit)
4. **Thực hiện điều tra** (Seer, P.I, Aura Seer)
5. **Thực hiện giết/độc** (Werewolf, Witch, Vampire)
6. **Xử lý Lovers** (nếu một người trong cặp chết)
7. **Xử lý Possessed** (Doppelganger thay thế)
8. **Xử lý Curse** (Cursed trở thành Werewolf)


