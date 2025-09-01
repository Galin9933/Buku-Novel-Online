const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

/**
 * Cloud Function yang dipanggil oleh klien untuk mengajukan pendaftaran afiliasi.
 * Fungsi ini akan mengubah role pengguna menjadi 'affiliate_pending' secara aman.
 */
exports.requestAffiliateRegistration = functions.https.onCall(async (data, context) => {
  // 1. Pastikan pengguna sudah login.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Anda harus login untuk melakukan aksi ini."
    );
  }

  const userId = context.auth.uid;
  const userRef = db.collection("users").doc(userId);

  try {
    const userDoc = await userRef.get();

    // 2. Pastikan dokumen pengguna ada.
    if (!userDoc.exists) {
        throw new functions.https.HttpsError(
            "not-found",
            "Profil pengguna tidak ditemukan."
        );
    }
    
    const userData = userDoc.data();
    
    // 3. (Opsional) Cek apakah pengguna sudah menjadi afiliasi atau admin.
    if (userData.role === 'affiliate' || userData.role === 'admin' || userData.role === 'affiliate_pending') {
        return { success: true, message: "Status Anda sudah afiliasi atau sedang diproses." };
    }

    // 4. Lakukan pembaruan role secara aman.
    await userRef.update({ role: "affiliate_pending" });

    return { success: true, message: "Pendaftaran afiliasi berhasil diajukan." };

  } catch (error) {
    console.error("Gagal saat mengajukan afiliasi:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Terjadi kesalahan di server, silakan coba lagi."
    );
  }
});