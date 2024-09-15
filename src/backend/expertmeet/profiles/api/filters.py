from typing import ClassVar

from django.db.models import Q
from django_filters import rest_framework as filters
from profiles.models import Category, Profile


class ProfileFilter(filters.FilterSet):
    class Meta:
        model = Profile
        fields: ClassVar = ["username", "category"]

    username = filters.CharFilter(method="filter_by_name")
    category = filters.ModelMultipleChoiceFilter(
        queryset=Category.objects.all(),
    )

    def filter_by_name(self, queryset, _name, value):
        if value:
            return queryset.filter(Q(user__first_name__icontains=value) | Q(user__last_name__icontains=value))
        return queryset
