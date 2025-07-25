import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export const supabase = createClient<Database>(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
	{
		auth: {
			storage: localStorage,
			persistSession: true,
			autoRefreshToken: true,
		},
	}
);
