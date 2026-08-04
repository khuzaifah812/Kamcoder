from rest_framework import generics, filters

from .models import Book
from .permissions import IsAdminOrReadOnly
from .serializers import BookSerializer


class BookListCreateView(generics.ListCreateAPIView):
    """GET  /api/books/  -- replaces reading localStorage("libraryBooks")
    POST /api/books/  -- replaces book.html's addBook()"""

    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "author", "category", "book_id"]
    lookup_field = "book_id"


class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/PATCH/DELETE /api/books/<book_id>/ -- replaces deleteBook()/edit."""

    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "book_id"
    lookup_url_kwarg = "book_id"
