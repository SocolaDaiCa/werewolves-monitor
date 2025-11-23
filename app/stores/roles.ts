import { defineStore } from 'pinia'
import {type Role, RoleId} from '~/types/role'
import { RoleFaction, NightlyActivity, RoleActionType } from '~/types/role'
import { useI18n } from 'vue-i18n'

let roleNightOrder = 1

enum RoleNightOrder {
    // 12. Body Guard (Bảo vệ)
    BODYGUARD = roleNightOrder++,
    /*------------*/
    // 1. Ghost (Hồn ma)
    // 2. § Cupid (Thần tình yêu)
    // 3. § Doppelganger (Người nhân bản)
    // 4. § Nostradamis
    // 5. Werewolf (Tất cả sói): Các sói sẽ giới thiệu chức năng của nhau bằng cách giơ bài lên, sau đó quản trò sẽ sắp xếp thứ tự để từng Sói thực hiện chức năng.
    WEREWOLF = roleNightOrder++,
    // 6. § Minion(Kẻ phản bội)
    // 7. Vampire(Ma cà rồng)
    // 8. Bogeyman (Ông kẹ)
    // 9. Leprechaun (Yêu tinh)
    // 10. Zombie (Xác sống)
    // 11. Count Dracula (Bá tước Dracula)
    // 13. Witch (Phù thuỷ)
    WITCH = roleNightOrder++,
    // 14. Seer (Tiên tri)
    SEER = roleNightOrder++,
    // 15. Hunter(Thợ săn)
    // 16. Huntress (Nữ thợ săn)
    // 17. § Drunk (Kẻ say rượu)
    // 18. P.I
    // 19. Old Hag (Mụ già)
    // 20. Troublemaker (Kẻ phá rối)
    // 21. § Virginia Wolf
    // 22. § Mason (Hội tam điểm)
    // 23. § Các chức năng sau theo thứ tự tuỳ ý của quản trò, dưới đây là thứ tự mà tôi mong muốn:
    //     - Priest (Mục sư)
    //     - Martyr (Kẻ tử đạo)
    //     - Lycan (Người lai sói)
    //     - Time Bandit (Tên cướp thời gian)
    //     - Village Idiot (Thằng ngốc)
    //     - Tanner (Chán đời)
    //     - Prince (Hoàng tử)
    //     - Tough Guy (Lực sĩ)
    //     - Diseased (Con bệnh)
    //     - Pacifist (Người yêu hoà bình)
    //     - Mayor (Thị trưởng)
    //     - Old Man (Ông già)
    //     - Aprentice Seer (Tiên tri tập sự)
    // 24. The thing (Quái vật kinh dị)
    // 25. § Sasquatch (Chân to)
    // 26. § Cursed (Kẻ bị nguyền rủa)
    // 27. Cult Leader (Kẻ sùng đạo)
    // 28. Frankenstein (Quái vật Frankenstein)
    // 29. Spellcaster (Pháp sư câm)
    // 30. Aura Seer (Tiên tri vũ trụ)
}

// All roles from Ultimate Werewolf with balance points and Vietnamese translations
const defaultRoles: Role[] = [
    // VILLAGER FACTION
    {
        id: RoleId.VILLAGER,
        name: 'Villager',
        nameVi: 'Dân Làng',
        description: 'An ordinary villager trying to find and eliminate the werewolves.',
        descriptionVi: 'Một dân thường bình thường cố gắng tìm và tiêu diệt các con sói.',
        faction: RoleFaction.VILLAGER,
        balancePoints: 1,
        nightly: NightlyActivity.NEVER,
    },
    {
        id: RoleId.SEER,
        name: 'Seer',
        nameVi: 'Tiên Tri',
        description: 'Each night, choose a player to learn if they are a werewolf or not.',
        descriptionVi: 'Mỗi đêm, chọn một người chơi để biết họ có phải sói hay không.',
        faction: RoleFaction.VILLAGER,
        balancePoints: 7,
        nightly: NightlyActivity.ALWAYS,
        nightOrder: RoleNightOrder.SEER,
        actionType: RoleActionType.SELECT_PLAYER,
    },
    {
        id: RoleId.WITCH,
        name: 'Witch',
        nameVi: 'Phù Thủy',
        description: 'Each night, choose to heal someone (save from death) or poison someone. One use of each potion per game.',
        descriptionVi: 'Mỗi đêm, chọn để cứu chữa ai đó (tránh tử) hoặc làm ai đó bị độc. Mỗi loại thuốc dùng một lần mỗi game.',
        faction: RoleFaction.VILLAGER,
        balancePoints: 4,
        nightly: NightlyActivity.ALWAYS,
        nightOrder: RoleNightOrder.WITCH,
        actionType: RoleActionType.DUAL_OPTION,
    },
    // {
    //   id: 'hunter',
    //   name: 'Hunter',
    //   nameVi: 'Thợ Săn',
    //   description: 'When you die, shoot someone to eliminate them.',
    //   descriptionVi: 'Khi bạn chết, bắn ai đó để tiêu diệt họ.',
    //   faction: 'VILLAGER',
    //   balancePoints: 3,
    //   nightly: 'NEVER',
    // },
    // {
    //   id: 'mayor',
    //   name: 'Mayor',
    //   nameVi: 'Thị Trưởng',
    //   description: 'Your vote counts twice during the day elimination.',
    //   descriptionVi: 'Phiếu bầu của bạn được tính gấp đôi trong ngày loại bỏ.',
    //   faction: 'VILLAGER',
    //   balancePoints: 2,
    //   nightly: 'NEVER',
    // },
    // {
    //   id: 'aura-seer',
    //   name: 'Aura Seer',
    //   nameVi: 'Tiên Tri Hào Quang',
    //   description: 'Each night, discover if a player has a special role.',
    //   descriptionVi: 'Mỗi đêm, khám phá nếu một người chơi có chức năng đặc biệt.',
    //   faction: 'VILLAGER',
    //   balancePoints: 4,
    //   nightly: 'ALWAYS',
    // },
    {
        id: RoleId.BODYGUARD,
        name: 'Body Guard',
        nameVi: 'Bảo Vệ',
        description: 'Each night, choose a different player to protect from death.',
        descriptionVi: 'Mỗi đêm, chọn một người khác để bảo vệ khỏi cái chết.',
        faction: RoleFaction.VILLAGER,
        balancePoints: 3,
        nightly: NightlyActivity.ALWAYS,
        nightOrder: RoleNightOrder.BODYGUARD,
        actionType: RoleActionType.SELECT_PLAYER,
    },
    // {
    //   id: 'apprentice-seer',
    //   name: 'Apprentice Seer',
    //   nameVi: 'Tiên Tri Tập Sự',
    //   description: 'Become the Seer if the Seer dies.',
    //   descriptionVi: 'Trở thành Tiên Tri nếu Tiên Tri chết.',
    //   faction: 'VILLAGER',
    //   balancePoints: -3,
    //   nightly: 'FIRST_NIGHT',
    // },
    // {
    //   id: 'cupid',
    //   name: 'Cupid',
    //   nameVi: 'Thần Tình Yêu',
    //   description: 'First night, choose 2 players to be lovers. If one dies, the other dies too.',
    //   descriptionVi: 'Đêm đầu, chọn 2 người chơi trở thành người yêu. Nếu 1 chết, người kia cũng chết.',
    //   faction: 'VILLAGER',
    //   balancePoints: 3,
    //   nightly: 'FIRST_NIGHT',
    // },
    // {
    //   id: 'diseased',
    //   name: 'Diseased',
    //   nameVi: 'Người Bệnh',
    //   description: 'If a werewolf bites you, they skip their next kill.',
    //   descriptionVi: 'Nếu sói cắn bạn, họ sẽ bỏ qua lần giết tiếp theo.',
    //   faction: 'VILLAGER',
    //   balancePoints: 3,
    //   nightly: 'NEVER',
    // },
    // {
    //   id: 'ghost',
    //   name: 'Ghost',
    //   nameVi: 'Con Ma',
    //   description: 'Dies on first night. Each night, write a message for the village.',
    //   descriptionVi: 'Chết đêm đầu. Mỗi đêm, viết một thông điệp cho làng.',
    //   faction: 'VILLAGER',
    //   balancePoints: 2,
    //   nightly: 'ALWAYS',
    // },
    // {
    //   id: 'idiot',
    //   name: 'Idiot',
    //   nameVi: 'Thằng Ngốc',
    //   description: 'You must always vote to eliminate someone during the day.',
    //   descriptionVi: 'Bạn phải luôn bỏ phiếu để loại bỏ ai đó trong ngày.',
    //   faction: 'VILLAGER',
    //   balancePoints: 2,
    //   nightly: 'NEVER',
    // },
    // {
    //   id: 'martyr',
    //   name: 'Martyr',
    //   nameVi: 'Thiếu Nữ',
    //   description: 'You can sacrifice yourself for someone being eliminated.',
    //   descriptionVi: 'Bạn có thể hy sinh bản thân cho ai đó bị loại bỏ.',
    //   faction: 'VILLAGER',
    //   balancePoints: 3,
    //   nightly: 'NEVER',
    // },
    // {
    //   id: 'mason',
    //   name: 'Mason',
    //   nameVi: 'Sinh Đôi',
    //   description: 'First night, discover other Masons. Keep the secret or die.',
    //   descriptionVi: 'Đêm đầu, khám phá Sinh Đôi khác. Giữ bí mật hoặc chết.',
    //   faction: 'VILLAGER',
    //   balancePoints: 2,
    //   nightly: 'FIRST_NIGHT',
    // },
    // {
    //   id: 'old-hag',
    //   name: 'Old Hag',
    //   nameVi: 'Phù Thủy Già',
    //   description: 'Each night, curse a player to remove them from village activities for a day.',
    //   descriptionVi: 'Mỗi đêm, nguyền rủa người chơi để loại bỏ họ khỏi hoạt động làng một ngày.',
    //   faction: 'VILLAGER',
    //   balancePoints: 1,
    //   nightly: 'ALWAYS',
    // },
    // {
    //   id: 'old-man',
    //   name: 'Old Man',
    //   nameVi: 'Ông Già',
    //   description: 'Dies on night X (where X = number of werewolves + 1).',
    //   descriptionVi: 'Chết vào đêm X (X = số sói hiện tại + 1).',
    //   faction: 'VILLAGER',
    //   balancePoints: 0,
    //   nightly: 'NEVER',
    // },
    // {
    //   id: 'paranormal-investigator',
    //   name: 'Paranormal Investigator',
    //   nameVi: 'Thám Tử',
    //   description: 'Once per game, learn if at least one werewolf is near a chosen player.',
    //   descriptionVi: 'Một lần mỗi game, biết nếu có ít nhất một sói gần người chơi được chọn.',
    //   faction: 'VILLAGER',
    //   balancePoints: 3,
    //   nightly: 'ALWAYS',
    // },
    // {
    //   id: 'pacifist',
    //   name: 'Pacifist',
    //   nameVi: 'Người Yêu Hòa Bình',
    //   description: 'You always vote to save people during eliminations.',
    //   descriptionVi: 'Bạn luôn bỏ phiếu để cứu mọi người trong các lần loại bỏ.',
    //   faction: 'VILLAGER',
    //   balancePoints: -1,
    //   nightly: 'NEVER',
    // },
    // {
    //   id: 'priest',
    //   name: 'Priest',
    //   nameVi: 'Thầy Tu',
    //   description: 'Once per game, protect a player from death.',
    //   descriptionVi: 'Một lần mỗi game, bảo vệ một người chơi khỏi cái chết.',
    //   faction: 'VILLAGER',
    //   balancePoints: 3,
    //   nightly: 'ALWAYS',
    // },
    // {
    //   id: 'prince',
    //   name: 'Prince',
    //   nameVi: 'Hoàng Tử',
    //   description: 'Your first elimination attempt fails. After, you act like a villager.',
    //   descriptionVi: 'Nỗ lực loại bỏ đầu tiên của bạn thất bại. Sau đó, bạn hoạt động như một dân làng.',
    //   faction: 'VILLAGER',
    //   balancePoints: 3,
    //   nightly: 'NEVER',
    // },
    // {
    //   id: 'spellcaster',
    //   name: 'Spellcaster',
    //   nameVi: 'Người Phù Phép',
    //   description: 'Each night, silence a player for the next day.',
    //   descriptionVi: 'Mỗi đêm, im lặng một người chơi cho ngày hôm sau.',
    //   faction: 'VILLAGER',
    //   balancePoints: 1,
    //   nightly: 'ALWAYS',
    // },
    // {
    //   id: 'tough-guy',
    //   name: 'Tough Guy',
    //   nameVi: 'Người Cứng Cỏi',
    //   description: 'If bitten by a werewolf, you die the following night, not immediately.',
    //   descriptionVi: 'Nếu bị sói cắn, bạn chết vào đêm tiếp theo, không phải ngay lập tức.',
    //   faction: 'VILLAGER',
    //   balancePoints: 1,
    //   nightly: 'NEVER',
    // },
    // {
    //   id: 'troublemaker',
    //   name: 'Troublemaker',
    //   nameVi: 'Kẻ Phá Rối',
    //   description: 'Once per game, cause two eliminations to happen the next day.',
    //   descriptionVi: 'Một lần mỗi game, gây ra hai lần loại bỏ vào ngày hôm sau.',
    //   faction: 'VILLAGER',
    //   balancePoints: -3,
    //   nightly: 'ALWAYS',
    // },

    // WEREWOLF FACTION
    {
        id: RoleId.WEREWOLF,
        icon: '🐺',
        name: 'Werewolf',
        nameVi: 'Sói',
        description: 'Each night, choose a player to eliminate.',
        descriptionVi: 'Mỗi đêm, chọn một người chơi để tiêu diệt.',
        faction: RoleFaction.WEREWOLF,
        balancePoints: -6,
        nightOrder: RoleNightOrder.WEREWOLF,
        nightly: NightlyActivity.ALWAYS,
    },
    // {
    //   id: 'sorceress',
    //   name: 'Sorceress',
    //   nameVi: 'Pháp Sư Sói',
    //   description: 'Each night, discover who the Seer is.',
    //   descriptionVi: 'Mỗi đêm, khám phá ai là Tiên Tri.',
    //   faction: 'WEREWOLF',
    //   balancePoints: -6,
    //   nightly: 'ALWAYS',
    // },
    // {
    //   id: 'minion',
    //   name: 'Minion',
    //   nameVi: 'Kẻ Phản Bội',
    //   description: 'First night, werewolves choose you. You know them but don\'t act with them.',
    //   descriptionVi: 'Đêm đầu, sói chọn bạn. Bạn biết họ nhưng không hoạt động cùng họ.',
    //   faction: 'WEREWOLF',
    //   balancePoints: -6,
    //   nightly: 'FIRST_NIGHT',
    // },
    // {
    //   id: 'wolf-cub',
    //   name: 'Wolf Cub',
    //   nameVi: 'Sói Con',
    //   description: 'Acts like a werewolf. If you die, werewolves can kill 2 players the next night.',
    //   descriptionVi: 'Hoạt động như một con sói. Nếu bạn chết, sói có thể giết 2 người vào đêm tiếp theo.',
    //   faction: 'WEREWOLF',
    //   balancePoints: -8,
    //   nightly: 'ALWAYS',
    // },
    // {
    //   id: 'dire-wolf',
    //   name: 'Dire Wolf',
    //   nameVi: 'Sói Tuyết',
    //   description: 'Choose a companion on first night. If they die, you die too.',
    //   descriptionVi: 'Chọn người đồng hành đêm đầu. Nếu họ chết, bạn cũng chết theo.',
    //   faction: 'WEREWOLF',
    //   balancePoints: -4,
    //   nightly: 'ALWAYS',
    // },
    // {
    //   id: 'lone-wolf',
    //   name: 'Lone Wolf',
    //   nameVi: 'Sói Cô Đơn',
    //   description: 'You only win if you are the last person alive.',
    //   descriptionVi: 'Bạn chỉ thắng nếu bạn là người sống sót cuối cùng.',
    //   faction: 'WEREWOLF',
    //   balancePoints: -5,
    //   nightly: 'ALWAYS',
    // },
    // {
    //   id: 'fruit-brute',
    //   name: 'Fruit Brute',
    //   nameVi: 'Sói Ăn Chay',
    //   description: 'Acts like a werewolf. If you\'re the last werewolf, you don\'t kill.',
    //   descriptionVi: 'Hoạt động như một con sói. Nếu bạn là sói cuối cùng, bạn không giết.',
    //   faction: 'WEREWOLF',
    //   balancePoints: -3,
    //   nightly: 'ALWAYS',
    // },
    // {
    //   id: 'fang-face',
    //   name: 'Fang Face',
    //   nameVi: 'Nanh Sói',
    //   description: 'First night, wake with werewolves. If other werewolves exist, don\'t wake on other nights.',
    //   descriptionVi: 'Đêm đầu, thức dậy với sói. Nếu còn sói khác, không thức dậy vào các đêm khác.',
    //   faction: 'WEREWOLF',
    //   balancePoints: -5,
    //   nightly: 'FIRST_NIGHT',
    // },
    // {
    //   id: 'wolverine',
    //   name: 'Wolverine',
    //   nameVi: 'Nhím Sói',
    //   description: 'Wake with werewolves each night. If you\'re closest to the victim, werewolves hear metallic sounds.',
    //   descriptionVi: 'Thức dậy với sói mỗi đêm. Nếu bạn gần nạn nhân nhất, sói nghe thấy tiếng kim loại.',
    //   faction: 'WEREWOLF',
    //   balancePoints: -4,
    //   nightly: 'ALWAYS',
    // },

    // // SPECIAL FACTIONS
    // {
    //   id: 'cursed',
    //   name: 'Cursed',
    //   nameVi: 'Kẻ Bị Nguyền',
    //   description: 'Initially a villager. If bitten by werewolf, become one the next night.',
    //   descriptionVi: 'Ban đầu là dân làng. Nếu bị sói cắn, trở thành sói vào đêm tiếp theo.',
    //   faction: 'SPECIAL',
    //   balancePoints: -3,
    //   nightly: 'ALWAYS',
    // },
    // {
    //   id: 'doppelganger',
    //   name: 'Doppelgänger',
    //   nameVi: 'Nhân Bản',
    //   description: 'Choose a player on first night. If they die at night, assume their role.',
    //   descriptionVi: 'Chọn một người chơi đêm đầu. Nếu họ chết vào đêm, đảm nhận vai trò của họ.',
    //   faction: 'SPECIAL',
    //   balancePoints: -2,
    //   nightly: 'FIRST_NIGHT',
    // },
    // {
    //   id: 'drunk',
    //   name: 'Drunk',
    //   nameVi: 'Say Rượu',
    //   description: 'Think you\'re a villager for 2 days. Learn your actual role on night 3.',
    //   descriptionVi: 'Nghĩ bạn là dân làng trong 2 ngày. Biết vai trò thực tế vào đêm 3.',
    //   faction: 'SPECIAL',
    //   balancePoints: 4,
    //   nightly: 'FIRST_NIGHT',
    // },
    // {
    //   id: 'cult-leader',
    //   name: 'Cult Leader',
    //   nameVi: 'Trưởng Giáo Phái',
    //   description: 'Each night, recruit a player. Win when all remaining players are cult members.',
    //   descriptionVi: 'Mỗi đêm, tuyển dụng một người chơi. Thắng khi tất cả còn lại là thành viên giáo phái.',
    //   faction: 'SPECIAL',
    //   balancePoints: 1,
    //   nightly: 'ALWAYS',
    // },
    // {
    //   id: 'hoodlum',
    //   name: 'Hoodlum',
    //   nameVi: 'Du Côn',
    //   description: 'Choose 2 players first night. Win if both die by game end.',
    //   descriptionVi: 'Chọn 2 người chơi đêm đầu. Thắng nếu cả hai chết vào cuối game.',
    //   faction: 'SPECIAL',
    //   balancePoints: 0,
    //   nightly: 'FIRST_NIGHT',
    // },
    // {
    //   id: 'tanner',
    //   name: 'Tanner',
    //   nameVi: 'Chán Đời',
    //   description: 'You win if you are eliminated by any means.',
    //   descriptionVi: 'Bạn thắng nếu bị loại bỏ bằng bất kỳ cách nào.',
    //   faction: 'SPECIAL',
    //   balancePoints: 1,
    //   nightly: 'NEVER',
    // },
    // {
    //   id: 'vampire',
    //   name: 'Vampire',
    //   nameVi: 'Ma Cà Rồng',
    //   description: 'Each night, choose a victim. They die at dusk. Vampires can\'t be killed by werewolves.',
    //   descriptionVi: 'Mỗi đêm, chọn một nạn nhân. Họ chết lúc chạng vạng. Ma Cà Rồng không thể bị sói giết.',
    //   faction: 'SPECIAL',
    //   balancePoints: -7,
    //   nightly: 'ALWAYS',
    // },
    // {
    //   id: 'lycan',
    //   name: 'Lycan',
    //   nameVi: 'Người Hóa Sói',
    //   description: 'You are a villager but appear as a werewolf to the Seer.',
    //   descriptionVi: 'Bạn là dân làng nhưng xuất hiện là sói cho Tiên Tri.',
    //   faction: 'SPECIAL',
    //   balancePoints: -1,
    //   nightly: 'NEVER',
    // },
]

export const useRolesStore = defineStore('roles', {
    state: () => ({
        roles: defaultRoles as Role[],
        selectedRoles: {} as { [roleId: string]: number },
    }),

    getters: {
        allRoles: (state) => state.roles,

        rolesByFaction: (state) => {
            return (faction: Role['faction']) => {
                return state.roles.filter(role => role.faction === faction)
            }
        },

        totalBalancePoints: (state) => {
            return Object.entries(state.selectedRoles).reduce((total, [roleId, count]) => {
                const role = state.roles.find(r => r.id === roleId)
                return total + (role?.balancePoints ?? 0) * count
            }, 0)
        },

        balanceStatus() {
            const points = this.totalBalancePoints
            if (points === 0) return 'perfect'
            if (points > 0 && points <= 5) return 'light-green'
            if (points < 0 && points >= -5) return 'light-red'
            return 'red'
        },

        totalRoleCount: (state) => {
            return Object.values(state.selectedRoles).reduce((sum, count) => sum + count, 0)
        },
    },

    actions: {
        addRole(roleId: string, quantity: number = 1) {
            if (!this.selectedRoles[roleId]) {
                this.selectedRoles[roleId] = 0
            }
            this.selectedRoles[roleId] += quantity
        },

        removeRole(roleId: string, quantity: number = 1) {
            if (this.selectedRoles[roleId]) {
                this.selectedRoles[roleId] = Math.max(0, this.selectedRoles[roleId] - quantity)
                if (this.selectedRoles[roleId] === 0) {
                    delete this.selectedRoles[roleId]
                }
            }
        },

        setRoleQuantity(roleId: string, quantity: number) {
            if (quantity <= 0) {
                delete this.selectedRoles[roleId]
            } else {
                this.selectedRoles[roleId] = quantity
            }
        },

        getRoleQuantity(roleId: string): number {
            return this.selectedRoles[roleId] ?? 0
        },

        clearAllRoles() {
            this.selectedRoles = {}
        },

        setSelectedRoles(roles: { [roleId: string]: number }) {
            this.selectedRoles = roles
        },

        getRoleById(roleId: string): Role | undefined {
            return this.roles.find(r => r.id === roleId)
        },

        getRoleName(roleId: string): string {
            return this.getRoleById(roleId)?.name || 'Unknown'
        },

        getFactionLabel(faction: Role['faction']): string {
            const { t } = useI18n()
            const labels: Record<Role['faction'], string> = {
                [RoleFaction.VILLAGER]: '🏘️ ' + t('roles.villagers'),
                [RoleFaction.WEREWOLF]: '🐺 ' + t('roles.werewolves'),
                [RoleFaction.CULT]: '🔮 ' + t('roles.cult'),
                [RoleFaction.VAMPIRE]: '🧛 ' + t('roles.vampire'),
                [RoleFaction.SPECIAL]: '✨ ' + t('roles.special'),
            }
            return labels[faction] || faction
        },

        getRoleDescription(roleId: string): string {
            return this.getRoleById(roleId)?.description || ''
        },

        getRolePoints(roleId: string): number {
            return this.getRoleById(roleId)?.balancePoints ?? 0
        },

        addCustomRole(role: Role) {
            const index = this.roles.findIndex(r => r.id === role.id)
            if (index === -1) {
                this.roles.push(role)
            } else {
                this.roles[index] = role
            }
        },
    },

    persist: {
        pick: [
            'selectedRoles',
        ]
    },
})
