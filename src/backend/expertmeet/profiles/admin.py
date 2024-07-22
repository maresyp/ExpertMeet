from django.contrib import admin
from profiles.models import Category, Profile, Review, ReviewSummary

# Register your models here.

admin.site.register(Profile)
admin.site.register(ReviewSummary)
admin.site.register(Review)
admin.site.register(Category)
