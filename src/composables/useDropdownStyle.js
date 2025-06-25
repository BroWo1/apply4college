import { ref } from 'vue'

/**
 * Composable for universal dropdown styling and configuration
 * Provides consistent glass effect styling across all dropdowns
 */
export const useDropdownStyle = () => {
  // Standard dropdown configuration
  const dropdownConfig = {
    variant: 'outlined',
    density: 'comfortable',
    rounded: 'lg',
    menuProps: { transition: 'slide-y-transition' },
    class: 'custom-select'
  }

  // Action menu configuration  
  const actionMenuConfig = {
    location: 'bottom end',
    transition: 'slide-y-transition',
    class: 'essay-actions-menu'
  }

  // Action menu card configuration
  const actionMenuCardConfig = {
    minWidth: '160',
    rounded: 'xl',
    elevation: '4',
    class: 'action-menu-card'
  }

  // Action menu list configuration
  const actionMenuListConfig = {
    nav: true,
    density: 'compact',
    class: 'pa-2'
  }

  // Standard action menu items
  const createActionMenuItem = (icon, title, action, isDanger = false) => ({
    icon,
    title,
    action,
    class: `action-menu-item${isDanger ? ' action-menu-item--danger' : ''}`,
    props: {
      rounded: 'lg',
      baseColor: isDanger ? 'error' : undefined
    }
  })

  // Glass effect utility classes
  const glassClasses = {
    button: 'glass-btn',
    card: 'glass-card',
    chip: 'beta-chip'
  }

  return {
    dropdownConfig,
    actionMenuConfig,
    actionMenuCardConfig,
    actionMenuListConfig,
    createActionMenuItem,
    glassClasses
  }
}

/**
 * Standard dropdown item template configuration
 */
export const useDropdownItemTemplate = () => {
  const getItemProps = (props, item, customClass = '') => ({
    ...props,
    title: item.title,
    value: item.value,
    rounded: 'lg',
    class: `custom-select-item ${customClass}`.trim()
  })

  return {
    getItemProps
  }
}
