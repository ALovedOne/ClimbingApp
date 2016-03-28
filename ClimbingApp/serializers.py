from rest_framework import serializers
from .models import *

class ColorSerializer(serializers.ModelSerializer):
  class Meta:
    model = Color

class DifficultySerializer(serializers.ModelSerializer):
  class Meta:
    model = Difficulty

class AscentOutcomeSerializer(serializers.ModelSerializer):
  class Meta:
    model = AscentOutcome

class GymSerializer(serializers.ModelSerializer):
  walls = serializers.PrimaryKeyRelatedField(many = True, queryset = Wall.objects.all())

  class Meta:
    model = Gym

class WallSerializer(serializers.ModelSerializer):
  class Meta:
    model = Wall

class RouteSerializer(serializers.ModelSerializer):
  class Meta:
    model = Route

class AscentSerializer(serializers.ModelSerializer):
  class Meta:
    model = Ascent
