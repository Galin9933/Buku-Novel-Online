import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Asumsi Anda punya file firebase.js
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

function App() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Tambahkan state loading

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Ambil data dari Firestore, diurutkan berdasarkan tanggal pembuatan
        const booksCollection = collection(db, 'novels');
        const q = query(booksCollection, orderBy('createdAt', 'desc'));
        const booksSnapshot = await getDocs(q);
        const booksData = booksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books: ", error);
      } finally {
        setIsLoading(false); // Set loading ke false setelah selesai
      }
    };

    fetchBooks();
  }, []); // Dependency array kosong agar hanya berjalan sekali

  // ... sisa kode komponen Anda
  // Anda bisa menampilkan pesan "Loading..." jika isLoading === true
}