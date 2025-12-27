// API Types based on OpenAPI schema
export interface User {
  id: number;
  username: string;
  email: string;
  profile_picture?: string;
  user_class: string;
  total_credit: string;
  locked_credit: string;
  available_credit: string;
  lifetime_upload: number;
  lifetime_download: number;
  ratio: string;
  download_multiplier: string;
  max_torrents: string;
  is_banned: boolean;
  date_joined: string;
  last_login?: string;
  // Admin fields (may not be present in all responses)
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface UserRegistrationRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  invite_code: string;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  message: string;
  tokens: TokenPair;
  user: User;
}

export interface Torrent {
  id: number;
  info_hash: string;
  name: string;
  size: number;
  size_formatted: number;
  files_count: number;
  created_by_username: string;
  created_at: string;
  category: number | null;
  category_name: string | null;
  category_slug: string | null;
  is_private: boolean;
  age_days: number;
  // Legacy fields for compatibility
  description?: string;
  tags?: string[];
  uploader?: User;
  uploaded_at?: string;
  seeders?: number;
  leechers?: number;
  completed?: number;
  health?: 'healthy' | 'warning' | 'critical';
  is_active?: boolean;
  file_count?: number;
  files?: TorrentFile[];
}

export interface TorrentFile {
  id: number;
  torrent: string;
  filename: string;
  size: number;
  index: number;
}

export interface TorrentUploadRequest {
  torrent_file: File;
  name: string;
  description: string;
  category: string;
  tags?: string[];
}

export interface TorrentCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  count: number;
}

export interface CreditTransaction {
  id: number;
  user_username: string;
  torrent_name: string | null;
  transaction_type: string;
  amount: string;
  description: string;
  status: string;
  created_at: string;
  processed_at: string | null;
}

export interface UserClassRequirements {
  min_ratio: number;
  min_upload: number;
  account_age_days: number;
}

export interface UserClassBenefits {
  download_multiplier: number;
  bonus_points: number;
}

export interface UserClassRestrictions {
  max_torrents: number;
  max_download_speed: string;
}

export interface UserClassDetails {
  requirements: UserClassRequirements;
  benefits: UserClassBenefits;
  restrictions: UserClassRestrictions;
}

export interface UserClassesResponse {
  [className: string]: UserClassDetails;
}

// For backward compatibility and easier usage
export interface UserClass {
  name: string;
  requirements: UserClassRequirements;
  benefits: UserClassBenefits;
  restrictions: UserClassRestrictions;
}

export interface SuspiciousActivity {
  id: number;
  user: User;
  activity_type: string;
  description: string;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface IPBlock {
  id: number;
  ip_address: string;
  reason: string;
  blocked_by: User;
  created_at: string;
  expires_at?: string;
  is_active: boolean;
}

export interface SystemAlert {
  id: number;
  alert_type: 'info' | 'warning' | 'error' | 'critical';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  details?: any;
  user?: User;
  torrent?: Torrent;
  created_at: string;
  resolved_at?: string;
  resolved_by?: User;
}

export interface SystemLog {
  id: number;
  timestamp: string;
  level: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  message: string;
  user?: User;
  ip_address?: string;
  endpoint?: string;
  method?: string;
  status_code?: number;
}

export interface AdminDashboard {
  total_users: number;
  total_torrents: number;
  total_credit_transacted: string;
  active_peers: number;
  suspicious_activities_today: number;
  active_ip_blocks: number;
  banned_users: number;
  system_alerts: number;
  recent_logs: number;
  recent_users: User[];
  recent_suspicious: SuspiciousActivity[];
  recent_alerts: SystemAlert[];
}

export interface InviteCode {
  id: number;
  code: string;
  created_by: User;
  used_by?: User;
  created_at: string;
  used_at?: string;
  expires_at?: string;
  is_active: boolean;
}

export interface SystemConfig {
  id: number;
  key: string;
  value: any;
  description: string;
  category: string;
  is_public: boolean;
  updated_at: string;
}

// API Response types
export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface ApiError {
  detail?: string;
  [key: string]: any;
}

// Request/Response types for specific endpoints
export interface TorrentStats {
  seeders: number;
  leechers: number;
  completed: number;
  health_score: number;
  last_updated: string;
}

export interface UserStats {
  total_credit: string;
  locked_credit: string;
  available_credit: string;
  lifetime_upload: number;
  lifetime_download: number;
  ratio: string;
  user_class: string;
  active_torrents: string;
  last_announce?: string;
}

export interface RatioStatus {
  ratio: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  message: string;
  required_ratio: string;
}

export interface DownloadCheck {
  can_download: boolean;
  required_credits: string;
  user_credits: string;
  reason?: string;
}

export interface LockCreditResponse {
  success: boolean;
  transaction_id: number;
  locked_amount: string;
}

export interface CompleteDownloadResponse {
  success: boolean;
  final_amount: string;
}
