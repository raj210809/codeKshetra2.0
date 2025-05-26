import { authOptions } from '@/lib/auth';
import { createAuthenticatedSupabaseClient } from '@/lib/createAuthenticatedSupabaseClient';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  //@ts-ignore
  if (!session || !session.user?.address) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const supabase = createAuthenticatedSupabaseClient(session);

    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    // Include the user's address in the file path
    //@ts-ignore
    const filePath = `${session.user.address}/${fileName}`;

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, file);

    if (error) {
      console.error('Supabase storage error:', error);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    // Get the public URL of the uploaded file
    const { data: { publicUrl }} = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(data.path);

 
      const { error: updateError } = await supabase
      .from('user_details')  // Changed from 'users' to 'user_details'
      .update({ profile_image: publicUrl })
      //@ts-ignore
      .eq('evmAddress', session.user.address);  // Changed from 'address' to 'evmAddress'
    
    if (updateError) {
      console.error('Error updating user profile:', updateError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Image uploaded successfully', imageUrl: publicUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}