# Create your views here.
from django.shortcuts import render

def home(request):
  return render(request, 'ClimbingApp/index.html')
