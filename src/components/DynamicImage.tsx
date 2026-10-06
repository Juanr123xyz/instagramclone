import React, { useEffect, useState, useRef } from 'react';
import { Image, View, ActivityIndicator, StyleSheet, ImageStyle, StyleProp } from 'react-native';
import { imageCacheManager } from '../cache/ImageCacheManager';

interface DynamicImageProps {
  uri: string;
  style: StyleProp<ImageStyle>;
  isViewable?: boolean;
}

// Reliable fallback placeholder image if network or CORS blocks external unsplash URL
const FALLBACK_IMAGE = 'https://picsum.photos/800/800';

export const DynamicImage: React.FC<DynamicImageProps> = ({ uri, style, isViewable = true }) => {
  // Initialize resolvedUri directly with uri so images display immediately!
  const [resolvedUri, setResolvedUri] = useState<string>(uri || FALLBACK_IMAGE);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let isMounted = true;
    setResolvedUri(uri || FALLBACK_IMAGE);
    setHasError(false);

    if (!isViewable) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      imageCacheManager.cancelDownload(uri);
      return;
    }

    const loadImage = async () => {
      abortControllerRef.current = new AbortController();
      try {
        const cachedPath = await imageCacheManager.fetchImage(uri, abortControllerRef.current.signal);
        if (isMounted && cachedPath) {
          setResolvedUri(cachedPath);
        }
      } catch (err: any) {
        if (isMounted) {
          setResolvedUri(uri);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      imageCacheManager.cancelDownload(uri);
    };
  }, [uri, isViewable]);

  const handleImageError = () => {
    // If external image fails to load, swap to fallback placeholder
    if (!hasError) {
      setHasError(true);
      setResolvedUri(`https://picsum.photos/seed/${encodeURIComponent(uri || 'insta')}/600/600`);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#E1306C" />
        </View>
      )}
      <Image
        source={{ uri: resolvedUri }}
        style={style}
        resizeMode="cover"
        onLoadStart={() => setLoading(false)}
        onLoadEnd={() => setLoading(false)}
        onError={handleImageError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    zIndex: 1,
  },
});
