import { upload } from "thirdweb/storage";
import { createClient } from "../app/client";
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function testStorageAndDatabase() {
  try {
    const client = createClient();
    
    // 1. Test thirdweb storage
    console.log("Testing thirdweb storage...");
    const testData = { test: "Hello from BrickChain!" };
    const uploadedUri = await upload({
      client,
      files: [{
        name: 'test.json',
        data: testData
      }]
    });
    console.log("✅ Thirdweb storage test successful. URI:", uploadedUri);

    // 2. Test Supabase connection
    console.log("Testing Supabase connection...");
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .limit(1);

    if (error) throw error;
    console.log("✅ Supabase connection test successful. Sample data:", data);

    return {
      success: true,
      thirdwebUri: uploadedUri,
      supabaseData: data
    };
  } catch (error) {
    console.error("❌ Test failed:", error);
    return {
      success: false,
      error
    };
  }
}
