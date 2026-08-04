from rest_framework import serializers

from .models import Book


class BookSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="book_id")
    status = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ["id", "title", "author", "category", "copies", "status"]

    def get_status(self, obj):
        return "Available" if obj.copies > 0 else "Borrowed"

    def validate_id(self, value):
        qs = Book.objects.filter(book_id=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Book ID already exists.")
        return value
