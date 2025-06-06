import { createClient } from "@supabase/supabase-js";

//API keys are imported from a .env file (included in git.ignore) so it is not hardcoded into the source code.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

 {/* Can choose to export it instead of manually typing everything */}

export const supabase = createClient(supabaseUrl, supabaseKey); //allows to interact with the supabase database