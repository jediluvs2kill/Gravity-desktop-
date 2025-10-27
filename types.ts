
import type React from 'react';

export interface AppDefinition {
  id: string;
  name: string;
  icon: React.FC<{ className?: string }>;
  content: React.ReactNode;
}
