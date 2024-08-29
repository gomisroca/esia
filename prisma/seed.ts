import { db } from '../src/server/db';
import supabase from '../src/supabase';

interface ArtistResponse {
  id: number;
  title: string;
  birth_date?: number;
  death_date?: number;
  description?: string;
}

interface ArtworkResponse {
  id: string;
  title: string;
  date_display: string;
  image_id: string;
  place_of_origin: string;
  artist_title: string;
  artist_id: number;
  style_title: string;
  style_id: string;
  medium_display: string;
}

interface Response {
  pagination: {
    next_url: string;
  };
  data: ArtworkResponse[];
}

interface Artist {
  name: string;
  id: number;
}

interface TransformedArtwork {
  name: string;
  artist?: Artist;
  medium?: string;
  date?: string;
  origin?: string;
  style?: string;
  image?: string;
}

async function getAllArtworks() {
  const artworks: ArtworkResponse[] = [];
  let nextUrl = 'https://api.artic.edu/api/v1/artworks?search?query[term][is_public_domain]=true&limit=100&page=6';
  let count = 6;

  while (count < 10) {
    try {
      const response = await fetch(nextUrl);
      if (!response.ok) {
        console.error(`Failed to fetch artworks, status: ${response.status}`);
        break;
      }

      const res: Response = await response.json();
      const newArtworks = res.data.filter((x) => x.artist_title !== null);
      artworks.push(...newArtworks);

      if (!res.pagination.next_url) break;

      count++;
      nextUrl = `https://api.artic.edu/api/v1/artworks?search?query[term][is_public_domain]=true&limit=100&page=${count}`;
    } catch (error) {
      console.error('Error fetching artworks:', error);
      break;
    }
  }

  console.log(`Total artworks retrieved: ${artworks.length}`);
  return artworks;
}

async function transformArtwork(artwork: ArtworkResponse): Promise<TransformedArtwork | null> {
  try {
    const imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
    const image = await uploadImageFromUrl(imageUrl, 'art', `${artwork.id}.jpg`);

    return {
      name: artwork.title,
      artist: { name: artwork.artist_title, id: artwork.artist_id },
      medium: artwork.medium_display || undefined,
      date: artwork.date_display || undefined,
      origin: artwork.place_of_origin || undefined,
      style: artwork.style_title || undefined,
      image: image?.path || undefined,
    };
  } catch (error) {
    console.error('Error transforming artwork:', error);
    return null;
  }
}

async function uploadImageFromUrl(imageUrl: string, bucketName: string, fileName: string) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image. Status: ${response.status}`);

    const blob = await response.blob();
    const { data, error } = await supabase.storage.from(bucketName).upload(fileName, blob, {
      contentType: blob.type,
      upsert: true,
    });

    if (error) throw new Error(`Failed to upload image to Supabase: ${error.message}`);

    console.log('Image uploaded successfully:', data);
    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

async function getOrCreateArtist(artist: Artist) {
  try {
    const response = await fetch(`https://api.artic.edu/api/v1/artists/${artist.id}`);
    if (!response.ok) throw new Error(`Failed to fetch artist. Status: ${response.status}`);

    const artistRes = await response.json();
    const artistResponse: ArtistResponse = artistRes.data;

    const dbArtist = await db.artist.upsert({
      where: { name: artistResponse.title },
      update: {},
      create: {
        name: artistResponse.title,
        birth: artistResponse.birth_date,
        death: artistResponse.death_date,
        description: artistResponse.description,
      },
    });

    return dbArtist;
  } catch (error) {
    console.error('Error getting or creating artist:', error);
    return null;
  }
}

async function saveArtwork(artwork: TransformedArtwork, artistId: string) {
  try {
    const link = await supabase.storage.from('art').getPublicUrl(artwork.image!);
    if (!link.data.publicUrl) throw new Error('Failed to get public URL for the image.');

    await db.artwork.upsert({
      where: { name: artwork.name },
      update: {},
      create: {
        name: artwork.name,
        medium: artwork.medium,
        artistId: artistId,
        date: artwork.date,
        origin: artwork.origin,
        style: artwork.style,
        image: link.data.publicUrl,
      },
    });
  } catch (error) {
    console.error('Error saving artwork:', error);
  }
}

async function main() {
  try {
    const artworks = await getAllArtworks();

    for (const artwork of artworks) {
      const existingArtwork = await db.artwork.findUnique({
        where: { name: artwork.title },
      });

      if (!existingArtwork) {
        setTimeout(async () => {
          const transformedArtwork = await transformArtwork(artwork);
          if (transformedArtwork && transformedArtwork.image && transformedArtwork.artist?.id) {
            const artist = await getOrCreateArtist(transformedArtwork.artist);
            if (artist) {
              await saveArtwork(transformedArtwork, artist.id);
            }
          }
        }, 2000);
      }
    }
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    await db.$disconnect();
  }
}

main().catch((e) => {
  console.error('Unhandled error in main:', e);
  process.exit(1);
});
