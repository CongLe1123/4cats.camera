const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
async function test() {
  const { data, error } = await supabase
    .from("store_settings")
    .select("social_links")
    .single();
  if (error) {
    console.log("ERROR:", error.message);
  } else {
    console.log("EXISTS:", !!data);
  }
}
test();
