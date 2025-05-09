import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function testDatabasePolicies() {
  try {
    console.log("Testing Supabase RLS policies...");
    const results: any = {};

    // 1. Test public property read
    console.log("1. Testing public property read...");
    const { data: publicProps, error: publicError } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'PUBLISHED')
      .limit(1);
    
    results.publicRead = {
      success: !publicError,
      error: publicError?.message,
      data: publicProps
    };

    // 2. Test creating a user
    console.log("2. Testing user creation...");
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        wallet_address: `0x${Math.random().toString(16).slice(2)}`,
        email: `test${Date.now()}@example.com`,
        kyc_status: 'PENDING'
      })
      .select()
      .single();

    results.userCreate = {
      success: !userError,
      error: userError?.message,
      data: newUser
    };

    // 3. Test KYC document creation (should fail without auth)
    console.log("3. Testing KYC document creation...");
    const { data: kycDoc, error: kycError } = await supabase
      .from('kyc_documents')
      .insert({
        user_id: newUser?.id,
        document_type: 'TEST',
        document_hash: 'test_hash'
      });

    results.kycCreate = {
      success: !kycError,
      error: kycError?.message,
      data: kycDoc
    };

    return {
      success: true,
      results
    };

  } catch (error) {
    console.error("❌ Policy tests failed:", error);
    return {
      success: false,
      error
    };
  }
}
