import { createClient } from '@/lib/supabase/server';

export const ADMIN_DISCORD_ID = '409098047344345088';

export async function getAdminUser() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const discordId = user.identities?.find(i => i.provider === 'discord')?.id;
    if (discordId !== ADMIN_DISCORD_ID) return null;
    return user;
  } catch {
    return null;
  }
}
