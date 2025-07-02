
interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      is_bot?: boolean;
    };
    chat?: {
      id: number;
      type: string;
      title?: string;
      username?: string;
    };
    start_param?: string;
    auth_date?: number;
    hash?: string;
  };
  ready(): void;
  close(): void;
  expand(): void;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  enableClosingConfirmation(): void;
  disableClosingConfirmation(): void;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    setText(text: string): void;
    onClick(callback: () => void): void;
    show(): void;
    hide(): void;
  };
  BackButton: {
    isVisible: boolean;
    onClick(callback: () => void): void;
    show(): void;
    hide(): void;
  };
  // Device orientation methods
  DeviceOrientation: {
    isStarted: boolean;
    absolute: boolean;
    alpha: number;
    beta: number;
    gamma: number;
    start(params?: { refresh_rate?: number; need_absolute?: boolean }, callback?: (success: boolean) => void): void;
    stop(callback?: (success: boolean) => void): void;
  };
  // Accelerometer methods  
  Accelerometer: {
    isStarted: boolean;
    x: number;
    y: number;
    z: number;
    start(params?: { refresh_rate?: number }, callback?: (success: boolean) => void): void;
    stop(callback?: (success: boolean) => void): void;
  };
  // Gyroscope methods
  Gyroscope: {
    isStarted: boolean;
    x: number;
    y: number;
    z: number;
    start(params?: { refresh_rate?: number }, callback?: (success: boolean) => void): void;
    stop(callback?: (success: boolean) => void): void;
  };
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}
