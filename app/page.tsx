'use client';

import React, { useState, useEffect } from 'react';
import BookForm from '@/components/BookForm';
import BookList from '@/components/BookList';

type Book = {
  id: number;
  title: string;
  author: string;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editBook, setEditBook] = useState<Book | null>(null);

  // Saare books laane ke liye
  useEffect(() => {
    fetch('/api/books')
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  // Naya book add karna
  const addBook = (title: string, author: string) => {
    fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, author }),
    })
      .then((res) => res.json())
      .then((newBook) => setBooks((prev) => [...prev, newBook]));
  };

  // Book update karna
  const updateBook = (title: string, author: string) => {
    if (!editBook) return;

    fetch(`/api/books`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: editBook.id, title, author }),
    })
      .then((res) => res.json())
      .then((updatedBook) => {
        setBooks((prev) =>
          prev.map((book) => (book.id === updatedBook.id ? updatedBook : book))
        );
        setEditBook(null);
      });
  };

  // Book delete karna
  const deleteBook = (id: number) => {
    fetch(`/api/books`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then(() => setBooks((prev) => prev.filter((book) => book.id !== id)));
  };

  return (
    <div className="max-w-md mx-auto my-10 p-5 border rounded shadow">
      <h1 className="text-center font-bold text-2xl mb-5">Books Management</h1>
      <BookForm
        onSubmit={editBook ? updateBook : addBook}
        editMode={!!editBook}
        initialTitle={editBook?.title || ''}
        initialAuthor={editBook?.author || ''}
      />
      <BookList books={books} onEdit={setEditBook} onDelete={deleteBook} />
    </div>
  );
}
