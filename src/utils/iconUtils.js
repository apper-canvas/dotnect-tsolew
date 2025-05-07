import * as LucideIcons from 'lucide-react';

const getIcon = (iconName) => {
  if (LucideIcons[iconName]) {
    return LucideIcons[iconName];
  }
  return null;
};

export default getIcon;