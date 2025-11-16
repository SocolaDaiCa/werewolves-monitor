import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Role {
  id: string
  name: string
  nameVi: string
  description: string
  descriptionVi: string
  faction: 'VILLAGER' | 'WEREWOLF' | 'CULT' | 'VAMPIRE' | 'SPECIAL'
  balancePoints: number
  nightly: 'ALWAYS' | 'FIRST_NIGHT' | 'NEVER'
  nightOrder?: number
  actionType?: 'SELECT_PLAYER' | 'DUAL_SELECT' | 'TEXT_INPUT' | 'ACKNOWLEDGE' | 'DUAL_OPTION' | 'NONE'
  icon?: string
}

// All roles from Ultimate Werewolf with balance points and Vietnamese translations
const defaultRoles: Role[] = [
  // VILLAGER FACTION
  {
    id: 'villager',
    name: 'Villager',
    nameVi: 'Dân Làng',
    description: 'An ordinary villager trying to find and eliminate the werewolves.',
    descriptionVi: 'Một dân thường bình thường cố gắng tìm và tiêu diệt các con sói.',
    faction: 'VILLAGER',
    balancePoints: 1,
    nightly: 'NEVER',
  },
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
  },
  {
    id: 'witch',
    name: 'Witch',
    nameVi: 'Phù Thủy',
    description: 'Each night, choose to heal someone (save from death) or poison someone. One use of each potion per game.',
    descriptionVi: 'Mỗi đêm, chọn để cứu chữa ai đó (tránh tử) hoặc làm ai đó bị độc. Mỗi loại thuốc dùng một lần mỗi game.',
    faction: 'VILLAGER',
    balancePoints: 4,
    nightly: 'ALWAYS',
    nightOrder: 13,
    actionType: 'DUAL_OPTION',
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
  // {
  //   id: 'bodyguard',
  //   name: 'Bodyguard',
  //   nameVi: 'Bảo Vệ',
  //   description: 'Each night, choose a different player to protect from death.',
  //   descriptionVi: 'Mỗi đêm, chọn một người khác để bảo vệ khỏi cái chết.',
  //   faction: 'VILLAGER',
  //   balancePoints: 3,
  //   nightly: 'ALWAYS',
  // },
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
    id: 'werewolf',
    name: 'Werewolf',
    nameVi: 'Sói',
    description: 'Each night, choose a player to eliminate.',
    descriptionVi: 'Mỗi đêm, chọn một người chơi để tiêu diệt.',
    faction: 'WEREWOLF',
    balancePoints: -6,
    nightOrder: 5,
    nightly: 'ALWAYS',
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

export const useRolesStore = defineStore('roles', () => {
  // State
  const roles = ref<Role[]>(defaultRoles)
  const selectedRoles = ref<{ [roleId: string]: number }>({})

  // Getters
  const allRoles = computed(() => roles.value)

  const rolesByFaction = computed(() => (faction: Role['faction']) => {
    return roles.value.filter(role => role.faction === faction)
  })

  const totalBalancePoints = computed(() => {
    return Object.entries(selectedRoles.value).reduce((total, [roleId, count]) => {
      const role = roles.value.find(r => r.id === roleId)
      return total + (role?.balancePoints ?? 0) * count
    }, 0)
  })

  const balanceStatus = computed(() => {
    const points = totalBalancePoints.value
    if (points === 0) return 'perfect'
    if (points > 0 && points <= 5) return 'light-green'
    if (points < 0 && points >= -5) return 'light-red'
    return 'red'
  })

  const totalRoleCount = computed(() => {
    return Object.values(selectedRoles.value).reduce((sum, count) => sum + count, 0)
  })

  // Actions
  function addRole(roleId: string, quantity: number = 1) {
    if (!selectedRoles.value[roleId]) {
      selectedRoles.value[roleId] = 0
    }
    selectedRoles.value[roleId] += quantity
  }

  function removeRole(roleId: string, quantity: number = 1) {
    if (selectedRoles.value[roleId]) {
      selectedRoles.value[roleId] = Math.max(0, selectedRoles.value[roleId] - quantity)
      if (selectedRoles.value[roleId] === 0) {
        delete selectedRoles.value[roleId]
      }
    }
  }

  function setRoleQuantity(roleId: string, quantity: number) {
    if (quantity <= 0) {
      delete selectedRoles.value[roleId]
    } else {
      selectedRoles.value[roleId] = quantity
    }
  }

  function getRoleQuantity(roleId: string): number {
    return selectedRoles.value[roleId] ?? 0
  }

  function clearAllRoles() {
    selectedRoles.value = {}
  }

  function setSelectedRoles(roles: { [roleId: string]: number }) {
    selectedRoles.value = roles
  }

  function getRoleById(roleId: string): Role | undefined {
    return roles.value.find(r => r.id === roleId)
  }

  function addCustomRole(role: Role) {
    const index = roles.value.findIndex(r => r.id === role.id)
    if (index === -1) {
      roles.value.push(role)
    } else {
      roles.value[index] = role
    }
  }

  return {
    roles,
    selectedRoles,
    allRoles,
    rolesByFaction,
    totalBalancePoints,
    balanceStatus,
    totalRoleCount,
    addRole,
    removeRole,
    setRoleQuantity,
    getRoleQuantity,
    clearAllRoles,
    setSelectedRoles,
    getRoleById,
    addCustomRole,
  }
}, {
  persist: {
    pick: [
      'selectedRoles',
    ]
  }
})
