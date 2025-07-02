
import { createClient } from '@supabase/supabase-js';

// These would normally come from environment variables
// For now using placeholder values - you'll need to replace with your actual Supabase credentials
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema for CAPTCHA verification
export interface CaptchaVerification {
  id: string;
  user_id: number;
  score: number;
  time_elapsed: number;
  solution_path: string;
  token: string;
  created_at: string;
  expires_at: string;
  is_valid: boolean;
}

// API functions for CAPTCHA verification
export const captchaAPI = {
  // Store successful CAPTCHA completion
  async storeCaptchaVerification(data: {
    userId: number;
    score: number;
    timeElapsed: number;
    solutionPath: string;
    token: string;
  }) {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minute expiry

    const { data: result, error } = await supabase
      .from('captcha_verifications')
      .insert({
        user_id: data.userId,
        score: data.score,
        time_elapsed: data.timeElapsed,
        solution_path: data.solutionPath,
        token: data.token,
        expires_at: expiresAt.toISOString(),
        is_valid: true,
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Validate token for API access
  async validateToken(token: string, userId: number) {
    const { data, error } = await supabase
      .from('captcha_verifications')
      .select('*')
      .eq('token', token)
      .eq('user_id', userId)
      .eq('is_valid', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error) return null;
    return data;
  },

  // Invalidate token after use (optional, depending on your security requirements)
  async invalidateToken(token: string) {
    const { error } = await supabase
      .from('captcha_verifications')
      .update({ is_valid: false })
      .eq('token', token);

    if (error) throw error;
  },
};
