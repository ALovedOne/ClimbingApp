from django.core.management.base import BaseCommand, CommandError
from ClimbingApp.models import Color

class Command(BaseCommand):
  help = 'Rebuilds stuff'

  def handle(self, *args, **options):
    for color in Color.objects.all():
      color.clean()
