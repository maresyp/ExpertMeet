from typing import ClassVar

from django_filters import rest_framework as filters
from profiles.models import Category, Profile


class ProfileFilter(filters.FilterSet):
    username = filters.CharFilter(lookup_expr="icontains")
    category = filters.ModelMultipleChoiceFilter(
        queryset=Category.objects.all(),
    )

    class Meta:
        model = Profile
        fields: ClassVar = ["username", "category"]
