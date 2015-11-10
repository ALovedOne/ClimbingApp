# Create your views here.
from django.shortcuts import render

from models import *

def home(request):
  return render(request, 'ClimbingApp/index.html')


def viewWall(request, id):
  return render(request, 'ClimbingApp/viewWall.html')
