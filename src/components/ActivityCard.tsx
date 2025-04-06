import React from 'react';
import { Calendar, PenTool as Token } from 'lucide-react';

interface Activity {
  id: number;
  name: string;
  category: string;
  date: string;
  price: string;
  image: string;
  participants?: number;
  poaps?: number;
}

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  return (
    <div className="glass-card overflow-hidden card-hover">
      <div className="h-48 overflow-hidden">
        <img 
          src={activity.image} 
          alt={activity.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
            {activity.category}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{activity.name}</h3>
        <div className="flex items-center justify-between text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-purple-400" />
            <span>{new Date(activity.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Token size={16} className="text-purple-400" />
            <span>{activity.price} EX3</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityCard;