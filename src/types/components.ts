import { Property } from './property';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface PropertyQuickViewProps {
  property: Property;
  onClose: () => void;
}
