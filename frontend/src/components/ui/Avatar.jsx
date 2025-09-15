import { User, Briefcase, UserCheck } from 'lucide-react';

const Avatar = ({ 
  src, 
  alt = "Profile", 
  size = "md", 
  role = null, 
  showRoleBadge = false,
  className = "" 
}) => {
  // Size variants
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8", 
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  // Role badge configurations
  const roleBadges = {
    recruiter: {
      color: "bg-blue-500",
      icon: Briefcase,
      label: "Recruiter",
      ringColor: "ring-blue-500"
    },
    candidate: {
      color: "bg-green-500", 
      icon: UserCheck,
      label: "Candidate",
      ringColor: "ring-green-500"
    },
    admin: {
      color: "bg-purple-500",
      icon: User,
      label: "Admin",
      ringColor: "ring-purple-500"
    }
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const badgeConfig = role ? roleBadges[role] : null;

  // Badge size based on avatar size
  const badgeSizes = {
    xs: "w-2 h-2",
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5", 
    lg: "w-4 h-4",
    xl: "w-6 h-6"
  };

  const iconSizes = {
    xs: "w-1 h-1",
    sm: "w-2 h-2", 
    md: "w-2.5 h-2.5",
    lg: "w-2.5 h-2.5",
    xl: "w-3 h-3"
  };

  // Ring width based on avatar size (thinner for smaller sizes)
  const ringWidths = {
    xs: "ring-1",
    sm: "ring-2",
    md: "ring-2",
    lg: "ring-3", 
    xl: "ring-4"
  };

  const badgeSize = badgeSizes[size] || badgeSizes.md;
  const iconSize = iconSizes[size] || iconSizes.md;
  const ringWidth = ringWidths[size] || ringWidths.md;
  const ringColor = badgeConfig?.ringColor || "ring-blue-500";

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Avatar */}
      <div className={`${sizeClass} rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ${ringWidth} ${ringColor} ring-offset-2 shadow-lg`}>
        {src ? (
          <img 
            src={src} 
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        {!src && (
          <User className={`${iconSize} text-gray-400`} />
        )}
      </div>

      {/* Role Badge */}
      {showRoleBadge && badgeConfig && (
        <div 
          className={`absolute -bottom-0.5 -right-0.5 ${badgeSize} ${badgeConfig.color} rounded-full flex items-center justify-center border-2 border-white shadow-sm`}
          title={badgeConfig.label}
        >
          <badgeConfig.icon className={`${iconSize} text-white`} />
        </div>
      )}
    </div>
  );
};

export default Avatar;