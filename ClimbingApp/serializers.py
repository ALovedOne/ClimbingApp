from rest_framework import serializers
from .models import *

class GymSerializer(serializers.ModelSerializer):
  class Meta:
    model = Gym
