// To prevent error you need to set this before calling UnityLoader.instantiate()
UnityLoader.Compression.gzip = UnityLoader.Compression.identity;
UnityLoader.Compression.brotli = UnityLoader.Compression.identity;
UnityLoader.Compression.identity.hasUnityMarker = function() { return false;};
UnityLoader.Cryptography.crc32 = null;
UnityLoader.Cryptography.sha1 = null;