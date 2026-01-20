import React from 'react';
import PropTypes from 'prop-types';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  Home, 
  Coffee,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const icons = {
  Users,
  BookOpen,
  Calendar,
  CreditCard,
  Home,
  Coffee
};

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    text: 'text-blue-700'
  },
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    text: 'text-green-700'
  },
  yellow: {
    bg: 'bg-yellow-50',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    text: 'text-yellow-700'
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    text: 'text-red-700'
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    text: 'text-purple-700'
  },
  orange: {
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    text: 'text-orange-700'
  }
};

const StatCard = ({ title, value, change, icon, color }) => {
  const Icon = icons[icon];
  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`${colors.bg} rounded-xl p-5 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div className={`${colors.iconBg} p-3 rounded-lg`}>
          <Icon className={`${colors.iconColor} w-6 h-6`} />
        </div>
        <div className={`flex items-center ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {change.startsWith('+') ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className={`text-sm font-medium ${colors.text} mt-1`}>{title}</p>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string,
  icon: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'yellow', 'red', 'purple', 'orange'])
};

StatCard.defaultProps = {
  change: '+0%',
  color: 'blue'
};

export default StatCard;