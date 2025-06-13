
export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'welcome' | 'general' | 'appointment' | 'location' | 'schedule' | 'emergency';
  quickReplies?: string[];
}

export type QuickAction = {
  text: string;
  action: () => void;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
