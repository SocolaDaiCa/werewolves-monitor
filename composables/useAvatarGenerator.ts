/**
 * Avatar generation utility
 * Generates default avatars using initials and colors
 */

export const useAvatarGenerator = () => {
  // Color palette for avatars
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1',
    '#FFA07A', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E2', '#F8B88B',
    '#A8D5BA', '#D7BDE2', '#F1948A',
  ]

  /**
   * Generate a default avatar from user initials
   */
  function generateAvatarFromName(name: string): string {
    const initials = name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    // Select color based on name hash
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const color = colors[hash % colors.length]

    // Create SVG avatar
    const svg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="${color}" />
        <text x="100" y="110" font-size="80" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial, sans-serif">
          ${initials}
        </text>
      </svg>
    `

    // Convert SVG to base64
    const base64 = btoa(svg.trim())
    return `data:image/svg+xml;base64,${base64}`
  }

  /**
   * Convert a file to base64 string
   */
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * Validate image file
   */
  function isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    return validTypes.includes(file.type) && file.size <= maxSize
  }

  return {
    generateAvatarFromName,
    fileToBase64,
    isValidImageFile,
  }
}


